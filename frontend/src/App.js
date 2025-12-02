import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";

import Login from "./pages/shared/login";
import Signup from "./pages/shared/signup";

import Manager_Dashboard from "./pages/Manager/Dashboard";
import Manager_Project from "./pages/Manager/Project";
import ProjectTask from "./pages/Manager/ProjectTask";
import Manager_Employees from "./pages/Manager/Manager_Employees";

import Employee_Dashboard from "./pages/employee/Employee_Dashboard";
import Employee_task from "./pages/employee/Employee_task";
import ProtectedRoute from "./components/ProtectedRoute";
import TokenMonitor from "./components/TokenMonitor";
import {CookiesProvider} from "react-cookie";

function App() {
  return (
      <CookiesProvider>
<UserProvider>

      <Router>
        <TokenMonitor />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Manager routes */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute role="manager">
                <Manager_Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/project"
            element={
              <ProtectedRoute role="manager">
                <Manager_Project />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/projects/:id"
            element={
              <ProtectedRoute role="manager" requireProjectAccess={true}>
                <ProjectTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/employees"
            element={
              <ProtectedRoute role="manager">
                <Manager_Employees />
              </ProtectedRoute>
            }
          />

          {/* Employee routes */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute role="employee">
                <Employee_Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/tasks"
            element={
              <ProtectedRoute role="employee">
                <Employee_task />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
    </CookiesProvider>
  );
}

export default App;
