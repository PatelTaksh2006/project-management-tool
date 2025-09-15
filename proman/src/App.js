import "./App.css";
import Manager_Dashboard from "./pages/Manager/Dashboard";
import Manager_Project from "./pages/Manager/Project";
import ProjectTask from "./pages/Manager/ProjectTask";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Employee_Dashboard from "./pages/employee/Employee_Dashboard";
import Employee_task from "./pages/employee/Employee_task";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/manager/projects/:id" element={<ProjectTask />}></Route>
        <Route path="/manager" element={<Manager_Dashboard />}></Route>
        <Route path="/manager/project" element={<Manager_Project />}></Route>
        <Route path="/employee" element={<Employee_Dashboard />}></Route>
        <Route path="/employee/task/:employeeName" element={<Employee_task />}></Route>
      </Routes>
    </Router>
    
  );
}

export default App;
