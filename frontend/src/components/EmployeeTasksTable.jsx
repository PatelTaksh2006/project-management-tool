import React from 'react';
import { Table } from 'react-bootstrap';
import EmployeeTaskTableRow from './EmployeeTaskTableRow';

export default function EmployeeTasksTable({
  filteredTasks,
  startOfDay,
  today,
  formatDate,
  handleMarkCompleted,
  handleFileButtonClick,
  handleFileChange,
  showFileInput,
  currentTaskId,
  setShowFileInput,
  setCurrentTaskId,
  setTasks,
  user,
  token,
  loginUser,
  UpdateTask
}) {
  return (
    <div style={{
      maxHeight: "500px",
      overflowY: "auto",
      overflowX: "auto"
    }}>
      <Table hover responsive style={{ 
        minWidth: 1000, 
        margin: 0,
        fontSize: '14px'
      }}>
        <thead style={{
          background: '#f8f9fa',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <tr>
            <th style={{ 
              padding: '16px 12px', 
              fontWeight: '600', 
              color: '#4a5568',
              borderBottom: '2px solid #e2e8f0',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>#</th>
            <th style={{ 
              padding: '16px 12px', 
              fontWeight: '600', 
              color: '#4a5568',
              borderBottom: '2px solid #e2e8f0',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Task Name</th>
            <th style={{ 
              padding: '16px 12px', 
              fontWeight: '600', 
              color: '#4a5568',
              borderBottom: '2px solid #e2e8f0',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Project</th>
            <th style={{ 
              padding: '16px 12px', 
              fontWeight: '600', 
              color: '#4a5568',
              borderBottom: '2px solid #e2e8f0',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Status</th>
            <th style={{ 
              padding: '16px 12px', 
              fontWeight: '600', 
              color: '#4a5568',
              borderBottom: '2px solid #e2e8f0',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Priority</th>
            <th style={{ 
              padding: '16px 12px', 
              fontWeight: '600', 
              color: '#4a5568',
              borderBottom: '2px solid #e2e8f0',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Due Date</th>
            <th style={{ 
              padding: '16px 12px', 
              fontWeight: '600', 
              color: '#4a5568',
              borderBottom: '2px solid #e2e8f0',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Files</th>
            <th style={{ 
              padding: '16px 12px', 
              fontWeight: '600', 
              color: '#4a5568',
              borderBottom: '2px solid #e2e8f0',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              textAlign: 'center'
            }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ 
                textAlign: 'center', 
                padding: '48px 24px',
                color: '#718096',
                fontSize: '16px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>No tasks found</div>
                <div style={{ fontSize: '14px' }}>Try adjusting your filters or check back later</div>
              </td>
            </tr>
          ) : (
            filteredTasks.map((task, idx) => {
              const isOverdue = !!(task && task.dueDate && startOfDay(task.dueDate) < today && task.status !== "Completed");
              return (
                <EmployeeTaskTableRow
                  key={task._id}
                  task={task}
                  idx={idx}
                  isOverdue={isOverdue}
                  formatDate={formatDate}
                  handleMarkCompleted={handleMarkCompleted}
                  handleFileButtonClick={handleFileButtonClick}
                  handleFileChange={handleFileChange}
                  showFileInput={showFileInput}
                  currentTaskId={currentTaskId}
                  setShowFileInput={setShowFileInput}
                  setCurrentTaskId={setCurrentTaskId}
                  setTasks={setTasks}
                  user={user}
                  token={token}
                  loginUser={loginUser}
                  UpdateTask={UpdateTask}
                />
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
}
