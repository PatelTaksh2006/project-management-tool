import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Container, Table, Button, Badge } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import DisplayProjectInformation from "../../components/DisplayProjectInformation";
import { getProjects, update, subscribe } from "../../Data/Projects";
import { getTasks, Add as AddTask, update as UpdateTask, del as DeleteTask, subscribe as subscribeTasks } from "../../Data/Tasks";
import AddNewTask from "../../components/AddNewTask";
import EditTask from "../../components/EditTask";
import EditProject from "../../components/EditProject";
import { useUser } from "../../contexts/UserContext";

export default function ProjectTask() {
  const { id } = useParams();
  const { user } = useUser();
  const managerId = user?._id; // Use user ID from context, fallback to 101
  // Start with empty values; we'll populate from the global store via subscribe
  const [project, setProject] = useState({});
  const [tasks, setTasks] = useState([]);
  const [showUpdateTask, setUpdateTask] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showEditProject, setShowEditProject] = useState(false);
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
          const all = await getProjects(managerId);
          const updatedProject = Array.isArray(all) ? all.find((p) => p._id === id) || {} : {};
          if (mounted) {
            setProject(updatedProject);
            // initial load tasks for this project from Tasks store
            const load = async () => {
              try {
                const ts = await getTasks(id);
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
  function handleAddTask(newTask) {
    // Attach projectId and call Tasks.Add
    const payload = { ...newTask, projectId: id };
    AddTask(payload).catch((e) => console.error('AddTask failed:', e));
  }

  function handleTaskUpdate(updatedTask) {
    if (!updatedTask) return;
    const payload = { ...updatedTask, projectId: id };
    UpdateTask(payload).catch((e) => console.error('UpdateTask failed:', e));
  }

  function handleDeleteTask(taskId) {
    if (!taskId) return;
    DeleteTask(taskId, id).catch((e) => console.error('DeleteTask failed:', e));
  }

  function handleEditProject() {
    setShowEditProject(true);
  }

  function handleProjectUpdate(updatedProject) {
    if (updatedProject) {
      updatedProject.managerId = managerId; // Ensure managerId is set
      update(updatedProject);
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
          <div style={{
            background: '#4f46e5',
            color: 'white',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
              📋 Project Details
            </h2>
            <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
              View and manage all information and tasks for this project
            </p>
          </div>
          <Container style={{ marginBottom: '20px' }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <h4 style={{ 
                  margin: 0, 
                  color: '#374151', 
                  fontSize: '18px', 
                  fontWeight: '600' 
                }}>
                  🏢 Project Information
                </h4>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleEditProject}
                  style={{
                    borderRadius: '8px',
                    padding: '6px 16px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  ✏️ Edit Project
                </Button>
              </div>
              <DisplayProjectInformation project={project} />
            </div>
          </Container>
          
          <Container>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ 
                margin: '0 0 20px 0', 
                color: '#374151', 
                fontSize: '18px', 
                fontWeight: '600' 
              }}>
                📝 Task Summary
              </h4>
              
              <div style={{
                maxHeight: "400px",
                overflowY: "auto",
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                marginBottom: '20px'
              }}>
                <Table striped bordered hover responsive className="mb-0">
                  <thead style={{ background: '#f8f9fa', position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr>
                      <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>#</th>
                      <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Task Name</th>
                      <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Assigned To</th>
                      <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Status</th>
                      <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Priority</th>
                      <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Due Date</th>
                      <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Files</th>
                      <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center" style={{ padding: '20px' }}>
                          No tasks found.
                        </td>
                      </tr>
                    ) : (
                      tasks.map((task, idx) => (
                        <tr key={task._id}>
                          <td style={{ padding: '12px' }}>{idx + 1}</td>
                          <td style={{ padding: '12px' }}>{task.name}</td>
                          <td style={{ padding: '12px' }}>{task.assignedTo?.Name}</td>
                          <td style={{ padding: '12px' }}>
                            <Badge
                              bg={
                                task.status === "Completed"
                                  ? "success"
                                  : task.status === "In Progress"
                                  ? "warning"
                                  : "secondary"
                              }
                            >
                              {task.status}
                            </Badge>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <Badge
                              bg={
                                task.priority === "High"
                                  ? "danger"
                                  : task.priority === "Medium"
                                  ? "warning"
                                  : "secondary"
                              }
                            >
                              {task.priority}
                            </Badge>
                          </td>
                          {(() => {
                            const isOverdue = (task && task._doc && task._doc.isOverdue) || task.isOverdue;
                            return (
                              <td style={{ 
                                padding: '12px', 
                                whiteSpace: "nowrap", 
                                color: isOverdue ? '#b00020' : undefined 
                              }}>
                                {task.dueDate} {isOverdue && <Badge bg="danger" style={{ marginLeft: 8 }}>Overdue</Badge>}
                              </td>
                            );
                          })()}
                          <td style={{ padding: '12px' }}>
                            {task.files && task.files.length > 0 ? (
                              task.files.map((file, fidx) => (
                                <a
                                  key={fidx}
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: "inline-block",
                                    margin: "2px 6px 2px 0",
                                    padding: "4px 10px 4px 8px",
                                    borderRadius: "16px",
                                    background: "#f1f3f4",
                                    color: "#333",
                                    textDecoration: "none",
                                    fontSize: "0.95em",
                                    border: "1px solid #d1d5da",
                                    boxShadow: "0 1px 2px rgba(60,60,60,0.05)",
                                    verticalAlign: "middle"
                                  }}
                                >
                                  <span role="img" aria-label="file" style={{ marginRight: 6, color: "#6c63ff" }}>@</span>
                                  {file.name}
                                </a>
                              ))
                            ) : (
                              <span>No files</span>
                            )}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => onUpdateTask(task)}
                                style={{ 
                                  minWidth: "70px",
                                  borderRadius: '6px'
                                }}
                              >
                                Update
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteTask(task._id)}
                                style={{ 
                                  minWidth: "70px",
                                  borderRadius: '6px'
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
              
              <Button 
                onClick={addNewTask} 
                disabled={project.Status!=="Active"}
                style={{
                  background: project.Status === "Active" ? '#10b981' : '#9ca3af',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontWeight: '500',
                  color: 'white'
                }}
              >
                + Add New Task
              </Button>
            </div>
          </Container>
        </Col>
      </Row>

      <AddNewTask
        show={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        onTaskAdd={handleAddTask}
        employeeList={project.team || []}
      />

      <EditTask
        task={selectedTask}
        show={showUpdateTask}
        onClose={() => setUpdateTask(false)}
        onTaskUpdate={handleTaskUpdate}
        employeeList={Array.isArray(project.team) ? project.team : []}
      />

      <EditProject
        project={project}
        show={showEditProject}
        onClose={() => setShowEditProject(false)}
        onProjectUpdate={handleProjectUpdate}
        SelectedEmployeeList={Array.isArray(project.team) ? project.team : []}
      />
    </div>
  );
}