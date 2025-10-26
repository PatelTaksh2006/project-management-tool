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
        console.log('Marking task as completed:', updated);
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
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <Navbar name="employee" />
      <Row style={{ margin: 0 }}>
        <Col md={3} style={{ padding: 0 }}>
          <Sidebar user={"employee"} value="task" id_name={employeeName} />
        </Col>
        <Col md={9} style={{ padding: '20px 30px' }}>
          {/* Header Section */}
          <div style={{
            background: '#4f46e5',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '2rem', 
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  My Tasks
                </h2>
                <p style={{ 
                  margin: 0, 
                  fontSize: '1rem', 
                  opacity: 0.9
                }}>
                  Track and manage your assigned tasks
                </p>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{ fontSize: '2rem', textAlign: 'center' }}>📋</div>
              </div>
            </div>
          </div>
          {/* Task Summary Cards */}
          <Row style={{ marginBottom: '32px' }}>
            <Col sm={4} style={{ marginBottom: '16px' }}>
              <div style={{
                background: '#10b981',
                borderRadius: '12px',
                padding: '20px',
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✓</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '4px' }}>{completedCount}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Completed</div>
              </div>
            </Col>
            <Col sm={4} style={{ marginBottom: '16px' }}>
              <div style={{
                background: '#f59e0b',
                borderRadius: '12px',
                padding: '20px',
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⏳</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '4px' }}>{inProgressCount}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>In Progress</div>
              </div>
            </Col>
            <Col sm={4} style={{ marginBottom: '16px' }}>
              <div style={{
                background: '#3b82f6',
                borderRadius: '12px',
                padding: '20px',
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📝</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '4px' }}>{todoCount}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>To Do</div>
              </div>
            </Col>
          </Row>
          {/* Filter Controls */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h5 style={{ 
              marginBottom: '16px', 
              color: '#374151', 
              fontWeight: '600',
              fontSize: '1.1rem'
            }}>
              Filter & Search
            </h5>
            <Row className="align-items-center">
              <Col md={3} style={{ marginBottom: "16px" }}>
                <div style={{ position: 'relative' }}>
                  <Search_form
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    inputWidth="100%"
                  />
                </div>
              </Col>
              <Col md={2} style={{ marginBottom: "16px" }}>
                <Form.Select
                  value={priorityFilter}
                  onChange={e => setPriorityFilter(e.target.value)}
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    padding: '8px 12px',
                    fontSize: '14px'
                  }}
                >
                  <option value="All">🎯 All Priorities</option>
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </Form.Select>
              </Col>
              <Col md={2} style={{ marginBottom: "16px" }}>
                <Form.Select
                  value={projectFilter}
                  onChange={e => setProjectFilter(e.target.value)}
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    padding: '12px 16px',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                >
                  <option value="All">📁 All Projects</option>
                  {projectOptions.map((proj, idx) => (
                    <option key={idx} value={proj}>{proj}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2} style={{ marginBottom: "16px" }}>
                <Form.Select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    padding: '12px 16px',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                >
                  <option value="All">📊 All Status</option>
                  <option value="To Do">📝 To Do</option>
                  <option value="In Progress">⏳ In Progress</option>
                  <option value="Completed">✅ Completed</option>
                </Form.Select>
              </Col>
              <Col md={3} style={{ marginBottom: "16px" }}>
                <Form.Select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    padding: '12px 16px',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                >
                  <option value="None">🔄 Sort By</option>
                  <option value="NameAsc">📝 Name (A-Z)</option>
                  <option value="NameDesc">📝 Name (Z-A)</option>
                  <option value="DueAsc">📅 Due Date (Earliest)</option>
                  <option value="DueDesc">📅 Due Date (Latest)</option>
                </Form.Select>
              </Col>
            </Row>
          </div>
          {/* Tasks Table */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              background: '#4f46e5',
              padding: '16px 20px',
              color: 'white'
            }}>
              <h5 style={{ margin: 0, fontWeight: '600' }}>
                Tasks ({filteredTasks.length})
              </h5>
            </div>
            <div style={{
              maxHeight: "500px",
              overflowY: "auto",
              overflowX: "auto"
            }}>
              <Table hover responsive style={{ 
                minWidth: 1000, 
                margin: 0,
                fontSize: '14px'
              }}>
                <thead style={{
                  background: '#f8f9fa',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10
                }}>
                  <tr>
                    <th style={{ 
                      padding: '16px 12px', 
                      fontWeight: '600', 
                      color: '#4a5568',
                      borderBottom: '2px solid #e2e8f0',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>#</th>
                    <th style={{ 
                      padding: '16px 12px', 
                      fontWeight: '600', 
                      color: '#4a5568',
                      borderBottom: '2px solid #e2e8f0',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Task Name</th>
                    <th style={{ 
                      padding: '16px 12px', 
                      fontWeight: '600', 
                      color: '#4a5568',
                      borderBottom: '2px solid #e2e8f0',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Project</th>
                    <th style={{ 
                      padding: '16px 12px', 
                      fontWeight: '600', 
                      color: '#4a5568',
                      borderBottom: '2px solid #e2e8f0',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Status</th>
                    <th style={{ 
                      padding: '16px 12px', 
                      fontWeight: '600', 
                      color: '#4a5568',
                      borderBottom: '2px solid #e2e8f0',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Priority</th>
                    <th style={{ 
                      padding: '16px 12px', 
                      fontWeight: '600', 
                      color: '#4a5568',
                      borderBottom: '2px solid #e2e8f0',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Due Date</th>
                    <th style={{ 
                      padding: '16px 12px', 
                      fontWeight: '600', 
                      color: '#4a5568',
                      borderBottom: '2px solid #e2e8f0',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>Files</th>
                    <th style={{ 
                      padding: '16px 12px', 
                      fontWeight: '600', 
                      color: '#4a5568',
                      borderBottom: '2px solid #e2e8f0',
                      fontSize: '13px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      textAlign: 'center'
                    }}>Actions</th>
                  </tr>
                </thead>
                  <tbody>
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ 
                          textAlign: 'center', 
                          padding: '48px 24px',
                          color: '#718096',
                          fontSize: '16px'
                        }}>
                          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                          <div style={{ fontWeight: '600', marginBottom: '8px' }}>No tasks found</div>
                          <div style={{ fontSize: '14px' }}>Try adjusting your filters or check back later</div>
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((task, idx) => {
                        const isOverdue = (task && task._doc && task._doc.isOverdue) || task.isOverdue;
                        return (
                          <tr key={task._id} style={{ 
                            backgroundColor: isOverdue ? '#fef2f2' : 'white',
                            borderLeft: isOverdue ? '4px solid #ef4444' : '4px solid transparent',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isOverdue) e.target.style.backgroundColor = '#f7fafc';
                          }}
                          onMouseLeave={(e) => {
                            if (!isOverdue) e.target.style.backgroundColor = 'white';
                          }}>
                            <td style={{ 
                              padding: '16px 12px', 
                              fontWeight: '600',
                              color: '#4a5568',
                              borderBottom: '1px solid #f1f5f9'
                            }}>{idx + 1}</td>
                            <td style={{ 
                              padding: '16px 12px',
                              fontWeight: '600',
                              color: '#2d3748',
                              borderBottom: '1px solid #f1f5f9'
                            }}>{task.name}</td>
                            <td style={{ 
                              padding: '16px 12px',
                              color: '#4a5568',
                              borderBottom: '1px solid #f1f5f9'
                            }}>{task.projectId.Name}</td>
                            <td style={{ 
                              padding: '16px 12px',
                              borderBottom: '1px solid #f1f5f9'
                            }}>
                              <Badge
                                bg={
                                  task.status === "Completed"
                                    ? "success"
                                    : task.status === "In Progress"
                                      ? "warning"
                                      : "primary"
                                }
                                style={{
                                  fontSize: '11px',
                                  fontWeight: '500'
                                }}
                              >
                                {task.status}
                              </Badge>
                            </td>
                            <td style={{ 
                              padding: '16px 12px',
                              borderBottom: '1px solid #f1f5f9'
                            }}>
                              <Badge
                                bg={
                                  task.priority === "High"
                                    ? "danger"
                                    : task.priority === "Medium"
                                      ? "warning"
                                      : "info"
                                }
                                style={{
                                  fontSize: '11px',
                                  fontWeight: '500'
                                }}
                              >
                                {task.priority}
                              </Badge>
                            </td>
                            <td style={{ 
                              whiteSpace: "nowrap", 
                              color: isOverdue ? '#e53e3e' : '#4a5568',
                              padding: '16px 12px',
                              borderBottom: '1px solid #f1f5f9',
                              fontWeight: '500'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>{task.dueDate}</span>
                                {isOverdue && (
                                  <Badge bg="danger" style={{ marginLeft: '8px', fontSize: '10px' }}>
                                    Overdue
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td style={{ 
                              padding: '16px 12px',
                              borderBottom: '1px solid #f1f5f9'
                            }}>
                              {task.files && task.files.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                  {task.files.map((file, fidx) => (
                                    <div
                                      key={fidx}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        background: "#4f46e5",
                                        borderRadius: "16px",
                                        padding: "6px 12px",
                                        boxShadow: "0 2px 4px rgba(79, 70, 229, 0.3)"
                                      }}
                                    >
                                      <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          color: "white",
                                          textDecoration: "none",
                                          fontSize: "12px",
                                          fontWeight: "500",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "4px"
                                        }}
                                      >
                                        <span>📎</span>
                                        <span>{file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}</span>
                                      </a>
                                      {task.status === "In Progress" && (
                                        <Button
                                          variant="link"
                                          size="sm"
                                          title="Delete file"
                                          onClick={async () => {
                                            if (!window.confirm(`Delete file "${file.name}"?`)) return;
                                            try {
                                              const updated = { ...task, files: (task.files || []).filter((_, i) => i !== fidx) };
                                              setTasks(prev => prev.map(t => t._id === task._id ? updated : t));
                                              await UpdateTask({ ...updated, projectId: task.projectId });
                                              const fetched = await getEmployeeTasks(employeeId);
                                              setTasks(Array.isArray(fetched) ? fetched : []);
                                            } catch (e) {
                                              console.error('Delete file failed:', e);
                                            }
                                          }}
                                          style={{ 
                                            color: 'white',
                                            padding: '0 4px',
                                            minWidth: 'auto',
                                            marginLeft: '4px'
                                          }}
                                        >
                                          ×
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span style={{ color: '#a0aec0', fontSize: '14px', fontStyle: 'italic' }}>
                                  No files
                                </span>
                              )}
                            </td>
                            <td style={{ 
                              textAlign: "center", 
                              padding: '16px 12px',
                              borderBottom: '1px solid #f1f5f9'
                            }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <Button
                                  size="sm"
                                  onClick={() => handleMarkCompleted(task._id)}
                                  title={task.status === "Completed" ? "Mark as In Progress" : "Mark as Completed"}
                                  disabled={task.status == "To Do" || task.projectId.Status !== "Active"}
                                  style={{
                                    background: task.status === "Completed" 
                                      ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                                      : 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '8px 12px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    transition: 'all 0.2s ease',
                                    color: 'white'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                                  }}
                                >
                                  {task.status === "Completed" ? <ArrowCounterclockwise /> : <Check2Circle />}
                                </Button>
                                {task.status != "Completed" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleFileButtonClick(task._id)}
                                    title="Add File"
                                    disabled={task.status != "In Progress" || task.projectId.Status !== "Active"}
                                    style={{
                                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                      border: 'none',
                                      borderRadius: '8px',
                                      padding: '8px 12px',
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                      transition: 'all 0.2s ease',
                                      color: 'white'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.transform = 'translateY(-2px)';
                                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.transform = 'translateY(0)';
                                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                                    }}
                                  >
                                    <Paperclip />
                                  </Button>
                                )}

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
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </Table>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}