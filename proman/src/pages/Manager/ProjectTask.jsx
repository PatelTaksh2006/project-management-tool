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

  return (
    <div>
      <Navbar name="manager" />
      <Row>
        <Col md={3}>
          <Sidebar user={"manager"} value={"project"} />
        </Col>
        <Col md={8}>
          <Container className="fluid" style={{ paddingTop: 60, margin: 20 }}>
            <Row>
              <Col xs={12} md={6}>
                <h3 className="mb-0">Project Details</h3>
                <div className="text-muted small">
                  View and manage all information and tasks for this project
                </div>
              </Col>
              <Col sm={{ span: 3, offset: 3 }}></Col>
            </Row>
          </Container>
          <Container>
            <Row>
              <Col>
                <DisplayProjectInformation project={project} />
              </Col>
            </Row>
          </Container>
          <Container style={{ paddingTop: "20px" }}>
            <Row>
              <h4>Task Summary</h4>
            </Row>
            <Row
              className="table-scroll-container"
              style={{
                maxHeight: "300px",
                overflowY: "scroll",
              }}
            >
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Task Name</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Files</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center">
                        No tasks found.
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task, idx) => (
                      <tr key={task._id}>
                        <td>{idx + 1}</td>
                        <td>{task.name}</td>
                        <td>{task.assignedTo?.Name}</td>
                        <td>
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
                        <td>
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
                            <td style={{ whiteSpace: "nowrap", color: isOverdue ? '#b00020' : undefined }}>
                              {task.dueDate} {isOverdue && <Badge bg="danger" style={{ marginLeft: 8 }}>Overdue</Badge>}
                            </td>
                          );
                        })()}
                        <td>
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
                        <td>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => onUpdateTask(task)}
                              style={{ minWidth: "70px" }}
                            >
                              Update
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteTask(task._id)}
                              style={{ minWidth: "70px" }}
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
            </Row>
            <Row>
              <Button variant="success" className="mb-2" onClick={addNewTask} disabled={project.Status!=="Active"}>
                Add New Task
              </Button>
            </Row>
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
    </div>
  );
}