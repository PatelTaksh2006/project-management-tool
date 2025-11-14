import React from 'react';
import { Badge } from 'react-bootstrap';

export default function RecentTasksList({ myTasks }) {
  return (
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
  );
}
