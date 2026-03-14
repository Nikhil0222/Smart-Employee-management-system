# 🏢 Smart Employee Management System

> A full-stack employee management platform with JWT authentication, role-based access control, and a modern React UI.

![Node.js](https://img.shields.io/badge/Node.js-Express-black?style=flat-square&logo=node.js)
![React](https://img.shields.io/badge/React-Vite-blue?style=flat-square&logo=react)
![Prisma](https://img.shields.io/badge/Prisma-ORM-teal?style=flat-square&logo=prisma)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

**[Live Demo](https://your-demo-link.vercel.app)** · [Report Bug](https://github.com/Nikhil0222/Smart-Employee-management-system/issues)

---

## ✨ Features

- **JWT Authentication** — Secure login with token-based auth and protected routes
- **Role-Based Access** — ADMIN, MANAGER, and EMPLOYEE roles with different permissions
- **Employee Directory** — Full CRUD operations on employee records
- **Modern UI** — Dark sidebar, stat cards, search, and modal forms
- **Protected Routes** — Frontend and backend route guards
- **Responsive Design** — Works on all screen sizes

---

## 🖥️ Screenshots

> Login Page · Dashboard · Employee Directory

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + CSS Variables |
| Fonts | Instrument Serif + Geist |
| Backend | Node.js + Express |
| Database ORM | Prisma |
| Auth | JWT + bcrypt |
| API Client | Axios |

---

## 🚀 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/Nikhil0222/Smart-Employee-management-system.git
cd Smart-Employee-management-system
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Add your DATABASE_URL and JWT_SECRET to .env
npx prisma migrate dev
npm run dev
```

Backend runs on **http://localhost:5000**

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## 📁 Project Structure
```
smart-employee-management-system/
├── backend/
│   └── src/
│       ├── app.js              # Express app setup
│       ├── server.js           # Entry point
│       ├── controllers/
│       │   └── auth.controller.js   # Register & login logic
│       ├── routes/
│       │   ├── auth.routes.js       # /api/auth/*
│       │   └── protected.routes.js  # /api/protected/*
│       ├── middlewares/
│       │   └── auth.middleware.js   # JWT verification
│       ├── utils/
│       │   └── prisma.js            # Prisma client
│       └── prisma/
│           └── schema.prisma        # Database schema
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx            # Login page
│       │   ├── Dashboard.jsx        # Stats dashboard
│       │   └── Employees.jsx        # Employee directory
│       ├── components/
│       │   └── Layout.jsx           # Sidebar + header shell
│       ├── auth/
│       │   ├── authApi.js           # Login API call
│       │   └── ProtectedRoute.jsx   # Route guard
│       └── api/
│           └── axios.js             # Axios instance + JWT interceptor
└── README.md
```

---

## 🔐 API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login + get JWT |
| GET | `/api/protected/profile` | JWT Required | Get current user |

---

## 👥 Roles & Permissions

| Feature | EMPLOYEE | MANAGER | ADMIN |
|---|---|---|---|
| View Dashboard | ✅ | ✅ | ✅ |
| View Employees | ❌ | ✅ | ✅ |
| Add Employees | ❌ | ✅ | ✅ |
| Manage Roles | ❌ | ❌ | ✅ |

---

## 🌐 Deploy

**Backend → Railway**
```bash
# Set environment variables in Railway dashboard:
# DATABASE_URL, JWT_SECRET
```

**Frontend → Vercel**
```bash
npm i -g vercel
cd frontend
vercel
```

---

## 💡 Roadmap

- [ ] Edit & delete employee records
- [ ] Employee profile pages
- [ ] Attendance tracking
- [ ] Department management
- [ ] Email notifications
- [ ] Export to CSV

---

