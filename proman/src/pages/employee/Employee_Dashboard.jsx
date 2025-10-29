import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Row, Col, Card, Badge, ProgressBar, ListGroup, Container, Button } from "react-bootstrap";
import { useUser } from "../../contexts/UserContext";

export default function Employee_Dashboard() {
  const { user } = useUser();
  console.log("User object:", user);
  const employeeId = user?._id;
  const employeeName = user?.name || user?.Name || user?.Email || "Employee";

  // Get tasks and projects directly from user object
  const myTasks = user?.tasks || [];
  const myProjects = user?.project || [];
  
  console.log("My Tasks:", myTasks);
  console.log("My Projects:", myProjects);

  // Calculate metrics
  const completedTasks = myTasks.filter(task => task.status === "Completed").length;
  const inProgressTasks = myTasks.filter(task => task.status === "In Progress").length;
  const pendingTasks = myTasks.filter(task => task.status === "Pending" || task.status === "Not Started").length;
  
  console.log("Task counts - Total:", myTasks.length, "Completed:", completedTasks, "In Progress:", inProgressTasks, "Pending:", pendingTasks);
  
  const activeProjects = myProjects.filter(project => project.Status === "Active").length;
  const completedProjects = myProjects.filter(project => project.Status === "Completed").length;

  // Get overdue tasks (only tasks that are past due, not including today)
  const overdueTasks = myTasks.filter(task => {
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
          <div style={{
            background: '#4f46e5',
            color: 'white',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
              👋 Welcome, {employeeName}
            </h2>
            <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
              Your dashboard overview and project updates
            </p>
          </div>
          
          {/* User Profile Section */}
          <Container fluid className="px-4" style={{ marginBottom: '24px' }}>
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
                fontWeight: '600',
                paddingBottom: '12px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Profile Information
              </h4>
              <Row>
                <Col md={6}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <strong style={{ color: '#374151', minWidth: '100px' }}>Name:</strong>
                      <span style={{ color: '#6b7280' }}>{user?.Name || user?.name || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <strong style={{ color: '#374151', minWidth: '100px' }}>Email:</strong>
                      <span style={{ color: '#6b7280' }}>{user?.Email || user?.email || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <strong style={{ color: '#374151', minWidth: '100px' }}>Role:</strong>
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
          </Container>
          
          {/* Task Performance Metrics - Full Width */}
          <Container fluid className="px-4" style={{ marginBottom: '24px' }}>
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
                  📊 My Task Performance
                </h4>
              </div>
            
              {/* Task Metrics Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px', 
                marginBottom: '24px' 
              }}>
                {/* Total Tasks */}
                <div style={{ 
                  textAlign: 'center', 
                  padding: '20px 16px', 
                  background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', 
                  borderRadius: '12px',
                  border: '1px solid rgba(252, 182, 159, 0.3)',
                  boxShadow: '0 4px 12px rgba(252, 182, 159, 0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
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
                    {myTasks.length}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#92400e', 
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Total Tasks
                  </div>
                </div>

                {/* Completed Tasks */}
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
                    {completedTasks}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#047857', 
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Completed Tasks
                  </div>
                </div>

                {/* In Progress Tasks */}
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
                    {inProgressTasks}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#e5e7eb', 
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    In Progress
                  </div>
                </div>

                {/* Project Count */}
                <div style={{ 
                  textAlign: 'center', 
                  padding: '20px 16px', 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
                  borderRadius: '12px',
                  border: '1px solid rgba(79, 172, 254, 0.3)',
                  boxShadow: '0 4px 12px rgba(79, 172, 254, 0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 172, 254, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 172, 254, 0.2)';
                }}>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: '800', 
                    color: '#ffffff',
                    marginBottom: '4px'
                  }}>
                    {myProjects.length}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#e0f7fa', 
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    My Projects
                  </div>
                </div>
              </div>

              {/* Task Progress */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Task Completion Rate</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    {myTasks.length > 0 ? Math.round((completedTasks / myTasks.length) * 100) : 0}%
                  </span>
                </div>
                <ProgressBar 
                  now={myTasks.length > 0 ? (completedTasks / myTasks.length) * 100 : 0} 
                  variant="success"   
                  style={{ height: '6px', borderRadius: '3px' }}
                />
              </div>

              {/* Overdue Tasks - Full Width */}
              <div style={{
                background: overdueTasks.length > 0 
                  ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' 
                  : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                padding: '20px',
                borderRadius: '12px',
                border: overdueTasks.length > 0 
                  ? '1px solid #fecaca' 
                  : '1px solid #bbf7d0',
                marginBottom: '16px',
                boxShadow: overdueTasks.length > 0 
                  ? '0 4px 12px rgba(239, 68, 68, 0.1)' 
                  : '0 4px 12px rgba(34, 197, 94, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      background: overdueTasks.length > 0 ? '#ef4444' : '#22c55e', 
                      color: 'white', 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '10px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '20px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                    }}>
                      {overdueTasks.length > 0 ? '⚠️' : '✅'}
                    </div>
                    <div>
                      <h5 style={{ 
                        margin: 0, 
                        color: '#374151', 
                        fontSize: '18px', 
                        fontWeight: '600'
                      }}>
                        Overdue Tasks Status
                      </h5>
                      <div style={{ 
                        fontSize: '14px', 
                        color: overdueTasks.length > 0 ? '#7f1d1d' : '#065f46',
                        fontWeight: '500',
                        marginTop: '2px'
                      }}>
                        {overdueTasks.length > 0 ? 'Immediate attention required' : 'All tasks are on schedule'}
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    background: overdueTasks.length > 0 ? '#ef4444' : '#22c55e', 
                    color: 'white', 
                    padding: '10px 20px', 
                    borderRadius: '25px', 
                    fontSize: '18px', 
                    fontWeight: '700',
                    minWidth: '50px',
                    textAlign: 'center',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.2)'
                  }}>
                    {overdueTasks.length}
                  </div>
                </div>

                {/* Overdue Tasks List */}
                {overdueTasks.length > 0 ? (
                  <div style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    paddingRight: '8px'
                  }}>
                    {overdueTasks.map((task, index) => (
                      <div key={task._id || index} style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        marginBottom: '8px',
                        borderLeft: '4px solid #ef4444'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'flex-start'
                        }}>
                          <div style={{ flex: 1 }}>
                            <h6 style={{ 
                              margin: '0 0 4px 0', 
                              color: '#7f1d1d', 
                              fontSize: '15px', 
                              fontWeight: '600'
                            }}>
                              {task.name || 'Unnamed Task'}
                            </h6>
                            <div style={{ 
                              fontSize: '13px', 
                              color: '#991b1b',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                              <Badge bg="danger" style={{ fontSize: '10px' }}>
                                {(() => {
                                  const today = new Date();
                                  today.setHours(0, 0, 0, 0);
                                  const dueDate = new Date(task.dueDate);
                                  dueDate.setHours(0, 0, 0, 0);
                                  const diffDays = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
                                  return diffDays;
                                })()} days overdue
                              </Badge>
                            </div>
                          </div>
                          <Badge bg="warning" style={{ fontSize: '11px', marginLeft: '12px' }}>
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    color: '#065f46'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎉</div>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Great job!</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>No overdue tasks. Keep up the excellent work!</p>
                  </div>
                )}
              </div>
            </div>
          </Container>

          {/* My Tasks and Upcoming Deadlines */}
          <Container fluid className="px-4">
            <Row>
              <Col md={6} style={{ padding: '0 12px', marginBottom: '16px' }}>
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
                    📋 My Recent Tasks
                  </h4>
                  <div style={{ 
                    maxHeight: '300px', 
                    overflowY: 'auto',
                    paddingRight: '8px'
                  }}>
                    {myTasks.length > 0 ? (
                      myTasks.slice(0, 5).map((task, index) => (
                        <div key={task._id || index} style={{
                          background: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '12px',
                          transition: 'all 0.2s ease'
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
                              fontSize: '14px', 
                              fontWeight: '600'
                            }}>
                              {task.name || 'Unnamed Task'}
                            </h6>
                            <Badge 
                              bg={
                                task.status === 'Completed' ? 'success' :
                                task.status === 'In Progress' ? 'warning' :
                                'secondary'
                              }
                              style={{ fontSize: '10px' }}
                            >
                              {task.status}
                            </Badge>
                          </div>
                          {task.dueDate && (
                            <div style={{ 
                              fontSize: '12px', 
                              color: '#6b7280',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#9ca3af'
                      }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                        <p style={{ margin: 0, fontSize: '16px' }}>No tasks assigned</p>
                      </div>
                    )}
                  </div>
                </div>
              </Col>

              <Col md={6} style={{ padding: '0 12px', marginBottom: '16px' }}>
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
                    ⏰ Upcoming Deadlines
                  </h4>
                  <div style={{ 
                    maxHeight: '300px', 
                    overflowY: 'auto',
                    paddingRight: '8px'
                  }}>
                    {upcomingTasks.length > 0 ? (
                      upcomingTasks.map((task, index) => (
                        <div key={task._id || index} style={{
                          background: '#fef3c7',
                          border: '1px solid #fcd34d',
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '12px',
                          borderLeft: '4px solid #f59e0b'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start',
                            marginBottom: '4px'
                          }}>
                            <h6 style={{ 
                              margin: 0, 
                              color: '#92400e', 
                              fontSize: '14px', 
                              fontWeight: '600'
                            }}>
                              {task.name || 'Unnamed Task'}
                            </h6>
                            <Badge bg="warning" style={{ fontSize: '10px' }}>
                              Due Soon
                            </Badge>
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#92400e',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            📅 {new Date(task.dueDate).toLocaleDateString()}
<span style={{ 
  marginLeft: '8px',
  fontSize: '11px',
  fontWeight: '600'
}}>
  {(() => {
    const diffDays = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return diffDays <= 0 ? "Today" : `${diffDays} days`;
  })()}
</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: '#10b981'
                      }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                        <p style={{ margin: 0, fontSize: '16px', color: '#059669' }}>No upcoming deadlines</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#065f46' }}>You're all caught up!</p>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </div>
  );
}
