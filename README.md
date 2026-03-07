# 🍕 CampusBite

> A comprehensive campus food ordering platform connecting students with on-campus outlets

[![GitHub](https://img.shields.io/badge/GitHub-CampusBite-blue?logo=github)](https://github.com/AyushVishwakarma-CodeHub/CampusBite)
[![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18%2B-blue?logo=react)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-v3.8%2B-blue?logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 About

**CampusBite** is a full-stack web application designed to simplify food ordering on campus. It connects hungry students with various food outlets, enabling seamless browsing, ordering, and delivery services. The platform includes an advanced AI prediction system to help outlets manage inventory efficiently.

---

## ✨ Features

### 👨‍🎓 For Students
- 🔐 Secure user authentication and registration
- 🏪 Browse multiple food outlets and menus
- 🛒 Add items to cart and manage orders
- 📦 Track order status in real-time
- ⭐ Rate and review outlets
- 📱 Responsive mobile-friendly interface

### 🏬 For Outlet Owners
- 📊 Intuitive dashboard for outlet management
- 🍽️ Manage menu items with images and prices
- 📈 View real-time orders and analytics
- 💳 Admin controls for outlet operations
- 📊 AI-powered demand prediction system

### 👨‍💼 For Administrators
- 🛡️ Full platform administration
- 📋 Manage all outlets and users
- 📊 System-wide analytics and reports
- 🔧 Platform maintenance and settings

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite
- **Styling:** CSS3
- **State Management:** Context API
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ORM:** Mongoose
- **Authentication:** JWT
- **API:** RESTful

### AI/ML
- **Language:** Python 3.8+
- **Purpose:** Demand prediction and inventory management
- **Libraries:** TensorFlow, Scikit-learn, Pandas

---

## 📁 Project Structure

```
CampusBite/
├── campusbite-web/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── context/             # Context API (Auth, Cart)
│   │   ├── api/                 # API integration
│   │   └── utils/               # Utility functions
│   ├── package.json
│   └── vite.config.js
│
├── campusbite-backend/          # Backend (Express + MongoDB)
│   ├── config/                  # Database configuration
│   ├── controllers/             # Business logic
│   ├── models/                  # Database schemas
│   ├── routes/                  # API endpoints
│   ├── middleware/              # Auth & custom middleware
│   ├── public/                  # Static files & images
│   ├── server.js                # Entry point
│   └── package.json
│
└── campusbite-ai/               # AI Module (Python)
    └── app.py                   # ML prediction engine
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** v14 or higher
- **Python** 3.8 or higher
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### Backend Setup

```bash
cd campusbite-backend

# Install dependencies
npm install

# Configure environment variables
# Create a .env file with your MongoDB connection string
# MONGODB_URI=your_mongodb_connection_string
# PORT=5000

# Seed database (optional)
npm run seed

# Start server
npm start
```

### Frontend Setup

```bash
cd campusbite-web

# Install dependencies
npm install

# Create .env file with API URL
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

### AI Module Setup

```bash
cd campusbite-ai

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run prediction service
python app.py
```

---

## 💻 Usage

### Starting the Application

1. **Start MongoDB** (if using local instance)
2. **Start Backend:**
   ```bash
   cd campusbite-backend
   npm start
   ```
3. **Start Frontend:**
   ```bash
   cd campusbite-web
   npm run dev
   ```
4. **Start AI Module** (optional, for predictions):
   ```bash
   cd campusbite-ai
   python app.py
   ```

### Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **AI Service:** http://localhost:5001

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Outlets
- `GET /api/outlets` - Get all outlets
- `GET /api/outlets/:id` - Get outlet details
- `POST /api/outlets` - Create outlet (admin)
- `PUT /api/outlets/:id` - Update outlet

### Menu
- `GET /api/menu/:outletId` - Get menu items
- `POST /api/menu` - Add menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:userId` - Get user orders
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:id` - Update order status

---

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 👨‍💻 Author

**Ayush Vishwakarma**
- GitHub: [@AyushVishwakarma-CodeHub](https://github.com/AyushVishwakarma-CodeHub)

---

## 🙏 Acknowledgments

- Campus community for feedback and support
- Open-source libraries and frameworks used
- Contributors and testers

---

## 📞 Support

For support, email ayushthesweetdabang@gmail.com or open an issue on GitHub.

---

**Made with ❤️ by the CampusBite Team**
