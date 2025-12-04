
# Project Management Tool

Brief project management web application (backend + frontend) for creating and tracking projects, tasks and employees. The backend is a Node.js + Express API using MongoDB (Mongoose). The frontend is a React app (Create React App).

**Contents:**
- **`backend/`**: Express API, routes, models, middleware and file upload handling. Start the server from `backend`.
- **`frontend/`**: React single-page app (components, pages, styles). Start the dev server from `frontend`.
- **`upload_Documents/`**: Sibling folder where uploaded files are stored and served by the backend.

## Prerequisites
- Node.js (LTS recommended; Node 18+ is a good choice)
- npm (comes with Node)
- MongoDB (local MongoDB or a MongoDB Atlas connection string)

## Environment variables
Create a `.env` file in `backend/` (same folder as `src`) with the following keys (example):

```
MONGODB_URI=mongodb://127.0.0.1:27017/ProDb
PORT=3001
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

- `MONGODB_URI`: MongoDB connection string. If omitted, the backend defaults to `mongodb://127.0.0.1:27017/ProDb`.
- `PORT`: optional; defaults to `3001` if not provided.
- `JWT_SECRET`: required for authentication token signing/verification.
- `JWT_EXPIRES_IN`: optional token lifetime (e.g. `7d`, `1h`).

## Installation & Running (Windows PowerShell)

Open two terminals (one for backend, one for frontend). Commands below are PowerShell-friendly.

1) Backend

```
cd backend
npm install
# create .env (see variables above)
npm start
```

The backend runs on `http://localhost:3001` by default.

2) Frontend

```
cd frontend
npm install
npm start
```

The frontend runs on `http://localhost:3000` and expects the backend API at `http://localhost:3001` by default.

To build the frontend for production:

```
cd frontend
npm run build
```

## Development notes
- CORS is configured in `backend/src/Index.js` to allow `http://localhost:3000`. If you host the frontend elsewhere, update that origin.
- Uploaded files are saved to the sibling `upload_Documents` folder and served statically at the backend route `/api/upload/<filename>`.

## Key API routes (summary)
- `POST /api/user/signup` — register a new user. Body: user fields (see `UserSchema`).
- `POST /api/user/login` — authenticate and receive a JWT. Body: `{ Email, Password }`.
- `GET /api/user/me` — (protected) get current user profile. Requires `Authorization: Bearer <token>` header.
- `PUT /api/user/update/:id` — (protected) update user by id.
- `GET/POST/PUT/DELETE /api/emp` — employee related routes (see `EmployeeRoute`).
- `GET/POST/PUT/DELETE /api/project` — project routes (protected by auth middleware).
- `GET/POST/PUT/DELETE /api/task` — task routes (protected by auth middleware).
- `GET /api/upload/:filename` — static file serving for uploaded documents.
- `POST /api/upload` — file upload endpoint (multipart/form-data, field name `file`). Returns `{ url: "/api/upload/<filename>" }`.

Notes:
- Protected routes require an `Authorization` header in the form `Bearer <token>`; tokens are signed with `JWT_SECRET`.
- On login the server returns `{ user, token }` where `user` has password removed.

## Changing CORS origin
If you need to allow different frontend origins, edit the CORS config in `backend/src/Index.js` and restart the backend.

## File uploads
- Uploads are saved to `upload_Documents/` at the repo root (server creates it if missing).
- Uploaded files are served at `http://<backend-host>:<port>/api/upload/<filename>`.

## Troubleshooting
- MongoDB connection errors: verify `MONGODB_URI`, ensure MongoDB is running or Atlas connection string is correct.
- JWT errors: ensure `JWT_SECRET` is set and the token header is `Authorization: Bearer <token>`.
- Port conflicts: change `PORT` in `.env` or free the port.
