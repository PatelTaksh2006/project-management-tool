import React from 'react';
import { Badge } from 'react-bootstrap';

export default function OverdueTasksCard({ overdueTasks }) {
  return (
    <div style={{
      background: overdueTasks.length > 0 
        ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' 
        : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      padding: '20px',
      borderRadius: '12px',
      border: overdueTasks.length > 0 
        ? '1px solid #fecaca' 
        : '1px solid #bbf7d0',
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
              Overdue Tasks
            </h5>
            <div style={{ 
              fontSize: '14px', 
              color: overdueTasks.length > 0 ? '#7f1d1d' : '#065f46',
              fontWeight: '500',
              marginTop: '2px'
            }}>
              {overdueTasks.length > 0 ? 'Immediate attention required' : 'No overdue tasks'}
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

      {overdueTasks.length > 0 ? (
        <div style={{ maxHeight: '260px', overflowY: 'auto', paddingRight: '8px' }}>
          {overdueTasks.map((task, index) => (
            <div key={task._id || index} style={{
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '8px',
              borderLeft: '4px solid #ef4444'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h6 style={{ margin: '0 0 4px 0', color: '#7f1d1d', fontSize: '15px', fontWeight: '600' }}>
                    {task.name || 'Unnamed Task'}
                  </h6>
                  <div style={{ fontSize: '13px', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    <Badge bg="danger" style={{ fontSize: '10px' }}>
                      {(() => { 
                        const today = new Date(); 
                        today.setHours(0,0,0,0); 
                        const dueDate = new Date(task.dueDate); 
                        dueDate.setHours(0,0,0,0); 
                        const diffDays = Math.floor((today - dueDate)/(1000*60*60*24)); 
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
        <div style={{ textAlign: 'center', padding: '20px', color: '#065f46' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎉</div>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Great job!</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>No overdue tasks. Keep up the excellent work!</p>
        </div>
      )}
    </div>
  );
}
