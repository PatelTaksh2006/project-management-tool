import React from 'react';
import { Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProjectCard from './ProjectCard';

export default function ProjectsList({ projects, startOfDay, today }) {
  const navigate = useNavigate();

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
        <h4 style={{ 
          margin: '0 0 20px 0', 
          color: '#374151', 
          fontSize: '18px', 
          fontWeight: '600',
          paddingBottom: '12px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          📋 Projects
        </h4>
        <div style={{ 
          maxHeight: '300px', 
          overflowY: 'auto',
          paddingRight: '8px'
        }}>
          {projects.length > 0 ? (
            projects.map(element => (
              <ProjectCard
                key={element._id}
                project={element}
                onClick={() => {
                  navigate(`/manager/projects/${element._id}`, { state: { fromApp: true } });
                }}
                startOfDay={startOfDay}
                today={today}
                
              />
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#9ca3af'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <p style={{ margin: 0, fontSize: '16px' }}>No active projects found</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>Create a new project to get started</p>
            </div>
          )}
        </div>
      </div>
    </Col>
  );
}
