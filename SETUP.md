# 🏫 Preetam School & Sports Club - Setup Guide

## Quick Start

### Prerequisites
1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)

---

## Step 1: Install MongoDB

### Windows:
1. Download MongoDB Community Server from the link above
2. Run the installer and follow the setup wizard
3. MongoDB will run as a Windows Service automatically

**OR** use MongoDB Atlas (cloud):
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `backend/.env` with your Atlas connection string

---

## Step 2: Setup Backend

```bash
# Navigate to backend folder (separate repo)
cd C:\preetam-school-n-sportsclub\preetam-school-club-se

# Install dependencies (if not already done)
npm install

# Create admin user (make sure MongoDB is running first)
npm run create-admin

# Start the backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

---

## Step 3: Setup Frontend

Open a new terminal:

```bash
# Navigate to project root
cd C:\preetam-school-n-sportsclub\Preetam-school-club

# Install dependencies (if not already installed)
npm install

# Start the development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## Step 4: Login

**Default Admin Credentials:**
- **User ID:** `admin123`
- **Password:** `admin@preetam2025`

---

## Project Structure

```
Preetam-school-club/
├── backend/
│   ├── config/         # Database configuration
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── scripts/        # Admin creation script
│   ├── .env            # Environment variables
│   └── server.js       # Express server
├── src/
│   ├── components/     # React components
│   ├── context/        # React context (auth & org)
│   ├── pages/          # Page components
│   ├── services/       # API service
│   └── App.jsx         # Main app component
└── .env                # Frontend environment variables
```

---

## Features Implemented

✅ **Login System**
- JWT-based authentication
- Secure password hashing with bcrypt
- Token stored in localStorage
- Auto-redirect to login on token expiration

✅ **Multi-Organization Support**
- Switch between School and Fitness Club
- Organization-specific dashboards
- Dynamic sidebar menus based on organization
- Organization header sent with every API call

✅ **Protected Routes**
- Login required to access dashboards
- Automatic redirect to login if not authenticated
- Loading state while checking auth

✅ **Backend API**
- POST `/api/auth/login` - Login endpoint
- GET `/api/auth/me` - Get current user info
- Auth middleware validates token and organization access

---

## API Documentation

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "userId": "admin123",
  "password": "admin@preetam2025"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "organizations": [...],
  "defaultOrg": {...},
  "user": {...}
}
```

### Protected Routes
All protected API calls automatically include:
- `Authorization: Bearer <token>`
- `X-Organization-ID: <org-id>`

---

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED ::1:27017
```
**Solution:** Start MongoDB service
- Windows: `net start MongoDB` or start from Services app
- Or use MongoDB Atlas cloud database

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change port in `backend/.env`:
```env
PORT=5001
```
And update frontend `.env`:
```env
VITE_API_URL=http://localhost:5001
```

### Login Not Working
1. Make sure backend is running on port 5000
2. Check browser console for errors
3. Verify `VITE_API_URL` in frontend `.env`
4. Make sure admin user was created successfully

---

## Development Commands

### Backend
```bash
npm run dev      # Start with auto-reload
npm start        # Start production server
npm run create-admin  # Create admin user
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## Security Notes

⚠️ **Before Production:**
1. Change `JWT_SECRET` to a strong random string
2. Change default admin password
3. Use HTTPS
4. Set up proper CORS origins
5. Use environment variables for all secrets
6. Consider rate limiting on login endpoint
