import React from 'react';
import { Badge } from 'react-bootstrap';

export default function MissedTaskCard({ task, startOfDay, today }) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return (
    <div style={{
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
  );
}
