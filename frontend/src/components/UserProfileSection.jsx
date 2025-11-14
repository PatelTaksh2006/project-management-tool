import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

export default function UserProfileSection({ user, onUpdateProfile }) {
  return (
    <Row style={{ margin: '0 -8px', marginBottom: '24px' }}>
      <Col lg={12}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <h4 style={{ 
              margin: 0, 
              color: '#374151', 
              fontSize: '18px', 
              fontWeight: '600'
            }}>
              Profile Information
            </h4>
            <Button
              variant="primary"
              size="sm"
              onClick={onUpdateProfile}
              style={{
                borderRadius: '8px',
                padding: '6px 16px',
                fontWeight: '500'
              }}
            >
              ✏️ Update Profile
            </Button>
          </div>
          <Row>
            <Col md={6}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <strong style={{ color: '#374151', minWidth: '120px' }}>Employee ID:</strong>
                  <span style={{ color: '#6b7280' }}>{user?.EmpId || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <strong style={{ color: '#374151', minWidth: '120px' }}>Name:</strong>
                  <span style={{ color: '#6b7280' }}>{user?.Name || user?.name || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <strong style={{ color: '#374151', minWidth: '120px' }}>Email:</strong>
                  <span style={{ color: '#6b7280' }}>{user?.Email || user?.email || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <strong style={{ color: '#374151', minWidth: '120px' }}>Role:</strong>
                  <span style={{ 
                    background: '#f3f4f6', 
                    color: '#374151', 
                    padding: '4px 8px', 
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}>
                    {user?.isManager ? "Manager" : "Employee"} - {user?.role || 'N/A'}
                  </span>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <strong style={{ color: '#374151', minWidth: '100px' }}>Department:</strong>
                  <span style={{ color: '#6b7280' }}>{user?.department || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <strong style={{ color: '#374151', minWidth: '100px' }}>Phone:</strong>
                  <span style={{ color: '#6b7280' }}>{user?.phone || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <strong style={{ color: '#374151', minWidth: '100px' }}>Joined:</strong>
                  <span style={{ color: '#6b7280' }}>
                    {user?.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </Col>
          </Row>
          {user?.address && (
            <div style={{ 
              marginTop: '16px', 
              paddingTop: '16px', 
              borderTop: '1px solid #e5e7eb' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <strong style={{ color: '#374151', minWidth: '100px' }}>Address:</strong>
                <span style={{ color: '#6b7280' }}>{user.address}</span>
              </div>
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
}
