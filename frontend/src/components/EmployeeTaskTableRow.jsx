import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { ArrowCounterclockwise, Check2Circle, Paperclip } from 'react-bootstrap-icons';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function EmployeeTaskTableRow({
  task,
  idx,
  isOverdue,
  formatDate,
  handleMarkCompleted,
  handleFileButtonClick,
  handleFileChange,
  showFileInput,
  currentTaskId,
  setShowFileInput,
  setCurrentTaskId,
  setTasks,
  user,
  token,
  loginUser,
  UpdateTask
}) {
  return (
    <tr
      style={{ 
        backgroundColor: isOverdue ? '#fef2f2' : 'white',
        borderLeft: isOverdue ? '4px solid #ef4444' : '4px solid transparent',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        if (!isOverdue) e.currentTarget.style.backgroundColor = '#f7fafc';
      }}
      onMouseLeave={(e) => {
        if (!isOverdue) e.currentTarget.style.backgroundColor = 'white';
      }}
    >
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
          <span>{formatDate(task.dueDate)}</span>
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
                  href={`${API_URL}${file.url}`}
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
                      
                      const originalTask = task;
                      try {
                        const updated = { ...task, files: (task.files || []).filter((_, i) => i !== fidx) };
                        // optimistic UI update
                        setTasks(prev => prev.map(t => t._id === task._id ? updated : t));
                        await UpdateTask({ ...updated, projectId: task.projectId }, token);
                        // ensure user context and local tasks are in sync
                        try {
                          if (user && Array.isArray(user.tasks)) {
                            const newUser = { ...user, tasks: user.tasks.map(t => t._id === updated._id ? updated : t) };
                            loginUser(newUser, token);
                          }
                        } catch (err) {
                          console.warn('Failed to sync deleted file into user context:', err);
                        }
                      } catch (e) {
                        console.error('Delete file failed:', e);
                        // Revert optimistic update on error
                        setTasks(prev => prev.map(t => t._id === task._id ? originalTask : t));
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
            title={task.status === "Completed" ? "Restore to In Progress" : "Mark as Completed"}
            disabled={task.status === "To Do" || task.projectId.Status !== "Active"}
            style={{
              background: task.status === "Completed"
                ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                : 'linear-gradient(135deg, #16a34a 0%, #10b981 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              boxShadow: task.status === "Completed" ? '0 2px 6px rgba(75,85,99,0.12)' : '0 2px 8px rgba(16,185,129,0.18)',
              transition: 'all 0.15s ease',
              color: 'white',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '38px'
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = task.status === "Completed" ? '0 4px 10px rgba(75,85,99,0.18)' : '0 6px 18px rgba(16,185,129,0.22)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = task.status === "Completed" ? '0 2px 6px rgba(75,85,99,0.12)' : '0 2px 8px rgba(16,185,129,0.18)';
            }}
          >
            {task.status === "Completed" ? <ArrowCounterclockwise /> : <Check2Circle />}
          </Button>
          {task.status !== "Completed" && (
            <Button
              size="sm"
              onClick={() => handleFileButtonClick(task._id)}
              title="Add File"
              disabled={task.status !== "In Progress" || task.projectId.Status !== "Active"}
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
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
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
}
