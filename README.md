<div align="center">
  <img src="https://campusbitelive.vercel.app/public/images/campus_cafe.png" alt="CampusBite Logo" width="120" style="border-radius: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); margin-bottom: 20px;" />
  
  <h1 style="margin: 0; font-size: 2.5em;">CampusBite</h1>
  <p style="font-size: 1.2em; color: #555;"><strong>Skip the Queue. Order Smarter.</strong></p>

  <p>
    <a href="https://campusbitelive.vercel.app">
      <img src="https://img.shields.io/badge/Launch_Live_App-FF5A5F?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
    </a>
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
  </p>
</div>

<br />

## 📖 Overview

**CampusBite** is a modern, end-to-end food ordering ecosystem designed exclusively to solve the chaos of university lunch hours. By digitizing the campus food court, CampusBite eliminates long physical queues, reduces student wait times, and provides outlet owners with a streamlined digital kitchen management system.

Instead of standing in line, students can browse menus, pre-order their meals, and receive a secure digital token for a specific pickup time-slot. 

---

## ✨ Core Features

### 🧑‍🎓 For Students
* **Smart Pre-Ordering:** Browse all campus outlets and pre-order meals from anywhere.
* **Time-Slot Allocation:** Select a specific pickup window (e.g., 1:00 PM - 1:15 PM) to align with class schedules.
* **Digital Tokens:** No more paper receipts; receive a secure, live-tracking digital token.
* **Live Order Tracking:** Watch your order move from `Pending` ➜ `Preparing` ➜ `Ready`.

### 🏪 For Outlet Owners
* **Digital Queue Management:** A real-time dashboard to manage incoming orders categorized by time-slots.
* **One-Click Status Updates:** Instantly notify students when their food is ready for pickup.
* **Dynamic Menu Control:** Temporarily disable out-of-stock items with a single toggle.

### 🏢 For Campus Administration
* **Centralized Oversight:** A global dashboard tracking total daily orders, gross revenue, and active outlets across the entire university.
* **Demand Forecasting (AI):** Python-powered analytics engine utilizing `scikit-learn` to predict weekly food demand and reduce campus food waste.

---

## 🏗️ Architecture & Tech Stack

CampusBite is built on a scalable, modern MERN-oriented architecture with a Python microservice.

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, Vanilla CSS | A bespoke, glassmorphism-inspired cinematic UI built without heavy CSS frameworks for maximum performance. |
| **Backend** | Node.js, Express.js | High-performance REST API handling dynamic time-slots and secure JWT authentication. |
| **Database** | MongoDB Atlas | NoSQL database utilizing Mongoose ORM for strict schema validation. |
| **AI / Data** | Python, Scikit-learn | Predictive modeling to forecast order volumes. |

---

## 🚀 Quick Start (Local Development)

To run CampusBite locally on your machine, follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/AyushVishwakarma-CodeHub/CampusBite.git
cd CampusBite
```

### 2. Start the Backend Server
```bash
cd campusbite-backend
npm install

# Create a .env file with your MONGO_URI, JWT_SECRET, and PORT=5000
npm run dev
```

### 3. Start the Frontend Client
Open a new terminal window:
```bash
cd campusbite-web
npm install

# Create a .env file with VITE_API_URL=http://localhost:5000/api
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📂 Project Structure

```text
CampusBite/
├── campusbite-web/       # React.js SPA (Student, Outlet, Admin Views)
├── campusbite-backend/   # Express API, MongoDB Models, JWT Auth
└── campusbite-ai/        # Python forecasting scripts
```

---

<div align="center">
  <img src="https://img.shields.io/badge/Developer-Ayush_Raj-FF5A5F?style=for-the-badge" alt="Ayush Raj" />
  <p>
    <a href="mailto:ayushthesweetdabang@gmail.com">Email</a> • 
    <a href="https://www.linkedin.com/in/ayushraj2908">LinkedIn</a> • 
    <a href="https://github.com/AyushVishwakarma-CodeHub">GitHub</a>
  </p>
  <p><i>Building smarter solutions for better campus life.</i></p>
</div>
