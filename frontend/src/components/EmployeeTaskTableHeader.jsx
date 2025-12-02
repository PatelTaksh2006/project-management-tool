import React from 'react';

export default function EmployeeTaskTableHeader({ filteredTasksCount }) {
  return (
    <div style={{
      background: '#4f46e5',
      padding: '16px 20px',
      color: 'white'
    }}>
      <h5 style={{ margin: 0, fontWeight: '600' }}>
        Tasks ({filteredTasksCount})
      </h5>
    </div>
  );
}
