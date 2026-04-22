# 🏢 Construction Management App

> A comprehensive real estate management dashboard built with Node.js, Express, and MongoDB for managing properties, projects, payments, and user activities.

---

## 📋 Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Project Architecture](#project-architecture)
* [Data Flow](#data-flow)
* [Database Design](#database-design)
* [Installation](#installation)
* [Configuration](#configuration)
* [API Documentation](#api-documentation)
* [Project Structure](#project-structure)

---

## 🎯 Overview

Rio Livings Dashboard is a robust backend solution for managing real estate operations.

**Key Highlights:**

* 🔐 JWT authentication
* 👥 Role-based access
* 💳 Payment integration
* 📸 AWS S3 uploads
* 📊 Admin dashboard
* 📈 Activity tracking

---

## 🛠 Tech Stack

* Node.js + Express
* MongoDB + Mongoose
* Passport.js + JWT
* AWS S3
* AdminJS

---

## 🏗 Project Architecture

```text
Client Application
        │
        ▼
Express Server (Port 5000)
        │
 ┌──────┴────────┐
 │               │
Routes        Middleware
 │               │
 ▼               ▼
Controllers   Auth / Logger / CORS
        │
        ▼
Business Logic (Services)
        │
        ▼
Models (MongoDB)
        │
        ▼
External Services (AWS S3, Email)
```

---

## 📊 Data Flow

### Authentication Flow

```text
Login Request
   ↓
Passport Local Strategy
   ↓
Password Check (bcrypt)
   ↓
JWT Token Generated
   ↓
Client Stores Token
```

### Request Flow

```text
Request → CORS → Logger → Auth → Route → Controller → DB → Response
```

### File Upload Flow

```text
Upload → Auth → Handler → AWS S3 → URL → DB → Response
```

---

## 🗄 Database Design

### Users

```js
{
  email,
  password,
  role,
  profileImage,
  createdAt
}
```

### Projects

```js
{
  name,
  status,
  owner,
  budget
}
```

### Payments

```js
{
  user,
  project,
  amount,
  status
}
```

---

## 📦 Installation

```bash
git clone https://github.com/SophiseTech/RioLivingsDashboard.git
cd RioLivingsDashboard
npm install
```

---

## ⚙️ Configuration

Create `.env`:

```bash
PORT=5000
MONGODB_URI=your_db
JWT_SECRET=your_secret
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
```

---

## 🔌 API Example

### Login

```http
POST /api/auth/login
```

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

---

## 📂 Project Structure

```text
config/
controllers/
models/
routes/
middlewares/
services/
Admin/
index.js
```

---

## 🚀 Deployment

```bash
npm run prod
```

---

## 🔐 Security

* bcrypt password hashing
* JWT auth
* role-based access

---

## 📈 Performance

* DB indexing
* pagination
* connection pooling

---

## 🐛 Troubleshooting

```bash
lsof -ti:5000 | xargs kill -9
```

---

## 📄 License

MIT
