# Task API

A production-grade REST API for task management built with Node.js, Express, and MongoDB.

## Features

- **Authentication** — Register, login, logout, refresh token rotation with JWT
- **User Management** — Profile update, avatar upload (Cloudinary), change password, delete account
- **Task CRUD** — Create, read, update, delete tasks with ownership control
- **Filtering & Search** — Filter by status, priority; search by title
- **Sorting & Pagination** — Sort by any field, paginated responses
- **Role-Based Authorization** — User and admin roles with protected routes
- **File Uploads** — Profile picture upload with Multer + Cloudinary
- **Rate Limiting** — Brute force protection on auth routes
- **Error Handling** — Centralized error handler with standardized API responses
- **Security** — Helmet, CORS, httpOnly cookies, bcrypt password hashing

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (access + refresh tokens)
- **Validation:** Zod
- **File Storage:** Cloudinary
- **Logging:** Winston

## API Endpoints

### Auth

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/auth/register` | Create account | Public |
| POST | `/api/v1/auth/login` | Login | Public |
| POST | `/api/v1/auth/logout` | Logout | Private |
| POST | `/api/v1/auth/refresh-token` | Refresh access token | Public |
| GET | `/api/v1/auth/me` | Get current user | Private |
| POST | `/api/v1/auth/change-password` | Change password | Private |
| PATCH | `/api/v1/auth/profile` | Update name/email | Private |
| PATCH | `/api/v1/auth/avatar` | Upload profile picture | Private |
| DELETE | `/api/v1/auth/account` | Delete account | Private |
| GET | `/api/v1/auth/users` | Get all users | Admin |

### Tasks

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/v1/tasks` | Create task | Private |
| GET | `/api/v1/tasks` | Get all tasks | Private |
| GET | `/api/v1/tasks/:id` | Get task by ID | Private |
| PUT | `/api/v1/tasks/:id` | Update task | Private |
| DELETE | `/api/v1/tasks/:id` | Delete task | Private |

### Query Parameters (GET /tasks)

| Parameter | Example | Description |
|-----------|---------|-------------|
| `page` | `?page=2` | Page number (default: 1) |
| `limit` | `?limit=5` | Items per page (default: 10, max: 100) |
| `status` | `?status=todo` | Filter by status (todo, in-progress, done) |
| `priority` | `?priority=high` | Filter by priority (low, medium, high) |
| `search` | `?search=homework` | Search by title |
| `sortBy` | `?sortBy=dueDate` | Sort field (default: createdAt) |
| `order` | `?order=asc` | Sort order (asc/desc, default: desc) |

## Project Structure

```
src/
├── index.js                # Entry point — connect DB, start server, graceful shutdown
├── app.js                  # Express app — middleware, routes, error handler
├── config/
│   ├── index.js            # Centralized env config with validation
│   ├── logger.js           # Winston logger setup
│   └── cloudinary.js       # Cloudinary config
├── db/
│   └── index.js            # MongoDB connection
├── constants/
│   └── index.js            # App-wide constants
├── utils/
│   ├── ApiError.js         # Custom error class with static factory methods
│   ├── ApiResponse.js      # Standardized success response wrapper
│   ├── asyncHandler.js     # Async try-catch wrapper for controllers
│   └── cloudinaryUpload.js # Cloudinary upload/delete utilities
├── middlewares/
│   ├── auth.js             # JWT verification middleware
│   ├── authorize.js        # Role-based access control
│   ├── errorHandler.js     # Global error handler
│   ├── rateLimiter.js      # Rate limiting for auth and general routes
│   ├── upload.js           # Multer file upload config
│   └── validate.js         # Zod request validation middleware
├── models/
│   ├── user.model.js       # User schema with auth methods
│   └── task.model.js       # Task schema with indexes
├── services/
│   ├── auth.service.js     # Auth business logic
│   └── task.service.js     # Task business logic
├── controllers/
│   ├── auth.controller.js  # Auth HTTP handlers
│   └── task.controller.js  # Task HTTP handlers
├── validators/
│   ├── auth.validator.js   # Auth request schemas
│   └── task.validator.js   # Task request schemas
└── routes/
    ├── index.js            # Route aggregator
    ├── auth.routes.js      # Auth route definitions
    └── task.routes.js      # Task route definitions
```

## Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account

### Installation

```bash
git clone https://github.com/KushagraPansari/task-api.git
cd task-api
npm install
```

### Environment Variables

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/task-api
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run

```bash
# Development
npm run dev

# Production
npm start
```

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm start` | Start production server |
| `npm run lint` | Check for linting errors |
| `npm run lint:fix` | Auto-fix linting errors |
| `npm run format` | Format code with Prettier |
