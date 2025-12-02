import React from 'react';
import { Container, Button } from 'react-bootstrap';
import TasksTable from './TasksTable';

export default function TaskSummarySection({ 
  tasks, 
  projectStatus, 
  onAddNewTask, 
  onUpdateTask, 
  onDeleteTask, 
  formatDate 
}) {
  return (
    <Container>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h4 style={{ 
          margin: '0 0 20px 0', 
          color: '#374151', 
          fontSize: '18px', 
          fontWeight: '600' 
        }}>
          📝 Task Summary
        </h4>
        
        <TasksTable
          tasks={tasks}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          formatDate={formatDate}
        />
        
        <Button 
          onClick={onAddNewTask} 
          disabled={projectStatus !== "Active"}
          style={{
            background: projectStatus === "Active" ? '#10b981' : '#9ca3af',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontWeight: '500',
            color: 'white'
          }}
        >
          + Add New Task
        </Button>
      </div>
    </Container>
  );
}
