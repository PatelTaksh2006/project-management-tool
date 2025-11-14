import React from 'react';
import { Badge } from 'react-bootstrap';

export default function UpcomingDeadlinesList({ upcomingTasks }) {
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
  );
}
