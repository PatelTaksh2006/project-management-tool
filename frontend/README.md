# Project Management Tool (ProMan)

A comprehensive project management application built with React and Node.js, featuring role-based access for managers and employees.

## Features

- **Manager Dashboard**: Create and manage projects, assign tasks to employees, track project status
- **Employee Dashboard**: View assigned tasks, update task status, upload files
- **Task Management**: Priority levels, due dates, file attachments, status tracking
- **User Authentication**: Secure login/signup with role-based access control
- **Real-time Updates**: Automatic synchronization of project and task data

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for backend database)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/PatelTaksh2006/project-management-tool.git
cd proman
```

### 2. Environment Configuration

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Edit the `.env` file and configure the following variables:

```env
REACT_APP_API_URL=http://localhost:3001
```

**Important**: 
- Never commit your `.env` file to version control (it's already in `.gitignore`)
- The `.env.example` file shows required variables without exposing sensitive data
- Update `REACT_APP_API_URL` for production deployment

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Application

#### Development Mode

```bash
npm start
```

Opens the app at [http://localhost:3000](http://localhost:3000)

#### Production Build

```bash
npm run build
```

Creates an optimized production build in the `build` folder.

## Project Structure

```
proman/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React Context providers
│   ├── Data/           # API service layer
│   ├── pages/          # Page components
│   │   ├── Manager/    # Manager role pages
│   │   ├── employee/   # Employee role pages
│   │   └── shared/     # Login/Signup pages
│   ├── App.js          # Main app component
│   └── index.js        # Entry point
├── .env.example        # Environment variables template
└── package.json        # Dependencies and scripts
```

## Available Scripts

### `npm start`

Runs the app in development mode with hot reload.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:3001` |

## Backend Setup

**Note**: This is the frontend repository. You'll also need to set up the backend server separately.

The backend should expose the following API endpoints:
- `/api/user/login` - User authentication
- `/api/user/signup` - User registration
- `/api/project/*` - Project management
- `/api/task/*` - Task management
- `/api/emp/*` - Employee management
- `/api/upload` - File upload

## User Roles

### Manager
- Create and manage projects
- Assign tasks to employees
- Track project progress and deadlines
- View team performance metrics

### Employee
- View assigned projects and tasks
- Update task status (To Do → In Progress → Completed)
- Upload deliverable files
- Track personal task completion metrics

## Technologies Used

- **Frontend**: React, React Bootstrap, React Router
- **State Management**: React Context API
- **Styling**: Bootstrap, Custom CSS
- **Icons**: React Bootstrap Icons
- **HTTP Client**: Fetch API

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Troubleshooting

### Common Issues

**API Connection Error**
- Verify backend server is running on `http://localhost:3001`
- Check `.env` file has correct `REACT_APP_API_URL`
- Ensure MongoDB is running for the backend

**Build Fails**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

## License

This project is for educational purposes (SEM5 AT project).

## Contributors

- Patel Taksh (@PatelTaksh2006)

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
