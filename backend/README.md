# Backend - Project Management API

Express.js REST API server with MongoDB for the project management tool.

## Structure

```
backend/
├── src/
│   ├── Index.js          # Main server entry point
│   ├── middleware/
│   │   └── auth.js       # JWT authentication middleware
│   ├── models/           # Mongoose schemas
│   │   ├── ProjectSchema.js
│   │   ├── TaskSchema.js
│   │   └── UserSchema.js
│   └── Routers/          # API route handlers
│       ├── EmployeeRoute.js
│       ├── ProjectRoute.js
│       ├── TaskRoute.js
│       └── UserRoute.js
└── package.json
```

## Environment Setup

Create `.env` file in this directory with required variables:

```bash
# Database Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/ProDb

# Server Configuration  
PORT=3001

# JWT Authentication
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRES_IN=7d
```

**Environment Variables:**
- `MONGODB_URI` - MongoDB connection string (required)
- `PORT` - Server port number (optional, defaults to 3001)
- `JWT_SECRET` - Secret key for JWT token signing (required)
- `JWT_EXPIRES_IN` - Token expiration time (optional, defaults to 7d)

## Installation & Run

```bash
npm install
# Create .env file with above variables
npm start
```

Server will start on the port specified in `.env` or default to port 3001

## Key Features

- **Authentication**: JWT-based with bcrypt password hashing
- **File Upload**: Multipart file upload to `upload_Documents/` (sibling folder)
- **CORS**: Configured for frontend origin (update in Index.js if needed)
- **Protected Routes**: `/api/project` and `/api/task` require auth tokens
- **Static Files**: Uploaded files served at `/api/upload/:filename`

## API Endpoints

### Authentication
- `POST /api/user/signup` - Register new user
- `POST /api/user/login` - Login (returns JWT)
- `GET /api/user/me` - Get current user (protected)
- `PUT /api/user/update/:id` - Update user (protected)

### Resources (Protected)
- `/api/project/*` - Project CRUD operations
- `/api/task/*` - Task management
- `/api/emp/*` - Employee management

### File Upload
- `POST /api/upload` - Upload file (field: `file`)
- `GET /api/upload/:filename` - Serve uploaded file

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT auth
- **bcryptjs** - Password hashing
- **cors** - Cross-origin requests
- **dotenv** - Environment variables
- **express-fileupload** - File upload handling