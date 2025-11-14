import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default function EmployeeTaskSummaryCards({ completedCount, inProgressCount, todoCount }) {
  return (
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
  );
}
