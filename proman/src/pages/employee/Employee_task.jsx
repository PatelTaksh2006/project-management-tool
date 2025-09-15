import React, { useMemo, useState, useEffect } from "react";
import Search_form from "../../components/Search_form";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Row, Col, Container, Table, Badge, Form, Button } from "react-bootstrap";
import { getTasks, update, subscribe } from "../../Data/Tasks";
import { useParams } from 'react-router-dom';
import { Check2, Paperclip } from "react-bootstrap-icons";

export default function Employee_task() {
  const { employeeName } = useParams();
  const [searchValue, setSearchValue] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("None");
  const [tasks, setTasks] = useState(getTasks());

  // For file upload modal
  const [showFileInput, setShowFileInput] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  // Sync with global task changes
  useEffect(() => {
    const unsub = subscribe(setTasks);
    setTasks(getTasks());
    return unsub;
  }, []);

  // Only show projects for this employee
  const projectOptions = useMemo(() => {
    const employeeTasks = tasks.filter(
      t => (t.assignedTo?.toLowerCase() || '') === employeeName?.toLowerCase()
    );
    return Array.from(new Set(employeeTasks.map(t => t.projectName)));
  }, [employeeName, tasks]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter(
      t => (t.assignedTo?.toLowerCase() || '') === employeeName?.toLowerCase()
    );
    if (searchValue) {
      filtered = filtered.filter(t =>
        (t.name?.toLowerCase() || '').includes(searchValue.toLowerCase())
      );
    }
    if (priorityFilter !== "All") {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }
    if (projectFilter !== "All") {
      filtered = filtered.filter(t => t.projectName === projectFilter);
    }
    if (statusFilter !== "All") {
      filtered = filtered.filter(t => t.status === statusFilter);
    }
    // Sorting
    if (sortBy === "NameAsc") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "NameDesc") {
      filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "DueAsc") {
      filtered = [...filtered].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === "DueDesc") {
      filtered = [...filtered].sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    }
    return filtered;
  }, [employeeName, searchValue, priorityFilter, projectFilter, statusFilter, sortBy, tasks]);

  // Task summary counts
  const completedCount = useMemo(() => tasks.filter(
    t => (t.assignedTo?.toLowerCase() || '') === employeeName?.toLowerCase() && t.status === "Completed"
  ).length, [tasks, employeeName]);
  const inProgressCount = useMemo(() => tasks.filter(
    t => (t.assignedTo?.toLowerCase() || '') === employeeName?.toLowerCase() && t.status === "In Progress"
  ).length, [tasks, employeeName]);
  const todoCount = useMemo(() => tasks.filter(
    t => (t.assignedTo?.toLowerCase() || '') === employeeName?.toLowerCase() && t.status === "To Do"
  ).length, [tasks, employeeName]);

  // Mark task as completed (update global store)
  const handleMarkCompleted = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      update({ ...task, status: "Completed" });
    }
  };

  // Handle file upload (update global store)
  const handleFileButtonClick = (taskId) => {
    setCurrentTaskId(taskId);
    setShowFileInput(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    const task = tasks.find(t => t.id === currentTaskId);
    if (task) {
      update({
        ...task,
        files: [...(task.files || []), ...files]
      });
    }
    setShowFileInput(false);
    setCurrentTaskId(null);
  };

  return (
    <div>
      <Navbar name="employee"/>
      <Row>
        <Col md={3}>
          <Sidebar user={"employee"} value="task" id_name="frank"/>
        </Col>
        <Col md={8}>
          <Container className="fluid" style={{ paddingTop: 60, margin: 20 }}>
            <Row>
              <Col xs={12} md={6}>
                <h3 className="mb-0">My Tasks</h3>
                <div className="text-muted small">
                  All tasks assigned to you, filter and track your work.
                </div>
              </Col>
            </Row>
          </Container>
          {/* Task summary bar */}
          <Container>
            <Row className="mb-2">
              <Col sm={4}>
                <div className="p-2 bg-success text-white rounded text-center">
                  Completed: {completedCount}
                </div>
              </Col>
              <Col sm={4}>
                <div className="p-2 bg-warning text-dark rounded text-center">
                  In Progress: {inProgressCount}
                </div>
              </Col>
              <Col sm={4}>
                <div className="p-2 bg-secondary text-white rounded text-center">
                  To Do: {todoCount}
                </div>
              </Col>
            </Row>
          </Container>
          {/* Filter/search controls */}
          <Container>
            <Row className="align-items-center mb-1">
              <Col md={3} style={{ paddingTop: "10px" }}>
                <Search_form
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  inputWidth="180px"
                />
              </Col>
              <Col md={2} style={{ paddingTop: "10px" }}>
                <Form.Select
                  value={priorityFilter}
                  onChange={e => setPriorityFilter(e.target.value)}
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Form.Select>
              </Col>
              <Col md={2} style={{ paddingTop: "10px" }}>
                <Form.Select
                  value={projectFilter}
                  onChange={e => setProjectFilter(e.target.value)}
                >
                  <option value="All">All Projects</option>
                  {projectOptions.map((proj, idx) => (
                    <option key={idx} value={proj}>{proj}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2} style={{ paddingTop: "10px" }}>
                <Form.Select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </Form.Select>
              </Col>
              <Col md={3} style={{ paddingTop: "10px" }}>
                <Form.Select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="None">Sort By</option>
                  <option value="NameAsc">Name (A-Z)</option>
                  <option value="NameDesc">Name (Z-A)</option>
                  <option value="DueAsc">Due Date (Earliest)</option>
                  <option value="DueDesc">Due Date (Latest)</option>
                </Form.Select>
              </Col>
            </Row>
          </Container>
          {/* Task table */}
          <Container style={{ paddingTop: "10px" }}>
            <Row
              className="table-scroll-container"
              style={{
                maxHeight: "300px",
                overflowY: "scroll",
              }}
            >
              <div style={{ width: "100%", overflowX: "auto" }}>
                <Table striped bordered hover responsive style={{ minWidth: 900 }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Task Name</th>
                      <th>Project</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Due Date</th>
                      <th>Files</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center">
                          No tasks found.
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((task, idx) => (
                        <tr key={task.id}>
                          <td>{idx + 1}</td>
                          <td>{task.name}</td>
                          <td>{task.projectName}</td>
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
                                  <span role="img" aria-label="file" style={{ marginRight: 6, color: "#6c63ff" }}>📎</span>
                                  {file.name}
                                </a>
                              ))
                            ) : (
                              <span>No files</span>
                            )}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {task.status !== "Completed" && (
                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleMarkCompleted(task.id)}
                                  title="Mark as Completed"
                                >
                                  <Check2 />
                                </Button>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleFileButtonClick(task.id)}
                                  title="Add File"
                                >
                                  <Paperclip />
                                </Button>
                                {/* Hidden file input for this task */}
                                {showFileInput && currentTaskId === task.id && (
                                  <input
                                    type="file"
                                    multiple
                                    style={{ display: "none" }}
                                    autoFocus
                                    onChange={handleFileChange}
                                    onBlur={() => { setShowFileInput(false); setCurrentTaskId(null); }}
                                    ref={input => input && input.click()}
                                  />
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Row>
          </Container>
        </Col>
      </Row>
    </div>
  );
}