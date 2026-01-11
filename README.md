# 🎓 Student Counselor Portal

Welcome to the **Student Counselor Portal**, a robust MERN-stack web application designed to connect students with professional counselors for career guidance, mental health support, and educational mentorship.

## 📖 About The Project

This platform serves as a bridge between students seeking guidance and qualified counselors. It offers a seamless experience for scheduling sessions, real-time communication, and accessing educational resources. The application handles three distinct user roles: **Students**, **Counselors**, and **Admins**.

---

## 🚀 Key Features

### 🧑‍🎓 For Students
*   **Find Mentors:** Browse a curated list of counselors filtered by expertise.
*   **Book Sessions:** Schedule counseling sessions with integrated payment processing (Stripe).
*   **Live Chat:** Real-time messaging with counselors during scheduled slots (supports file/image sharing).
*   **Digital Library:** Access a collection of books and resources uploaded by admins.
*   **Dashboard:** Manage upcoming sessions and chat history.

### 👨‍🏫 For Counselors
*   **Professional Profile:** Showcase education, experience, and specialized categories.
*   **Schedule Management:** View upcoming appointments and student details.
*   **Session Interaction:** Chat interfaces enabled specifically during active booking times.
*   **Dashboard:** Track student connections and ongoing sessions.

### 🛡️ For Admins
*   **User Oversight:** View and manage Student and Counselor profiles.
*   **Resource Management:** Upload and manage books in the global library.
*   **Platform Monitoring:** Oversee the ecosystem's health and user interactions.

---

## 🛠️ Tech Stack

*   **Frontend:** React.js (Vite), Tailwind CSS, Framer Motion.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB (Mongoose).
*   **Real-Time:** Socket.io (for instant messaging).
*   **Authentication:** JWT (JSON Web Tokens) & Bcrypt.
*   **Payments:** Stripe API.
*   **Tools:** Zod (Validation), Nodemailer (Notifications).

---

## ⚙️ Local Setup Guide

Follow these steps to run the project locally.

### Prerequisites
*   Node.js & npm installed.
*   MongoDB installed locally or a MongoDB Atlas URI.

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd counselling-app
```

### 2. Backend Setup
Navigate to the server directory and install dependencies.
```bash
cd server
npm install
```

**Configure Environment Variables:**
Create a `.env` file in the `server` folder:
```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/counselling-app
JWT_SECRET_KEY=your_super_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
# Add nodemailer and other configs as needed
```

**Start the Server:**
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the client directory.
```bash
cd client
npm install
```

**Configure Environment Variables:**
Create a `.env` file in the `client` folder:
```env
VITE_BACKEND_URL=http://localhost:8080
```

**Start the Client:**
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📂 Project Structure

```
counselling-app/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── context/        # React Context (Auth, etc.)
│   │   └── ...
├── server/                 # Node.js Backend
│   ├── controller/         # Request logic
│   ├── model/              # Database schemas
│   ├── router/             # API routes
│   └── ...
└── README.md               # Documentation
```

## 🔐 Credentials (Default/Test)

*   **Admin Access:** Navigate to `/login/admin` to access the admin panel.
*   **Counselor/Student Registration:** Use the main `/register` page.

---
*Built with ❤️ for better student futures.*
