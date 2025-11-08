import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Row, Col, Card, Badge, Container, ProgressBar, Button } from "react-bootstrap";
import { useUser } from "../../contexts/UserContext";
import { getProjects, subscribe } from "../../Data/Projects";
import UpdateProfile from "../../components/UpdateProfile";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const { user } = useUser();
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
        const fetchedProjects = await getProjects(id);
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
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
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
                  Manager Dashboard
                </h2>
                <p style={{ 
                  margin: 0, 
                  fontSize: '1rem', 
                  opacity: 0.9
                }}>
                  Overview of projects, performance, and budget
                </p>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{ fontSize: '2rem', textAlign: 'center' }}>📊</div>
              </div>
            </div>
          </div>

          {/* User Profile Section */}
          <Row style={{ margin: '0 -8px', marginBottom: '24px' }}>
            <Col lg={12}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '20px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <h4 style={{ 
                    margin: 0, 
                    color: '#374151', 
                    fontSize: '18px', 
                    fontWeight: '600'
                  }}>
                    Profile Information
                  </h4>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowUpdateProfile(true)}
                    style={{
                      borderRadius: '8px',
                      padding: '6px 16px',
                      fontWeight: '500'
                    }}
                  >
                    ✏️ Update Profile
                  </Button>
                </div>
                <Row>
                  <Col md={6}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <strong style={{ color: '#374151', minWidth: '120px' }}>Employee ID:</strong>
                        <span style={{ color: '#6b7280' }}>{user?.EmpId || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <strong style={{ color: '#374151', minWidth: '120px' }}>Name:</strong>
                        <span style={{ color: '#6b7280' }}>{user?.Name || user?.name || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <strong style={{ color: '#374151', minWidth: '120px' }}>Email:</strong>
                        <span style={{ color: '#6b7280' }}>{user?.Email || user?.email || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <strong style={{ color: '#374151', minWidth: '120px' }}>Role:</strong>
                        <span style={{ 
                          background: '#f3f4f6', 
                          color: '#374151', 
                          padding: '4px 8px', 
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}>
                          {user?.isManager ? "Manager" : "Employee"} - {user?.role || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <strong style={{ color: '#374151', minWidth: '100px' }}>Department:</strong>
                        <span style={{ color: '#6b7280' }}>{user?.department || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <strong style={{ color: '#374151', minWidth: '100px' }}>Phone:</strong>
                        <span style={{ color: '#6b7280' }}>{user?.phone || 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <strong style={{ color: '#374151', minWidth: '100px' }}>Joined:</strong>
                        <span style={{ color: '#6b7280' }}>
                          {user?.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </Col>
                </Row>
                {user?.address && (
                  <div style={{ 
                    marginTop: '16px', 
                    paddingTop: '16px', 
                    borderTop: '1px solid #e5e7eb' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <strong style={{ color: '#374151', minWidth: '100px' }}>Address:</strong>
                      <span style={{ color: '#6b7280' }}>{user.address}</span>
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* Performance Metrics Section - Full Width */}
          <Row style={{ margin: '0 -8px', marginBottom: '24px' }}>
            <Col lg={12}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  color: 'white', 
                  padding: '16px 20px', 
                  borderRadius: '12px', 
                  marginBottom: '24px',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                }}>
                  <h4 style={{ 
                    margin: 0, 
                    fontSize: '18px', 
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    📈 Performance Metrics
                  </h4>
                </div>
              
                {/* Key Metrics Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '20px', 
                  marginBottom: '24px' 
                }}>
                  {/* Total Projects */}
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '20px 16px', 
                    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', 
                    borderRadius: '12px',
                    border: '1px solid rgba(252, 182, 159, 0.3)',
                    boxShadow: '0 4px 12px rgba(252, 182, 159, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(252, 182, 159, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(252, 182, 159, 0.2)';
                  }}>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: '800', 
                      color: '#d97706',
                      marginBottom: '4px'
                    }}>
                      {projects.length}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#92400e', 
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Total Projects
                    </div>
                  </div>

                  {/* Active Projects */}
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '20px 16px', 
                    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', 
                    borderRadius: '12px',
                    border: '1px solid rgba(168, 237, 234, 0.3)',
                    boxShadow: '0 4px 12px rgba(168, 237, 234, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(168, 237, 234, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(168, 237, 234, 0.2)';
                  }}>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: '800', 
                      color: '#059669',
                      marginBottom: '4px'
                    }}>
                      {projects.filter(p => p.Status === "Active").length}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#047857', 
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Active Projects
                    </div>
                  </div>

                  {/* Completed Projects */}
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '20px 16px', 
                    background: 'linear-gradient(135deg, #cbb4d4 0%, #20002c 100%)', 
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 180, 212, 0.3)',
                    boxShadow: '0 4px 12px rgba(203, 180, 212, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(203, 180, 212, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(203, 180, 212, 0.2)';
                  }}>
                    <div style={{ 
                      fontSize: '24px', 
                      fontWeight: '800', 
                      color: '#ffffff',
                      marginBottom: '4px'
                    }}>
                      {projects.filter(p => p.Status === "Completed").length}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#e5e7eb', 
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Completed
                    </div>
                  </div>
                </div>

                {/* Task Statistics */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Tasks</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                      {completedTasks}/{totalTask}
                    </span>
                  </div>
                  <ProgressBar 
                    now={totalTask > 0 ? (100 * completedTasks) / totalTask : 0} 
                    variant="success"   
                    style={{ height: '6px', borderRadius: '3px' }}
                  />
                </div>

                <Row>
                  <Col md={6}>
                    {/* Overdue Projects */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      background: projects.filter(p => p.EndDate && startOfDay(p.EndDate) < today && p.Status !== "Completed").length > 0 
                        ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' 
                        : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                      padding: '14px 18px',
                      borderRadius: '10px',
                      border: projects.filter(p => p.EndDate && startOfDay(p.EndDate) < today && p.Status !== "Completed").length > 0 
                        ? '1px solid #fecaca' 
                        : '1px solid #bbf7d0',
                      marginBottom: '16px',
                      boxShadow: projects.filter(p => p.EndDate && startOfDay(p.EndDate) < today && p.Status !== "Completed").length > 0 
                        ? '0 2px 8px rgba(239, 68, 68, 0.1)' 
                        : '0 2px 8px rgba(34, 197, 94, 0.1)',
                      transition: 'all 0.2s ease'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          background: projects.filter(p => p.EndDate && startOfDay(p.EndDate) < today && p.Status !== "Completed").length > 0 ? '#ef4444' : '#22c55e', 
                          color: 'white', 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '8px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '18px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          {projects.filter(p => p.EndDate && startOfDay(p.EndDate) < today && p.Status !== "Completed").length > 0 ? '⚠️' : '✅'}
                        </div>
                        <div>
                          <div style={{ 
                            fontSize: '15px', 
                            color: '#374151', 
                            fontWeight: '600',
                            marginBottom: '2px'
                          }}>
                            Overdue Projects
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: projects.filter(p => p.EndDate && startOfDay(p.EndDate) < today && p.Status !== "Completed").length > 0 ? '#7f1d1d' : '#065f46',
                            fontWeight: '500'
                          }}>
                            {projects.filter(p => p.EndDate && startOfDay(p.EndDate) < today && p.Status !== "Completed").length > 0 
                              ? 'Action Required' 
                              : 'All on track'}
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        background: projects.filter(p => p.EndDate && startOfDay(p.EndDate) < today && p.Status !== "Completed").length > 0 ? '#ef4444' : '#22c55e', 
                        color: 'white', 
                        padding: '8px 16px', 
                        borderRadius: '20px', 
                        fontSize: '16px', 
                        fontWeight: '700',
                        minWidth: '45px',
                        textAlign: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                      }}>
                        {projects.filter(p => p.EndDate && startOfDay(p.EndDate) < today && p.Status !== "Completed").length}
                      </div>
                    </div>
                  </Col>

                  <Col md={6}>
                    {/* Success Rate */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      background: '#f8fafc',
                      padding: '14px 18px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      marginBottom: '16px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s ease'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          background: '#22c55e', 
                          color: 'white', 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '8px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: '18px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          📊
                        </div>
                        <div>
                          <div style={{ 
                            fontSize: '15px', 
                            color: '#374151', 
                            fontWeight: '600',
                            marginBottom: '2px'
                          }}>
                            Success Rate
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#065f46',
                            fontWeight: '500'
                          }}>
                            Project Completion
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        background: '#22c55e', 
                        color: 'white', 
                        padding: '8px 16px', 
                        borderRadius: '20px', 
                        fontSize: '16px', 
                        fontWeight: '700',
                        minWidth: '45px',
                        textAlign: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                      }}>
                        {projects.length > 0 ? Math.round((projects.filter(p => p.Status === "Completed").length / projects.length) * 100) : 0}%
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          {/* Projects and Missed Tasks Side by Side */}
          <Row style={{ margin: '0 -8px' }}>
            <Col lg={6} style={{ padding: '0 8px', marginBottom: '16px' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  height: '100%'
                }}>
                  <h4 style={{ 
                    margin: '0 0 20px 0', 
                    color: '#374151', 
                    fontSize: '18px', 
                    fontWeight: '600',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    📋 Projects
                  </h4>
                  <div style={{ 
                    maxHeight: '300px', 
                    overflowY: 'auto',
                    paddingRight: '8px'
                  }}>
                    {projects.length > 0 ? (
                      projects.map(element => (
                        <div key={element._id} style={{
                          background: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          borderRadius: '8px',
                          padding: '16px',
                          marginBottom: '12px',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
 navigate(`/manager/projects/${element._id}`)                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start',
                            marginBottom: '8px'
                          }}>
                            <h6 style={{ 
                              margin: 0, 
                              color: '#1f2937', 
                              fontSize: '16px', 
                              fontWeight: '600',
                              textTransform: 'capitalize'
                            }}>
                              {element.Name}
                            </h6>
                            <Badge 
                              bg={
                                element.Status === 'Active' ? 'success' :
                                element.Status === 'Completed' ? 'primary' :
                                element.Status === 'Pending' ? 'warning' : 'secondary'
                              }
                              style={{ fontSize: '11px' }}
                            >
                              {element.Status}
                            </Badge>
                          </div>
                          
                          {element.description && (
                            <p style={{ 
                              margin: '0 0 8px 0', 
                              color: '#6b7280', 
                              fontSize: '14px',
                              lineHeight: '1.4'
                            }}>
                              {element.description.length > 80 
                                ? `${element.description.substring(0, 80)}...` 
                                : element.description}
                            </p>
                          )}
                          
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                            {element.clientName && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ 
                                  fontSize: '12px', 
                                  color: '#9ca3af',
                                  fontWeight: '500'
                                }}>
                                  Client:
                                </span>
                                <span style={{ 
                                  background: '#dbeafe', 
                                  color: '#1e40af', 
                                  padding: '2px 6px', 
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: '500'
                                }}>
                                  {element.clientName}
                                </span>
                              </div>
                            )}
                            
                            {element.EndDate && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ 
                                  fontSize: '12px', 
                                  color: '#9ca3af',
                                  fontWeight: '500'
                                }}>
                                  Deadline:
                                </span>
                                <span style={{ 
                                  background: (() => {
                                    const deadline = startOfDay(element.EndDate);
                                    const daysDiff = Math.floor((deadline - today) / MS_PER_DAY);

                                    if (daysDiff < 0) return '#fee2e2'; // Overdue - light red
                                    if (daysDiff <= 3) return '#fef3c7'; // Due soon - light yellow
                                    return '#d1fae5'; // Safe - light green
                                  })(),
                                  color: (() => {
                                    const deadline = startOfDay(element.EndDate);
                                    const daysDiff = Math.floor((deadline - today) / MS_PER_DAY);

                                    if (daysDiff < 0) return '#dc2626'; // Overdue - red
                                    if (daysDiff <= 3) return '#d97706'; // Due soon - orange
                                    return '#059669'; // Safe - green
                                  })(),
                                  padding: '2px 6px', 
                                  borderRadius: '4px',
                                  fontSize: '12px',
                                  fontWeight: '500'
                                }}>
                                  {new Date(element.EndDate).toLocaleDateString()}
                                  {(() => {
                                    const deadline = startOfDay(element.EndDate);
                                    const daysDiff = Math.floor((deadline - today) / MS_PER_DAY);

                                    if (daysDiff < 0) return ` (Overdue)`;
                                    if (daysDiff === 0) return ` (Today)`;
                                    if (daysDiff === 1) return ` (Tomorrow)`;
                                    if (daysDiff <= 7) return ` (${daysDiff} days)`;
                                    return '';
                                  })()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#9ca3af'
                      }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                        <p style={{ margin: 0, fontSize: '16px' }}>No active projects found</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>Create a new project to get started</p>
                      </div>
                    )}
                  </div>
                </div>
              </Col>

            <Col lg={6} style={{ padding: '0 8px', marginBottom: '16px' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  height: '100%'
                }}>
                  <div style={{
                    background: '#dc2626',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    ⚠️ Missed Deadline Tasks
                    <Badge bg="light" text="dark" style={{ fontSize: '10px' }}>
                      {missedDeadlineTasks.length}
                    </Badge>
                  </div>
                  
                  <div style={{ 
                    maxHeight: '280px', 
                    overflowY: 'auto',
                    paddingRight: '8px'
                  }}>
                    {missedDeadlineTasks.length > 0 ? (
                      missedDeadlineTasks.map((task, index) => (
                        <div key={index} style={{
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '12px',
                          borderLeft: '4px solid #ef4444'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start',
                            marginBottom: '8px'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: 'linear-gradient(90deg, #7f1d1d, #991b1b)',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '13px',
                              fontWeight: '600',
                              boxShadow: '0 2px 4px rgba(127, 29, 29, 0.3)'
                            }}>
                              <span>📋</span>
                              {task.name || task.taskName || 'Unnamed Task'}
                            </div>
                            <Badge bg="danger" style={{ fontSize: '10px' }}>
                              Overdue
                            </Badge>
                          </div>
                          
                          <div style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12px', 
                            color: '#991b1b', 
                            marginBottom: '8px',
                            background: 'rgba(153, 27, 27, 0.1)',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid rgba(153, 27, 27, 0.2)'
                          }}>
                            <span style={{ fontSize: '14px' }}>🏢</span>
                            <strong>Project:</strong> 
                            <span style={{
                              background: '#991b1b',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>
                              {task.projectName}
                            </span>
                          </div>
                          
                          {task.assignedTo && (
                            <div style={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              fontSize: '12px', 
                              color: '#991b1b', 
                              marginBottom: '8px',
                              background: 'rgba(153, 27, 27, 0.1)',
                              padding: '8px 12px',
                              borderRadius: '10px',
                              border: '1px solid rgba(153, 27, 27, 0.2)'
                            }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)'
                              }}>
                                {(task.assignedTo.Name || task.assignedTo.name || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ 
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  marginBottom: '4px'
                                }}>
                                  <div style={{ 
                                    fontWeight: '600', 
                                    color: '#7f1d1d',
                                    fontSize: '13px'
                                  }}>
                                    {task.assignedTo.Name || task.assignedTo.name || 'Unknown'}
                                  </div>
                                  {task.assignedTo.EmpId && (
                                    <div style={{
                                      background: '#dc2626',
                                      color: 'white',
                                      padding: '2px 6px',
                                      borderRadius: '8px',
                                      fontSize: '9px',
                                      fontWeight: '600'
                                    }}>
                                      ID: {task.assignedTo.EmpId}
                                    </div>
                                  )}
                                </div>
                                <div style={{
                                  background: '#fca5a5',
                                  color: '#7f1d1d',
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  fontSize: '10px',
                                  fontWeight: '600',
                                  display: 'inline-block'
                                }}>
                                  {task.assignedTo.role || 'No Role'}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {task.dueDate && (
                            <div style={{ fontSize: '12px', color: '#991b1b' }}>
                              <strong>Deadline:</strong> {new Date(task.dueDate).toLocaleDateString()}
                              <span style={{ 
                                marginLeft: '8px',
                                background: '#dc2626',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '10px'
                              }}>
                                {(() => {
                                  const overdueDays = Math.floor((today - startOfDay(task.dueDate)) / MS_PER_DAY);
                                  return Math.max(0, overdueDays);
                                })()} days overdue
                              </span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#10b981'
                      }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                        <p style={{ margin: 0, fontSize: '16px', color: '#059669' }}>No missed deadlines</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#065f46' }}>All tasks are on track!</p>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
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
