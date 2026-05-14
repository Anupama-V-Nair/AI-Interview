# AI Interview Preparation System

## Project Overview
AI Interview Preparation System is a full-stack web application designed to help users prepare for interviews using AI-generated questions, interview session tracking, analytics, and resume-based question generation.

---

# Technology Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Gemini/OpenAI APIs

---

# Software / Tools Requirements

Before running the project, install the following:

## Required Software
- Node.js (v18 or above recommended)
- npm
- MongoDB Atlas account or local MongoDB installation
- VS Code or any code editor

## Recommended Tools
- Postman (for API testing)
- Git
- MongoDB Compass

---

# Project Folder Structure

```bash
AI-Interview-Preparation/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── index.js
│   ├── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── Layouts/
│       ├── pages/
│       ├── services/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│   ├── package.json
│
└── README.md
```

---

# Database Setup Instructions

## Step 1: Create MongoDB Database

### Option A: MongoDB Atlas
1. Create an account on MongoDB Atlas.
2. Create a new cluster.
3. Click **Connect** → **Drivers**.
4. Copy the MongoDB connection string.

Example:
```env
mongodb+srv://username:password@cluster.mongodb.net/database_name
```

---

# Environment Variable Setup

Create a `.env` file inside the `backend` folder.

## Example `.env`
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

## Important
- Do NOT expose your API keys publicly.
- Replace all placeholder values with your actual credentials.

---

# Project Execution Steps

## Step 1: Extract the Project
Extract the ZIP file into your desired directory.

---

## Step 2: Open Project in Terminal

Open two terminals:
- One for backend
- One for frontend

---

# Backend Setup

## Step 3: Navigate to Backend Folder
```bash
cd backend
```

## Step 4: Install Dependencies
```bash
npm install
```

## Step 5: Start Backend Server
```bash
npm run dev
```

Backend runs on:
```bash
http://localhost:5000
```

---

# Frontend Setup

## Step 6: Navigate to Frontend Folder
```bash
cd frontend
```

## Step 7: Install Dependencies
```bash
npm install
```

## Step 8: Start Frontend Server
```bash
npm run dev
```

Frontend runs on:
```bash
http://localhost:5173
```

---

# How to Run the Project

## Complete Execution Flow

### 1. Start MongoDB
Make sure MongoDB Atlas or local MongoDB is running.

### 2. Start Backend
```bash
cd backend
npm run dev
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

### 4. Open Browser
Visit:
```bash
http://localhost:5173
```

---

# Features

- User Authentication
- AI-based Interview Questions
- Resume Upload
- Interview Session Tracking
- Performance Analytics
- Protected Routes using JWT

---

# API Dependencies Used

## Backend Dependencies
- express
- mongoose
- dotenv
- cors
- bcryptjs
- jsonwebtoken
- multer
- pdf-parse
- @google/genai
- openai

## Frontend Dependencies
- react
- react-router-dom
- axios
- tailwindcss
- recharts
- lucide-react
- react-webcam

---

# Build for Production

## Frontend Build
```bash
npm run build
```

## Preview Production Build
```bash
npm run preview
```

---

# Common Errors and Fixes

## 1. Invalid JWT Signature
Cause:
- Wrong JWT_SECRET value
- Old token stored in browser

Fix:
- Update JWT_SECRET
- Clear localStorage or login again

---

## 2. MongoDB Connection Error
Cause:
- Incorrect MONGO_URI
- Internet issue
- MongoDB service not running

Fix:
- Verify database connection string
- Check MongoDB Atlas network access

---

## 3. CORS Error
Fix:
- Ensure backend server is running
- Verify frontend API URL

---

# Submission Checklist

Before submission ensure:
- All dependencies are installed
- `.env` file is configured
- Frontend and backend both run successfully
- Database connection works
- No broken routes or missing files
- Remove unnecessary node_modules before submission if required

---

# Author
Anjali Kumari | Anupama V Nair | Dimple
