import React from 'react';

export default function ProjectTaskHeader() {
  return (
    <div style={{
      background: '#4f46e5',
      color: 'white',
      padding: '30px',
      marginBottom: '30px'
    }}>
      <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
        📋 Project Details
      </h2>
      <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
        View and manage all information and tasks for this project
      </p>
    </div>
  );
}
