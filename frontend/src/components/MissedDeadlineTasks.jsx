import React from 'react';
import { Col, Badge } from 'react-bootstrap';
import MissedTaskCard from './MissedTaskCard';

export default function MissedDeadlineTasks({ missedDeadlineTasks, startOfDay, today }) {
  return (
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
              <MissedTaskCard
                key={index}
                task={task}
                startOfDay={startOfDay}
                today={today}

              />
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
  );
}
