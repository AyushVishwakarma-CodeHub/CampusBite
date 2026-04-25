const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password_hash,
            role: role || 'student',
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // If user signed up via Google and has no password set
        if (!user.password_hash) {
            return res.status(401).json({ message: 'This account uses Google Sign-In. Please use the Google button to log in.' });
        }

        if (await bcrypt.compare(password, user.password_hash)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password_hash');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'There is no user with that email' });
        }

        // Generate token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire to 10 minutes
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Create reset url
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to this link to reset your password:</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
            <br />
            <p>If you did not request this, please ignore this email. This link will expire in 10 minutes.</p>
        `;

        try {
            console.log(`Email request for: ${user.email}`);

            if (process.env.SENDGRID_API_KEY) {
                // Professional Production Config (SendGrid HTTP API)
                console.log('Using SendGrid HTTP API for production email delivery');
                
                const data = {
                    personalizations: [{
                        to: [{ email: user.email }]
                    }],
                    from: { 
                        email: process.env.EMAIL_USER || 'campusbite.official@gmail.com',
                        name: 'CampusBite Team'
                    },
                    subject: 'CampusBite Password Reset',
                    content: [{
                        type: 'text/html',
                        value: message
                    }]
                };

                await axios.post('https://api.sendgrid.com/v3/mail/send', data, {
                    headers: {
                        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Email sent successfully via SendGrid API');
            } else {
                // Local Development Config (Gmail SMTP)
                console.log('Using Gmail SMTP for development');
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });

                await transporter.sendMail({
                    from: `"CampusBite Team" <${process.env.EMAIL_USER}>`,
                    to: user.email,
                    subject: 'CampusBite Password Reset',
                    html: message,
                });
                console.log('Email sent successfully via Gmail');
            }

            res.status(200).json({ success: true, message: 'Email sent successfully' });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            console.error('Detailed Email Failure:', error);
            return res.status(500).json({ 
                message: 'Email could not be sent. Potential network block on Render.', 
                error: error.message,
                tip: 'Check if Google flagged the login from Render IP or if port 465/587 is blocked.'
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(req.body.password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password completely reset. You may now log in.',
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const googleLogin = async (req, res) => {
    const { credential } = req.body;

    try {
        // Verify the Google id_token server-side
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            // Link Google account if not already linked
            if (!user.googleId) {
                user.googleId = googleId;
                user.avatar = picture;
                await user.save();
            }
        } else {
            // Auto-register as student
            user = await User.create({
                name,
                email,
                googleId,
                avatar: picture,
                role: 'student',
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Invalid Google token' });
    }
};

module.exports = { registerUser, loginUser, getMe, forgotPassword, resetPassword, googleLogin };
