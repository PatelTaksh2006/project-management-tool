import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Row, Col, Container } from "react-bootstrap";
import { useUser } from "../../contexts/UserContext";
import UpdateProfile from "../../components/UpdateProfile";
import EmployeeDashboardHeader from "../../components/EmployeeDashboardHeader";
import UserProfileSection from "../../components/UserProfileSection";
import EmployeeTaskPerformance from "../../components/EmployeeTaskPerformance";
import OverdueTasksCard from "../../components/OverdueTasksCard";
import MyProjectsList from "../../components/MyProjectsList";
import RecentTasksList from "../../components/RecentTasksList";
import UpcomingDeadlinesList from "../../components/UpcomingDeadlinesList";

export default function Employee_Dashboard() {
  const { user, refreshUser } = useUser();
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  console.log("User object:", user);
  const employeeId = user?._id;
  const employeeName = user?.name || user?.Name || user?.Email || "Employee";

  // Refresh user data from backend when component mounts or page is navigated to
  useEffect(() => {
    const fetchFreshData = async () => {
      console.log('=== Employee_Dashboard: Starting data refresh ===');
      console.log('Current user before refresh:', user?._id, 'Tasks:', user?.tasks?.length);
      
      const success = await refreshUser();
      
      console.log('Refresh result:', success);
      if (!success) {
        console.warn('Failed to refresh user data, using cached data');
      }
    };

    fetchFreshData();
  }, []); // Empty dependency array = run only on mount

  // Get tasks and projects directly from user object
  const myTasks = user?.tasks || [];
  const myProjects = user?.project || [];
  
  console.log("My Tasks:", myTasks);
  console.log("My Projects:", myProjects);

  // Calculate metrics
  const completedTasks = myTasks.filter(task => task.status === "Completed").length;
  const inProgressTasks = myTasks.filter(task => task.status === "In Progress").length;
  const pendingTasks = myTasks.filter(task => task.status === "To Do" || task.status === "Not Started").length;
  
  console.log("Task counts - Total:", myTasks.length, "Completed:", completedTasks, "In Progress:", inProgressTasks, "Pending:", pendingTasks);
  
  const activeProjects = myProjects.filter(project => project.Status === "Active").length;
  const completedProjects = myProjects.filter(project => project.Status === "Completed").length;

  // Get overdue tasks (only tasks that are past due, not including today)
  const overdueTasks = myTasks.filter(task => {
    console.log(task.dueDate, typeof task.dueDate);

    if (!task.dueDate || task.status === "Completed") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const taskDueDate = new Date(task.dueDate);
    taskDueDate.setHours(0, 0, 0, 0); // Start of due date
    return taskDueDate < today; // Only tasks due before today
  });

  // Get upcoming deadlines (next 7 days)
  const upcomingTasks = myTasks.filter(task => {
    if (!task.dueDate || task.status === "Completed") return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to start of the day

    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate >= today && dueDate <= nextWeek;
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Calculate task completion percentage
  const totalTasks = myTasks.length;
  const taskCompletionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Navbar name="employee" />
      <Row className="g-0">
        <Col md={3} className="border-end bg-white">
          <Sidebar user="employee" value="dashboard" id_name={employeeName}/>
        </Col>

        <Col md={9}>
          <EmployeeDashboardHeader employeeName={employeeName} />
          
          {/* User Profile Section */}
          <UserProfileSection 
            user={user} 
            onUpdateProfile={() => setShowUpdateProfile(true)} 
          />
          
          {/* Task Performance Metrics - Full Width */}
          <EmployeeTaskPerformance
            myTasks={myTasks}
            completedTasks={completedTasks}
            inProgressTasks={inProgressTasks}
            myProjects={myProjects}
          />

          {/* Overdue Tasks + Projects (split view) */}
          <Container fluid className="px-4" style={{ marginBottom: '24px' }}>
            <Row style={{ marginBottom: '16px' }}>
              <Col md={6} style={{ paddingRight: 12, marginBottom: 12 }}>
                <OverdueTasksCard overdueTasks={overdueTasks} />
              </Col>

              <Col md={6} style={{ paddingLeft: 12, marginBottom: 12 }}>
                <MyProjectsList myProjects={myProjects} />
              </Col>
            </Row>
          </Container>

          {/* My Tasks and Upcoming Deadlines */}
          <Container fluid className="px-4">
            <Row>
              <Col md={6} style={{ padding: '0 12px', marginBottom: '16px' }}>
                <RecentTasksList myTasks={myTasks} />
              </Col>

              <Col md={6} style={{ padding: '0 12px', marginBottom: '16px' }}>
                <UpcomingDeadlinesList upcomingTasks={upcomingTasks} />
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>

      {/* Update Profile Modal */}
      <UpdateProfile
        show={showUpdateProfile}
        onClose={() => setShowUpdateProfile(false)}
        currentUser={user}
      />
    </div>
  );
}
