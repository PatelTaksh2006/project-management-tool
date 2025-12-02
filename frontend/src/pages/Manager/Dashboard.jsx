import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Row, Col } from "react-bootstrap";
import { useUser } from "../../contexts/UserContext";
import { getProjects, subscribe } from "../../Data/Projects";
import UpdateProfile from "../../components/UpdateProfile";
import DashboardHeader from "../../components/DashboardHeader";
import UserProfileSection from "../../components/UserProfileSection";
import PerformanceMetrics from "../../components/PerformanceMetrics";
import ProjectsList from "../../components/ProjectsList";
import MissedDeadlineTasks from "../../components/MissedDeadlineTasks";

export default function Dashboard() {
  const { user, token } = useUser();
  let id = user?._id;
  const [projects, setProjects] = useState([]);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);

  // Fetch projects and subscribe to changes
  useEffect(() => {
    if (!id) return;

    let mounted = true;

    // Subscribe to project changes
    const unsubscribe = subscribe((allProjects) => {
      if (mounted && Array.isArray(allProjects)) {
        setProjects(allProjects);
      }
    });

    // Initial fetch of projects
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getProjects(id, token);
        if (mounted && Array.isArray(fetchedProjects)) {
          setProjects(fetchedProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();

    return () => {
      mounted = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [id]);

  let totalTask = projects.reduce((acc, curr) => acc + (Array.isArray(curr.tasks) ? curr.tasks.length : 0), 0);  
  let completedTasks = projects.reduce((acc, curr) => {
    if (Array.isArray(curr.tasks)) {
      return acc + curr.tasks.filter(task => task.status === "Completed").length;
    }
    return acc;
  }, 0);
  
  // Helpers to compare dates by day (exclude today from overdue)
  const startOfDay = (d) => {
    const dt = new Date(d);
    dt.setHours(0, 0, 0, 0);
    return dt;
  };
  const today = startOfDay(new Date());
  
  // Get missed deadline tasks
  let missedDeadlineTasks = [];
  projects.forEach(project => {
    if (Array.isArray(project.tasks)) {
      project.tasks.forEach(task => {
        if (task.dueDate && startOfDay(task.dueDate) < today && task.status !== "Completed") {
          missedDeadlineTasks.push({
            ...task,
            projectName: project.Name,
            projectId: project._id
          });
        }
      });
    }
  });
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <Navbar name="manager" />
      <Row style={{ margin: 0 }}>
        <Col md={3} style={{ padding: 0 }}>
          <Sidebar user="manager" value="dashboard" />
        </Col>
        <Col md={9} style={{ padding: '20px 30px' }}>
          {/* Header Section */}
          <DashboardHeader />

          {/* User Profile Section */}
          <UserProfileSection 
            user={user} 
            onUpdateProfile={() => setShowUpdateProfile(true)} 
          />

          {/* Performance Metrics Section - Full Width */}
          <PerformanceMetrics 
            projects={projects}
            totalTask={totalTask}
            completedTasks={completedTasks}
            startOfDay={startOfDay}
            today={today}
          />

          {/* Projects and Missed Tasks Side by Side */}
          <Row style={{ margin: '0 -8px' }}>
            <ProjectsList 
              projects={projects}
              startOfDay={startOfDay}
              today={today}
            />

            <MissedDeadlineTasks 
              missedDeadlineTasks={missedDeadlineTasks}
              startOfDay={startOfDay}
              today={today}
            />
          </Row>
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
