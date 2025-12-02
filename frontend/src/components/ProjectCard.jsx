import React from 'react';
import { Badge } from 'react-bootstrap';

export default function ProjectCard({ project, onClick, startOfDay, today }) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return (
    <div style={{
      background: '#f8f9fa',
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }}
    onClick={onClick}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      e.currentTarget.style.transform = 'translateY(-1px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '8px'
      }}>
        <h6 style={{ 
          margin: 0, 
          color: '#1f2937', 
          fontSize: '16px', 
          fontWeight: '600',
          textTransform: 'capitalize'
        }}>
          {project.Name}
        </h6>
        <Badge 
          bg={
            project.Status === 'Active' ? 'success' :
            project.Status === 'Completed' ? 'primary' :
            project.Status === 'Pending' ? 'warning' : 'secondary'
          }
          style={{ fontSize: '11px' }}
        >
          {project.Status}
        </Badge>
      </div>
      
      {project.description && (
        <p style={{ 
          margin: '0 0 8px 0', 
          color: '#6b7280', 
          fontSize: '14px',
          lineHeight: '1.4'
        }}>
          {project.description.length > 80 
            ? `${project.description.substring(0, 80)}...` 
            : project.description}
        </p>
      )}
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        {project.clientName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ 
              fontSize: '12px', 
              color: '#9ca3af',
              fontWeight: '500'
            }}>
              Client:
            </span>
            <span style={{ 
              background: '#dbeafe', 
              color: '#1e40af', 
              padding: '2px 6px', 
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {project.clientName}
            </span>
          </div>
        )}
        
        {project.EndDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ 
              fontSize: '12px', 
              color: '#9ca3af',
              fontWeight: '500'
            }}>
              Deadline:
            </span>
            <span style={{ 
              background: (() => {
                const deadline = startOfDay(project.EndDate);
                const daysDiff = Math.floor((deadline - today) / MS_PER_DAY);
                if(project.Status === 'Completed') return '#d1fae5';
                if (daysDiff < 0) return '#fee2e2'; // Overdue - light red
                if (daysDiff <= 3) return '#fef3c7'; // Due soon - light yellow
                return '#d1fae5'; // Safe - light green
              })(),
              color: (() => {
                const deadline = startOfDay(project.EndDate);
                const daysDiff = Math.floor((deadline - today) / MS_PER_DAY);
                if(project.Status === 'Completed') return '#059669';
                if (daysDiff < 0) return '#dc2626'; // Overdue - red
                if (daysDiff <= 3) return '#d97706'; // Due soon - orange
                return '#059669'; // Safe - green
              })(),
              padding: '2px 6px', 
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {project.Status==="Completed" ? "Completed" : new Date(project.EndDate).toLocaleDateString()}
              {(() => {
                const deadline = startOfDay(project.EndDate);
                const daysDiff = Math.floor((deadline - today) / MS_PER_DAY);
                if(project.Status === 'Completed') return '';
                if (daysDiff < 0) return ` (Overdue)`;
                if (daysDiff === 0) return ` (Today)`;
                if (daysDiff === 1) return ` (Tomorrow)`;
                if (daysDiff <= 7) return ` (${daysDiff} days)`;
                return '';
              })()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
