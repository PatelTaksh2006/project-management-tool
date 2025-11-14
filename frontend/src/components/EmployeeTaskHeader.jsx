import React from 'react';

export default function EmployeeTaskHeader() {
  return (
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
            My Tasks
          </h2>
          <p style={{ 
            margin: 0, 
            fontSize: '1rem', 
            opacity: 0.9
          }}>
            Track and manage your assigned tasks
          </p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ fontSize: '2rem', textAlign: 'center' }}>📋</div>
        </div>
      </div>
    </div>
  );
}
