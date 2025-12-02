import React from 'react';
import { Container, Button } from 'react-bootstrap';
import DisplayProjectInformation from './DisplayProjectInformation';

export default function ProjectInformationCard({ project, onEditProject }) {
  return (
    <Container style={{ marginBottom: '20px' }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <h4 style={{ 
            margin: 0, 
            color: '#374151', 
            fontSize: '18px', 
            fontWeight: '600' 
          }}>
            🏢 Project Information
          </h4>
          <Button
            variant="secondary"
            size="sm"
            onClick={onEditProject}
            style={{
              borderRadius: '8px',
              padding: '6px 16px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ✏️ Edit Project
          </Button>
        </div>
        <DisplayProjectInformation project={project} />
      </div>
    </Container>
  );
}
