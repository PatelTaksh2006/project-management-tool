import React from 'react';
import { Button, Badge } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function TaskTableRow({ task, index, onUpdate, onDelete, formatDate }) {
  const isOverdue = (task && task._doc && task._doc.isOverdue) || task.isOverdue;

  return (
    <tr>
      <td style={{ padding: '12px' }}>{index + 1}</td>
      <td style={{ padding: '12px' }}>{task.name}</td>
      <td style={{ padding: '12px' }}>{task.assignedTo?.Name}</td>
      <td style={{ padding: '12px' }}>
        <Badge
          bg={
            task.status === "Completed"
              ? "success"
              : task.status === "In Progress"
              ? "warning"
              : "secondary"
          }
        >
          {task.status}
        </Badge>
      </td>
      <td style={{ padding: '12px' }}>
        <Badge
          bg={
            task.priority === "High"
              ? "danger"
              : task.priority === "Medium"
              ? "warning"
              : "secondary"
          }
        >
          {task.priority}
        </Badge>
      </td>
      <td style={{ 
        padding: '12px', 
        whiteSpace: "nowrap", 
        color: isOverdue ? '#b00020' : undefined 
      }}>
        {formatDate(task.dueDate)} 
        {isOverdue && <Badge bg="danger" style={{ marginLeft: 8 }}>Overdue</Badge>}
      </td>
      <td style={{ padding: '12px' }}>
        {task.files && task.files.length > 0 ? (
          task.files.map((file, fidx) => (
            <a
              key={fidx}
              href={`${API_URL}${file.url}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                margin: "2px 6px 2px 0",
                padding: "4px 10px 4px 8px",
                borderRadius: "16px",
                background: "#f1f3f4",
                color: "#333",
                textDecoration: "none",
                fontSize: "0.95em",
                border: "1px solid #d1d5da",
                boxShadow: "0 1px 2px rgba(60,60,60,0.05)",
                verticalAlign: "middle"
              }}
            >
              <span role="img" aria-label="file" style={{ marginRight: 6, color: "#6c63ff" }}>@</span>
              {file.name}
            </a>
          ))
        ) : (
          <span>No files</span>
        )}
      </td>
      <td style={{ padding: '12px' }}>
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onUpdate(task)}
            style={{ 
              minWidth: "70px",
              borderRadius: '6px'
            }}
          >
            Update
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(task._id)}
            style={{ 
              minWidth: "70px",
              borderRadius: '6px'
            }}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
