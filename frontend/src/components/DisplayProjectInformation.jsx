import React, { useEffect, useState } from "react";
import { ProgressBar, ListGroup, Badge, Form } from "react-bootstrap";
import { getEmployees } from "../Data/Employee";

export default function DisplayProjectInformation({ project }) {
  const [employees, setEmployees] = useState([]);
  const [localProject, setLocalProject] = useState(project);

  // Update local project state when prop changes
  useEffect(() => {
    setLocalProject(project);
  }, [project]);
  
  if (!localProject || Object.keys(localProject).length === 0) return <div>No project selected.</div>;

  const tasks = Array.isArray(localProject.tasks) ? localProject.tasks : [];
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const progress = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

const formatMoney = (value) => {
  return new Intl.NumberFormat("en-IN").format(value);
};

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
const today = startOfDay(new Date());
  const resolveMember = (member) => {
    if (!member) return { id: null, name: null, role: null };
    
    if (typeof member === 'object') {
      return { id: member._id || member.id || null, name: member.Name || member.name || '', role: member.role || '' , EmpId: member.EmpId || member.empId || ''};
    }
    return { id: null, name: String(member), role: '' };
  };

  const teamArray = Array.isArray(localProject.team) ? localProject.team : [];
  console.log(teamArray);
  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    try {
      const d = new Date(dateStr);
      if (!isNaN(d)) return d.toLocaleDateString();
    } catch (e) {}
    if (typeof dateStr === 'string' && dateStr.indexOf('T') !== -1) return dateStr.split('T')[0];
    return String(dateStr);
  };

  return (
    <div className="container py-4">
      {(startOfDay(project.EndDate) && startOfDay(project.EndDate) < today && project.Status !== "Completed") && (
      <div className="mb-4 pb-2"
        style={{
          backgroundColor: '#fee2e2',
          alignItems: 'center',
          display: 'flex',
          padding: '10px',
          borderRadius: '8px',
          color: '#b91c1c',
          fontWeight: '600',
          fontSize: '16px'
        }}
      >
        This project has reached its due date.
      </div>)}
      {/* Project Title with Status Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '3px solid #4f46e5',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1f2937',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '32px' }}>📁</span>
          {project.Name}
        </h2>
        
        {/* Animated Status Indicator */}
        <div style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {/* Pulsing dot for active status */}
          {project.Status === 'Active' && (
            <span style={{
              position: 'relative',
              width: '12px',
              height: '12px',
              display: 'inline-block'
            }}>
              <span style={{
                position: 'absolute',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#10b981',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }} />
              <span style={{
                position: 'absolute',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#10b981',
                opacity: 0.75
              }} />
            </span>
          )}
          
          {/* Status Badge */}
          <div style={{
            padding: '10px 24px',
            borderRadius: '50px',
            fontWeight: '700',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: project.Status === 'Active' 
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : project.Status === 'Completed'
              ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
              : project.Status === 'On Hold'
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            color: 'white',
            boxShadow: project.Status === 'Active'
              ? '0 4px 14px rgba(16, 185, 129, 0.4)'
              : project.Status === 'Completed'
              ? '0 4px 14px rgba(59, 130, 246, 0.4)'
              : project.Status === 'On Hold'
              ? '0 4px 14px rgba(245, 158, 11, 0.4)'
              : '0 4px 14px rgba(107, 114, 128, 0.4)',
            transition: 'all 0.3s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = project.Status === 'Active'
              ? '0 6px 20px rgba(16, 185, 129, 0.5)'
              : project.Status === 'Completed'
              ? '0 6px 20px rgba(59, 130, 246, 0.5)'
              : project.Status === 'On Hold'
              ? '0 6px 20px rgba(245, 158, 11, 0.5)'
              : '0 6px 20px rgba(107, 114, 128, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = project.Status === 'Active'
              ? '0 4px 14px rgba(16, 185, 129, 0.4)'
              : project.Status === 'Completed'
              ? '0 4px 14px rgba(59, 130, 246, 0.4)'
              : project.Status === 'On Hold'
              ? '0 4px 14px rgba(245, 158, 11, 0.4)'
              : '0 4px 14px rgba(107, 114, 128, 0.4)';
          }}>
            <span style={{ fontSize: '16px' }}>
              {project.Status === 'Active' ? '✓' : 
               project.Status === 'Completed' ? '✓✓' : 
               project.Status === 'On Hold' ? '⏸' : '•'}
            </span>
            {project.Status || 'Unknown'}
          </div>
        </div>
      </div>
      
      {/* Add CSS animation for pulse effect */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
            transform: scale(1.5);
          }
        }
      `}</style>
      
      {/* Manager and Client Info Cards - Alternative Design */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {/* Project Manager Card - Badge Style */}
        <div style={{
          flex: '1',
          minWidth: '250px',
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: '2px solid #e5e7eb',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#8b5cf6';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        }}>
          {/* Decorative Corner Accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, transparent 100%)',
            borderRadius: '0 12px 0 100%'
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
            {/* Avatar Circle */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
              flexShrink: 0
            }}>
              👤
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#8b5cf6',
                marginBottom: '4px'
              }}>
                Project Budget
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1f2937',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {formatMoney(project.budget)} ₹
              </div>
            </div>
          </div>
        </div>

        {/* Client Card - Badge Style */}
        <div style={{
          flex: '1',
          minWidth: '250px',
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: '2px solid #e5e7eb',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#10b981';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        }}>
          {/* Decorative Corner Accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%)',
            borderRadius: '0 12px 0 100%'
          }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
            {/* Avatar Circle */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              flexShrink: 0
            }}>
              🏢
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#10b981',
                marginBottom: '4px'
              }}>
                Client
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1f2937',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {project.client || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Project Dates Section with prominent styling */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginTop: '20px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          flex: '1',
          minWidth: '200px',
          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
          borderRadius: '12px',
          padding: '16px 20px',
          color: 'white',
          boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)',
          transition: 'all 0.3s ease',
          cursor: 'default'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(6, 182, 212, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(6, 182, 212, 0.4)';
        }}>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px',
            marginBottom: '8px',
            opacity: 0.95
          }}>
            📅 Start Date
          </div>
          <div style={{ 
            fontSize: '22px', 
            fontWeight: '700',
            letterSpacing: '0.3px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {formatDate(project.StartDate)}
          </div>
        </div>

        <div style={{
          flex: '1',
          minWidth: '200px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
          borderRadius: '12px',
          padding: '16px 20px',
          color: 'white',
          boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
          transition: 'all 0.3s ease',
          cursor: 'default'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)';
        }}>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px',
            marginBottom: '8px',
            opacity: 0.95
          }}>
            🏁 End Date
          </div>
          <div style={{ 
            fontSize: '22px', 
            fontWeight: '700',
            letterSpacing: '0.3px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {formatDate(project.EndDate)}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div style={{
        marginBottom: '24px'
      }}>
        <h4 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>📝</span> Description
        </h4>
        <Form.Control 
          as="textarea" 
          value={project.description || ""} 
          readOnly 
          rows={3} 
          style={{
            borderRadius: '8px',
            border: '2px solid #e5e7eb',
            padding: '12px',
            fontSize: '14px',
            backgroundColor: '#f9fafb',
            color: '#374151',
            resize: 'none'
          }}
        />
      </div>

      {/* Progress Section */}
      <div style={{
        marginBottom: '24px'
      }}>
        <h4 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>📊</span> Progress
        </h4>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280' }}>
              Completed Tasks
            </span>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#4f46e5' }}>
              {completedTasks} / {tasks.length}
            </span>
          </div>
          <ProgressBar 
            now={progress} 
            label={`${progress}%`}
            style={{
              height: '24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600'
            }}
            variant={progress === 100 ? 'success' : progress > 50 ? 'info' : 'warning'}
          />
        </div>
      </div>

      {/* Team Members Section */}
      <div>
        <h4 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>👥</span> Team Members
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          {teamArray.length > 0 ? (
            teamArray.map((member) => {
              const m = resolveMember(member);
              return (
                <div 
                  key={m._id || m.id || JSON.stringify(member)}
                  style={{
                    background: 'white',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#4f46e5';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '14px'
                    }}>
                      {(m.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1f2937',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {m.name || "(Unnamed)"}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#9ca3af',
                        fontWeight: '500'
                      }}>
                        ID: {m.EmpId || 'N/A'}
                      </div>
                    </div>
                  </div>
                  {m.role && (
                    <Badge 
                      bg="primary" 
                      pill 
                      style={{
                        fontSize: '10px',
                        padding: '4px 10px',
                        fontWeight: '600',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                        border: 'none'
                      }}
                    >
                      {m.role}
                    </Badge>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '32px',
              background: '#f9fafb',
              borderRadius: '12px',
              border: '2px dashed #d1d5db',
              color: '#9ca3af',
              fontSize: '14px'
            }}>
              No team members assigned.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}