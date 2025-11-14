import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

export default function MyProjectsList({ myProjects }) {
  return (
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
        📁 My Projects
      </h4>
      <div style={{ maxHeight: '320px', overflowY: 'auto', paddingRight: '8px' }}>
        {myProjects && myProjects.length > 0 ? (
          myProjects.map((proj, idx) => {
            const popover = (
              <Popover id={`project-popover-${proj._id || idx}`}>
                <Popover.Header as="h6">{proj.Name || proj.name || 'Unnamed Project'}</Popover.Header>
                <Popover.Body style={{ maxWidth: '320px' }}>
                  {proj.description || 'No description available.'}
                </Popover.Body>
              </Popover>
            );

            return (
              <OverlayTrigger
                key={proj._id || idx}
                trigger={["hover", "focus", "click"]}
                placement="auto"
                overlay={popover}
              >
                <div
                  role="button"
                  tabIndex={0}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e6edf3',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.click(); }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1f2937' }}>
                      {proj.Name || proj.name || 'Unnamed Project'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {proj.client ? `${proj.client}` : ''}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600' }}>
                      {proj.Status || 'N/A'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                      {proj.StartDate && new Date(proj.StartDate).toLocaleDateString()}
                      {proj.StartDate && proj.EndDate && ' - '}
                      {proj.EndDate && new Date(proj.EndDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </OverlayTrigger>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>📁</div>
            <p style={{ margin: 0, fontSize: '16px' }}>No projects assigned</p>
          </div>
        )}
      </div>
    </div>
  );
}
