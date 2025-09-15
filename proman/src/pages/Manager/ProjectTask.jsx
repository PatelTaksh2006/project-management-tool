import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Container, Table, Button, Badge } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import DisplayProjectInformation from "../../components/DisplayProjectInformation";
import { getProjects, update, subscribe } from "../../Data/Projects";
import AddNewTask from "../../components/AddNewTask";
import EditTask from "../../components/EditTask";

export default function ProjectTask() {
  const { id } = useParams();
  const [project, setProject] = useState(getProjects().find(p => p.Id == id) || {});
  const [tasks, setTasks] = useState(project.task || []);
  const [showUpdateTask, setUpdateTask] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Sync with global project/task changes
  useEffect(() => {
    const unsub = subscribe((allProjects) => {
      const updatedProject = allProjects.find(p => p.Id == id) || {};
      setProject(updatedProject);
      setTasks(updatedProject.task || []);
    });
    // Initial load
    const updatedProject = getProjects().find(p => p.Id == id) || {};
    setProject(updatedProject);
    setTasks(updatedProject.task || []);
    return unsub;
  }, [id]);

  function addNewTask() {
    setShowCreateTask(true);
  }

  function onUpdateTask(task) {
    setSelectedTask(task);
    setUpdateTask(true);
  }

  // Only update global store, let subscribe update local state
  function handleAddTask(newTask) {
const maxId = project.task?.length 
                ? Math.max(...project.task.map(t => t.id)) 
                : 0;
                
  const taskWithId = { ...newTask, id: maxId + 1 };
    update({ ...project, task: [...(project.task || []), taskWithId] });
  }

  function handleTaskUpdate(updatedTask) {
    update({
      ...project,
      task: (project.task || []).map(t => t.id === updatedTask.id ? updatedTask : t)
    });
  }

  function handleDeleteTask(taskId) {
    update({
      ...project,
      task: (project.task || []).filter(t => t.id !== taskId)
    });
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
                      <tr key={task.id}>
                        <td>{idx + 1}</td>
                        <td>{task.name}</td>
                        <td>{task.assignedTo}</td>
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
                        <td style={{ whiteSpace: "nowrap" }}>{task.dueDate}</td>
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
                              onClick={() => handleDeleteTask(task.id)}
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
              <Button variant="success" className="mb-2" onClick={addNewTask}>
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
        employeeList={project.team}
      />

      <EditTask
        task={selectedTask}
        show={showUpdateTask}
        onClose={() => setUpdateTask(false)}
        onTaskUpdate={handleTaskUpdate}
        employeeList={project.team}
      />
    </div>
  );
}