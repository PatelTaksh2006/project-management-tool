import "./App.css";
import Manager_Dashboard from "./pages/Manager/Dashboard";
import Manager_Project from "./pages/Manager/Project";
import ProjectTask from "./pages/Manager/ProjectTask";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Employee_Dashboard from "./pages/employee/Employee_Dashboard";
import Employee_task from "./pages/employee/Employee_task";
import Login from "./pages/shared/login";
import Signup from "./pages/shared/signup";
import { UserProvider } from "./contexts/UserContext";
import Manager_Employees from "./pages/Manager/Manager_Employees";
function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/manager/projects/:id" element={<ProjectTask />}></Route>
          <Route path="/manager" element={<Manager_Dashboard />}></Route>
          <Route path="/manager/project" element={<Manager_Project />}></Route>
          <Route path="/manager/employees" element={<Manager_Employees />}></Route>
          <Route path="/employee" element={<Employee_Dashboard />}></Route>
          <Route path="/employee/tasks" element={<Employee_task />}></Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
