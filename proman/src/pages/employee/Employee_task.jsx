import React, { useMemo, useState, useEffect } from "react";
import Search_form from "../../components/Search_form";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Row, Col, Container, Table, Badge, Form, Button } from "react-bootstrap";
import { getEmployeeTasks, update as UpdateTask, subscribe as subscribeTasks } from "../../Data/Tasks";
import { useUser } from "../../contexts/UserContext";
import { ArrowCounterclockwise, Check2Circle, Paperclip } from "react-bootstrap-icons";

export default function Employee_task() {
  const { user } = useUser();
  const employeeId = user?._id || user?.id || user?.Id;
  const employeeName = user?.name || user?.Name || user?.Email || "Employee";
  const [searchValue, setSearchValue] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("None");
  const [tasks, setTasks] = useState(user?.tasks || []);
  // For file upload modal
  const [showFileInput, setShowFileInput] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  // Subscribe to the Tasks store and perform an initial load (mirror Project.jsx pattern)
  useEffect(() => {
    let mounted = true;
    // Subscribe to shared tasks store updates
    const unsub = subscribeTasks((ts) => {
      if (!mounted) return;
      if (Array.isArray(ts)) setTasks(ts);
    });

    // Initial load: fetch tasks for this employee
    (async () => {
      try {
        if (employeeId) {
          const fetched = await getEmployeeTasks(employeeId);
          if (mounted) setTasks(Array.isArray(fetched) ? fetched : []);
        }
      } catch (err) {
        console.error('Employee task initial load error:', err);
      }
    })();

    return () => {
      mounted = false;
      if (typeof unsub === 'function') unsub();
    };
  }, [employeeId]);

  // Helper to check if a task is assigned to this employee (tolerant to shapes)
  function isAssignedToEmployee(t) {
    try {
      if (!t) return false;
      // direct id fields
      if (t.assignedToId && employeeId && String(t.assignedToId) === String(employeeId)) return true;
      if (t.assignedTo && typeof t.assignedTo === 'string') {
        if (t.assignedTo === String(employeeId)) return true;
        if ((t.assignedTo || '').toLowerCase() === (employeeName || '').toLowerCase()) return true;
      }
      if (t.assignedTo && typeof t.assignedTo === 'object') {
        if (t.assignedTo._id && String(t.assignedTo._id) === String(employeeId)) return true;
        if (t.assignedTo.Name && String(t.assignedTo.Name).toLowerCase() === (employeeName || '').toLowerCase()) return true;
        if (t.assignedTo.name && String(t.assignedTo.name).toLowerCase() === (employeeName || '').toLowerCase()) return true;
      }
      return false;
    } catch (err) {
      console.error('isAssignedToEmployee error', err, t);
      return false;
    }
  }

  // Debug: log when tasks arrive/change
  useEffect(() => {
    console.log('Employee_task: tasks updated, count=', tasks.length);
  }, [tasks]);

  // Only show projects for this employee
  const projectOptions = useMemo(() => {
    const employeeTasks = tasks.filter(isAssignedToEmployee);
    return Array.from(new Set(employeeTasks.map(t => t.projectId.Name)));
  }, [employeeId, employeeName, tasks]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    // helper to match different shapes of assignedTo
    let filtered = tasks.filter(isAssignedToEmployee);
    if (searchValue) {
      filtered = filtered.filter(t =>
        (t.name?.toLowerCase() || '').includes(searchValue.toLowerCase())
      );
    }
    if (priorityFilter !== "All") {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }
    if (projectFilter !== "All") {
      filtered = filtered.filter(t => t.projectId.Name === projectFilter);
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
  }, [employeeId, employeeName, searchValue, priorityFilter, projectFilter, statusFilter, sortBy, tasks]);

  // Task summary counts
  const completedCount = useMemo(() => tasks.filter(
    t => isAssignedToEmployee(t) && t.status === "Completed"
  ).length, [tasks, employeeId, employeeName]);
  const inProgressCount = useMemo(() => tasks.filter(
    t => isAssignedToEmployee(t) && t.status === "In Progress"
  ).length, [tasks, employeeId, employeeName]);
  const todoCount = useMemo(() => tasks.filter(
    t => isAssignedToEmployee(t) && t.status === "To Do"
  ).length, [tasks, employeeId, employeeName]);

  // Mark task as completed (update global store)
  const handleMarkCompleted = (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    let updated = null;
    if (task) {
      if (task.status != "Completed") {
        updated = { ...task, status: "Completed" };
      }
      else if (task.status === "Completed") {
        updated = { ...task, status: "In Progress" };
      }
      if (updated) {
        UpdateTask(updated)
          .then(() => getEmployeeTasks(employeeId).then(fetched => setTasks(Array.isArray(fetched) ? fetched : [])))
          .catch((e) => console.error('UpdateTask failed:', e));
        // optimistic update while backend call is in-flight
        setTasks((prev) => prev.map(t => t._id === taskId ? updated : t));
      }
    }
    // persist via Tasks store and refresh tasks for this employee

  };

  // Handle file upload (update global store)
  const handleFileButtonClick = (taskId) => {
    setCurrentTaskId(taskId);
    setShowFileInput(true);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const task = tasks.find(t => t._id === currentTaskId);
    const files = selectedFiles.map(file => {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const safe = (s) => String(s || '').replace(/[^a-z0-9._-]/gi, '_');

      // preserve extension exactly once, keep it lowercase for consistency
      const extMatch = /(\.[^/.]+)$/.exec(file.name);
      const ext = extMatch ? extMatch[1].toLowerCase() : '';
      const baseName = ext ? file.name.slice(0, -ext.length) : file.name;

      const originalBaseSafe = safe(baseName);
      const taskNameSafe = safe((task && task.name) || 'task');
      const projectNameSafe = safe((task && (task.projectName || (task.project && (task.project.Name || task.project.name)))) || 'project');

      const storedName = `${originalBaseSafe}_${taskNameSafe}_${projectNameSafe}_${timestamp}${ext}`;
      const url = `/upload_Documents/${storedName}`;

    

      // Best-effort: try to upload the file to a generic upload endpoint so server can persist it
      (async () => {
        try {
          const form = new FormData();
          form.append('file', file, storedName);
          // include optional target folder information if backend supports it
          form.append('targetPath', 'upload_Documents');
          const res = await fetch('http://localhost:3001/api/upload', {
            method: 'POST',
            body: form,
          });
          if (!res.ok) {
            // Not fatal for UI, just log
            console.warn('Upload failed for', storedName, await res.text());
          }
        } catch (err) {
          console.warn('Upload request failed (server may not support /api/upload):', err);
        }
      })();

      return { name: storedName, url };
    });
    if (task) {
      const updated = { ...task, files: [...(task.files || []), ...files] };
      UpdateTask({ ...updated, projectId: task.projectId })
        .then(() => getEmployeeTasks(employeeId).then(fetched => setTasks(Array.isArray(fetched) ? fetched : [])))
        .catch((e) => console.error('UpdateTask failed:', e));
      setTasks((prev) => prev.map(t => t._id === currentTaskId ? updated : t));
    }
    setShowFileInput(false);
    setCurrentTaskId(null);
};


  return (
    <div>
      <Navbar name="employee" />
      <Row>
        <Col md={3}>
          <Sidebar user={"employee"} value="task" id_name={employeeName} />
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
                      filteredTasks.map((task, idx) => {
                        const isOverdue = (task && task._doc && task._doc.isOverdue) || task.isOverdue;
                        return (
                          <tr key={task._id} style={isOverdue ? { backgroundColor: '#fff1f1' } : undefined}>
                            <td>{idx + 1}</td>
                            <td>{task.name}</td>
                            <td>{task.projectId.Name}</td>
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
                            <td style={{ whiteSpace: "nowrap", color: isOverdue ? '#b00020' : undefined }}>
                              {task.dueDate} {isOverdue && <Badge bg="danger" style={{ marginLeft: 8 }}>Overdue</Badge>}
                            </td>
                            <td>
                              {task.files && task.files.length > 0 ? (
                                task.files.map((file, fidx) => (
                                  <span
                                    key={fidx}
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      margin: "2px 6px 2px 0",
                                      paddingRight: 6
                                    }}
                                  >
                                    <a
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        display: "inline-block",
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
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      title="Delete file"
                                      onClick={async () => {
                                        if (!window.confirm(`Delete file "${file.name}"?`)) return;
                                        try {
                                          // Build updated task without this file (optimistic UI)
                                          const updated = { ...task, files: (task.files || []).filter((_, i) => i !== fidx) };
                                          setTasks(prev => prev.map(t => t._id === task._id ? updated : t));
                                          // Persist the change
                                          await UpdateTask({ ...updated, projectId: task.projectId });
                                          // Refresh tasks from server/store
                                          const fetched = await getEmployeeTasks(employeeId);
                                          setTasks(Array.isArray(fetched) ? fetched : []);
                                        } catch (e) {
                                          console.error('Delete file failed:', e);
                                        }
                                      }}
                                      style={{ marginLeft: 6 }}
                                    >
                                      ✖
                                    </Button>
                                  </span>
                                ))
                              ) : (
                                <span>No files</span>
                              )}
                            </td>
                            <td style={{ textAlign: "center" }}>

                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleMarkCompleted(task._id)}
                                  title="Mark as Completed"
                                  disabled={task.status == "To Do" || task.projectId.Status !== "Active"}
                                >
                                  {task.status === "Completed" ? <ArrowCounterclockwise /> : <Check2Circle />}
                                </Button>
                                {(task.status != "Completed" && <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleFileButtonClick(task._id)}
                                  title="Add File"
                                  disabled={task.status != "In Progress" || task.projectId.Status !== "Active"}
                                >
                                  <Paperclip />
                                </Button>)}

                                {/* Hidden file input for this task */}
                                {showFileInput && currentTaskId === task._id && (
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

                            </td>
                          </tr>
                        );
                      }
                      
                    ))

                                      }                    </tbody>
                </Table>
              </div>
            </Row>
          </Container>
        </Col>
      </Row>
    </div>
  );
}