import React from 'react';
import { Table } from 'react-bootstrap';
import TaskTableRow from './TaskTableRow';

export default function TasksTable({ tasks, onUpdateTask, onDeleteTask, formatDate }) {
  return (
    <div style={{
      maxHeight: "400px",
      overflowY: "auto",
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      marginBottom: '20px'
    }}>
      <Table striped bordered hover responsive className="mb-0">
        <thead style={{ background: '#f8f9fa', position: 'sticky', top: 0, zIndex: 1 }}>
          <tr>
            <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>#</th>
            <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Task Name</th>
            <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Assigned To</th>
            <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Status</th>
            <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Priority</th>
            <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Due Date</th>
            <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Files</th>
            <th style={{ borderBottom: '2px solid #dee2e6', padding: '12px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center" style={{ padding: '20px' }}>
                No tasks found.
              </td>
            </tr>
          ) : (
            tasks.map((task, idx) => (
              <TaskTableRow
                key={task._id}
                task={task}
                index={idx}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
                formatDate={formatDate}
              />
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}
