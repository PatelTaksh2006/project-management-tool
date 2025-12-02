# Frontend - Project Management Tool

React.js frontend application for the project management system.

## Structure

```
frontend/
├── src/
│   ├── App.js            # Main app component
│   ├── index.js          # React entry point
│   ├── components/       # Reusable UI components
│   │   ├── AddNewProject.jsx
│   │   ├── AddNewTask.jsx
│   │   ├── DashboardHeader.jsx
│   │   ├── DisplayProject.jsx
│   │   ├── EmployeeDashboard*.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── TasksTable.jsx
│   │   └── ... (30+ components)
│   ├── contexts/
│   │   └── UserContext.js # User state management
│   ├── pages/
│   │   ├── employee/     # Employee dashboard pages
│   │   ├── Manager/      # Manager dashboard pages
│   │   └── shared/       # Login/signup pages
│   ├── Data/             # Static/mock data
│   └── hooks/
│       └── useTokenValidation.js
├── public/
└── package.json
```

## Environment Setup

Create `.env` file in this directory (optional for development):

```bash
# Backend API URL (optional)
REACT_APP_API_URL=http://localhost:3001

# Other environment variables as needed
# REACT_APP_CUSTOM_VAR=value
```

**Environment Variables:**
- `REACT_APP_API_URL` - Backend API base URL (optional, defaults to http://localhost:3001)
- Add other `REACT_APP_*` variables as needed for your deployment

## Installation & Run

```bash
npm install
# Create .env file if custom API URL needed
npm start
```

Development server runs on port 3000 by default

## Build for Production

```bash
npm run build
```

Creates optimized build in `build/` folder.

## Key Features

- **Authentication**: JWT token-based login/signup
- **Role-based Views**: Manager and Employee dashboards
- **Project Management**: Create, edit, view projects
- **Task Management**: Assign, track, update tasks
- **File Upload**: Document upload for projects/tasks
- **Responsive Design**: Bootstrap + custom CSS
- **Protected Routes**: Authentication required for main features

## Technologies

- **React 19** - UI framework
- **React Router** - Client-side routing
- **Bootstrap 5** - UI components and styling
- **React Bootstrap** - Bootstrap React components
- **js-cookie / react-cookie** - Cookie management
- **React Bootstrap Icons** - Icon library

## API Integration

Frontend connects to backend API using `REACT_APP_API_URL` environment variable (defaults to http://localhost:3001)

Key integrations:
- User authentication (`/api/user/*`)
- Project operations (`/api/project/*`)
- Task management (`/api/task/*`)
- File uploads (`/api/upload`)

## Development Notes

- **Environment**: Configure backend URL via `REACT_APP_API_URL` in `.env`
- **CORS**: Ensure backend allows this app's origin
- **Authentication**: Tokens stored in cookies, sent via Authorization header
- **File Uploads**: Uses FormData for multipart uploads
- **State Management**: React Context for user state
- **Protected Routes**: `ProtectedRoute` component wraps authenticated pages

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (irreversible)
