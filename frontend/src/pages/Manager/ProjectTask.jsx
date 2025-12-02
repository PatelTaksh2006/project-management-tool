import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import ProjectTaskHeader from "../../components/ProjectTaskHeader";
import ProjectInformationCard from "../../components/ProjectInformationCard";
import TaskSummarySection from "../../components/TaskSummarySection";
import { getProjects, update, subscribe } from "../../Data/Projects";
import { getTasks, Add as AddTask, update as UpdateTask, del as DeleteTask, subscribe as subscribeTasks } from "../../Data/Tasks";
import AddNewTask from "../../components/AddNewTask";
import EditTask from "../../components/EditTask";
import EditProject from "../../components/EditProject";
import { useUser } from "../../contexts/UserContext";

export default function ProjectTask() {
  const { id } = useParams();
  const { user, token } = useUser();
  const managerId = user?._id; // Use user ID from context, fallback to 101
  // Start with empty values; we'll populate from the global store via subscribe
  const [project, setProject] = useState({});
  const [tasks, setTasks] = useState([]);
  const [showUpdateTask, setUpdateTask] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showEditProject, setShowEditProject] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Format date for display (strip ISO time if present)
  const formatDate = (d) => {
    if (!d) return '';
    try {
      const dt = new Date(d);
      if (!isNaN(dt)) return dt.toLocaleDateString();
    } catch (e) {}
    if (typeof d === 'string' && d.indexOf('T') !== -1) return d.split('T')[0];
    return String(d);
  };

  // Function to refresh project data from backend
  const refreshProjectData = async () => {
    try {
      console.log('ProjectTask: Refreshing project and tasks data...');
      
      // Fetch fresh project data
      const allProjects = await getProjects(managerId, token);
      const freshProject = Array.isArray(allProjects) ? allProjects.find((p) => p._id === id) || {} : {};
      
      // Fetch fresh tasks data
      const freshTasks = await getTasks(id, token);
      
      console.log('ProjectTask: Fresh data received - Project:', freshProject.Name, 'Tasks:', freshTasks?.length);
      
      // Update state with fresh data (new object references)
      setProject({ ...freshProject });
      setTasks(Array.isArray(freshTasks) ? [...freshTasks] : []);
    } catch (err) {
      console.error('Failed to refresh project data:', err);
    }
  };

  // Sync with global project/task changes
  useEffect(() => {
    let mounted = true;
    const unsub = subscribe((allProjects) => {
      if (!Array.isArray(allProjects)) return;
      const updatedProject = allProjects.find((p) => p._id === id) || {};
      if (!mounted) return;
      setProject(updatedProject);
    });

    // subscribe to tasks store
    const unsubTasks = subscribeTasks((ts) => {
      if (!mounted) return;
      if (Array.isArray(ts)) setTasks(ts);
    });

    // Initial load: fetch projects for this manager so the store is populated
    (async () => {
      try {
        if (managerId) {
          const all = await getProjects(managerId, token);
          const updatedProject = Array.isArray(all) ? all.find((p) => p._id === id) || {} : {};
          if (mounted) {
            setProject(updatedProject);
            // initial load tasks for this project from Tasks store
            const load = async () => {
              try {
                const ts = await getTasks(id, token);
                if (mounted) setTasks(Array.isArray(ts) ? ts : []);
              } catch (err) {
                console.error('Failed to load tasks for project:', err);
              }
            };
            load();
          }
        }
      } catch (err) {
        console.error("ProjectTask initial load error:", err);
      }
    })();

    return () => {
      mounted = false;
      if (typeof unsub === 'function') unsub();
      if (typeof unsubTasks === 'function') unsubTasks();
    };
  }, [id, managerId]);

  function addNewTask() {
    setShowCreateTask(true);
  }

  function onUpdateTask(task) {
    setSelectedTask(task);
    setUpdateTask(true);
  }

  // Only update global store, let subscribe update local state
  async function handleAddTask(newTask) {
    // Attach projectId and call Tasks.Add
    const payload = { ...newTask, projectId: id };
    await AddTask(payload, token).catch((e) => console.error('AddTask failed:', e));
    // Refresh data after adding task
    await refreshProjectData();
  }

  async function handleTaskUpdate(updatedTask) {
    if (!updatedTask) return;
    const payload = { ...updatedTask, projectId: id };
    await UpdateTask(payload, token).catch((e) => console.error('UpdateTask failed:', e));
    // Refresh data after updating task
    await refreshProjectData();
  }

  function handleDeleteTask(taskId) {
    if (!taskId) return;
    DeleteTask(taskId, id, token)
      .then(() => refreshProjectData())
      .catch((e) => console.error('DeleteTask failed:', e));
  }

  function handleEditProject() {
    setShowEditProject(true);
  }

  async function handleProjectUpdate(updatedProject) {
    if (updatedProject) {
      updatedProject.managerId = managerId; // Ensure managerId is set
      update(updatedProject, token);
      // Refresh data after updating project
      await refreshProjectData();
    }
    setShowEditProject(false);
  }

  return (
    <div>
      <Navbar name="manager" />
      <Row>
        <Col md={3}>
          <Sidebar user={"manager"} value={"project"} />
        </Col>
        <Col md={8}>
          <ProjectTaskHeader />
          
          <ProjectInformationCard 
            project={project} 
            onEditProject={handleEditProject} 
          />
          
          <TaskSummarySection
            tasks={tasks}
            projectStatus={project.Status}
            onAddNewTask={addNewTask}
            onUpdateTask={onUpdateTask}
            onDeleteTask={handleDeleteTask}
            formatDate={formatDate}
          />
        </Col>
      </Row>

      <AddNewTask
        show={showCreateTask}
        onClose={async () => {
          setShowCreateTask(false);
          await refreshProjectData();
        }}
        onTaskAdd={handleAddTask}
        employeeList={project.team || []}
      />

      <EditTask
        task={selectedTask}
        show={showUpdateTask}
        onClose={async () => {
          setUpdateTask(false);
          await refreshProjectData();
        }}
        onTaskUpdate={handleTaskUpdate}
        employeeList={Array.isArray(project.team) ? project.team : []}
      />

      <EditProject
        project={project}
        show={showEditProject}
        onClose={async () => {
          setShowEditProject(false);
          await refreshProjectData();
        }}
        onProjectUpdate={handleProjectUpdate}
        SelectedEmployeeList={Array.isArray(project.team) ? project.team : []}
      />
    </div>
  );
}