<div align="center">
  <img src="https://campusbitelive.vercel.app/public/images/campus_cafe.png" alt="CampusBite Logo" width="120" style="border-radius: 20px;"/>
  <h1>CampusBite 🍔🎓</h1>
  <p><strong>Skip the Queue. Order Smarter.</strong></p>
  <p>A smart, real-time food ordering and centralized queue management ecosystem built exclusively for university campuses.</p>

  <div>
    <a href="https://campusbitelive.vercel.app"><img src="https://img.shields.io/badge/Live_Website-Available_Now-FF5A5F?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
  </div>
</div>

<br />

## 🚀 Live Demo
**Frontend:** https://campusbitelive.vercel.app <br/>
**Backend API:** https://campusbite-backend-yr0u.onrender.com (Hosted on Render)

---

## 🎯 The Problem it Solves
University food courts are chaotic during lunch hours. Students waste precious break time standing in long, disorganized queues. **CampusBite** completely digitizes the campus food experience by allowing students to order ahead, pick a designated time-slot, and skip the physical queue entirely. 

## ✨ Key Features
- 🧑‍🎓 **Student Ordering App:** Browse campus food outlets, add meals to cart, choose Takeaway vs. Delivery (to a specific hostel room), and receive digital token slots.
- 🏪 **Outlet Management Dashboard:** Real-time digital kitchen queue. Outlets can independently disable out-of-stock items, process incoming orders by time-slot, and update live order statuses (Pending ➜ Preparing ➜ Ready).
- 🔑 **Multi-Role Authentication:** Dedicated dashboards dynamically assigned using JWT security for Students, Outlet Owners, and the Campus Administrator. 
- 📈 **Admin Analytics:** Global oversight dashboard for university management to track total orders, revenue, and active outlets.
- 🤖 **AI Demand Forecasting (Python/Scikit-Learn):** Machine learning module designed to predict food demand based on daily historical order trends to drastically reduce food waste.

---

## 💻 Tech Stack
The project follows a modern MERN-like stack with Vanilla CSS for a bespoke, premium UI.

**Frontend ⚡**
- React.js + Vite
- React Router DOM
- Axios
- Lucide React (Icons)
- Pure Vanilla CSS (Glassmorphism & Cinematic Design)

**Backend ⚙️**
- Node.js & Express.js
- MongoDB (Mongoose ORM)
- JSON Web Tokens (JWT Auth)
- Bcrypt.js (Password Hashing)

**Machine Learning 🧠**
- Python 3
- Pandas & Scikit-learn
- Flask (Microservice to Node.js)

---

## 🛠️ Local Installation & Setup

### Prerequisites
Make sure you have Node.js and MongoDB installed on your local machine.

### 1. Clone the Repository
```bash
git clone https://github.com/AyushVishwakarma-CodeHub/CampusBite.git
cd CampusBite
```

### 2. Backend Setup
```bash
cd campusbite-backend

# Install dependencies
npm install

# Create a .env file and configure the following variables:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_super_secret_key
# PORT=5000
# FRONTEND_URL=http://localhost:5173

# Optional: Run the seed script to generate dummy outlets and menu items
node seed.js

# Start the server on localhost:5000
npm run dev
```

### 3. Frontend Setup
```bash
cd campusbite-web

# Install dependencies
npm install

# Create a .env file
# VITE_API_URL=http://localhost:5000/api

# Start the React Vite dev server
npm run dev
```

---

## 🧑‍💻 Developer
**Ayush Raj**
- **Email:** ayushthesweetdabang@gmail.com
- **LinkedIn:** [Ayush Raj (ayushraj2908)](https://www.linkedin.com/in/ayushraj2908)
- **GitHub:** [AyushVishwakarma-CodeHub](https://github.com/AyushVishwakarma-CodeHub/)

---
<div align="center">
  <i>Developed with ❤️ for better campus life.</i>
</div>
