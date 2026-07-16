# SwiftBite Backend - Authentication Setup

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or Atlas cloud)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/swiftbite
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
   JWT_EXPIRE=7d
   ```

   **For MongoDB Atlas (Cloud):**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/swiftbite?retryWrites=true&w=majority
   ```

3. **Start MongoDB**
   
   **For Local MongoDB:**
   ```bash
   mongod
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

---

## 🔐 Authentication API Endpoints

### 1. **Register User**
- **Endpoint:** `POST /api/auth/register`
- **Description:** Create a new user account
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```
- **Response (Success):**
  ```json
  {
    "message": "Account created successfully",
    "user": {
      "id": "userId",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "",
      "addresses": []
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
  ```
- **Status Codes:**
  - `201`: Account created successfully
  - `400`: Validation error
  - `409`: Email already registered
  - `500`: Server error

### 2. **Login User**
- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticate user and get JWT token
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response (Success):**
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "userId",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "",
      "addresses": []
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
  ```
- **Status Codes:**
  - `200`: Login successful
  - `400`: Validation error
  - `401`: Invalid email or password
  - `500`: Server error

### 3. **Get Current User**
- **Endpoint:** `GET /api/auth/me`
- **Description:** Retrieve authenticated user's profile
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Response (Success):**
  ```json
  {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "",
    "addresses": [],
    "createdAt": "2026-07-16T18:17:02.615Z"
  }
  ```
- **Status Codes:**
  - `200`: User retrieved successfully
  - `401`: No token or invalid token
  - `404`: User not found
  - `500`: Server error

---

## 🔑 Using Authentication in Frontend

### Using the `useAuth` Hook

```javascript
'use client'

import { useAuth } from '@/context/AuthContext'

export function MyComponent() {
  const { user, token, isAuthenticated, login, logout } = useAuth()

  if (!isAuthenticated) {
    return <p>Please log in</p>
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Manual Token Storage & Retrieval

```javascript
// After successful login/register
localStorage.setItem('swiftbite_token', token)
localStorage.setItem('swiftbite_user', JSON.stringify(user))

// In protected API calls
const token = localStorage.getItem('swiftbite_token')
const response = await fetch('/api/protected-endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.js    # Register endpoint
│   │   │   ├── login/route.js       # Login endpoint
│   │   │   └── me/route.js          # Get current user
│   │   ├── foods/route.js
│   │   └── orders/route.js
│   ├── login/page.js                # Updated with real auth
│   ├── register/page.js             # Updated with real auth
│   └── layout.js                    # Updated with AuthProvider
├── lib/
│   ├── mongodb.js                   # MongoDB connection
│   ├── jwt.js                       # JWT utilities
│   └── db.js                        # Legacy (JSON storage)
├── models/
│   └── User.js                      # User schema
└── context/
    ├── AuthContext.js               # Auth state management
    └── CartContext.js
```

---

## 🔒 Security Features

✅ **Password Hashing**: Passwords are hashed using bcryptjs with 10 salt rounds  
✅ **JWT Tokens**: Secure token-based authentication  
✅ **Email Validation**: Email format validation with regex  
✅ **Password Requirements**: Minimum 6 characters  
✅ **Token Expiration**: Tokens expire after 7 days (configurable)  
✅ **Duplicate Prevention**: Unique email constraint at database level  

---

## 🧪 Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Current User:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Create a new collection
2. Add requests for each endpoint
3. Use the returned token in the Authorization header for protected routes

---

## ⚙️ Database Schema

### User Model

```javascript
{
  name: String,           // Required
  email: String,          // Required, unique, lowercase
  password: String,       // Required, hashed, min 6 chars
  phone: String,
  addresses: [
    {
      label: String,      // 'home' | 'work' | 'other'
      address: String,
      city: String,
      state: String,
      zipCode: String,
      isDefault: Boolean
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚨 Error Handling

All API responses follow a consistent error format:

```json
{
  "error": "Error message here"
}
```

Common status codes:
- **400**: Bad Request (validation error)
- **401**: Unauthorized (missing/invalid token or credentials)
- **409**: Conflict (email already exists)
- **500**: Internal Server Error

---

## 📝 Next Steps

1. ✅ Authentication setup complete
2. ⬜ User profile management endpoints
3. ⬜ Payment integration
4. ⬜ Real-time order tracking with WebSocket
5. ⬜ Email notifications
6. ⬜ Admin dashboard APIs

---

## 🔗 References

- [Mongoose Docs](https://mongoosejs.com/)
- [JWT Docs](https://jwt.io/)
- [bcryptjs Docs](https://github.com/dcodeIO/bcrypt.js)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Last Updated:** July 16, 2026
