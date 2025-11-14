import React from 'react';
import { Container, ProgressBar } from 'react-bootstrap';

export default function EmployeeTaskPerformance({ 
  myTasks, 
  completedTasks, 
  inProgressTasks, 
  myProjects 
}) {
  return (
    <Container fluid className="px-4" style={{ marginBottom: '24px' }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '16px 20px', 
          borderRadius: '12px', 
          marginBottom: '24px',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
        }}>
          <h4 style={{ 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📊 My Task Performance
          </h4>
        </div>
      
        {/* Task Metrics Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '24px' 
        }}>
          {/* Total Tasks */}
          <div style={{ 
            textAlign: 'center', 
            padding: '20px 16px', 
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', 
            borderRadius: '12px',
            border: '1px solid rgba(252, 182, 159, 0.3)',
            boxShadow: '0 4px 12px rgba(252, 182, 159, 0.2)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(252, 182, 159, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(252, 182, 159, 0.2)';
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: '#d97706',
              marginBottom: '4px'
            }}>
              {myTasks.length}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#92400e', 
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Total Tasks
            </div>
          </div>

          {/* Completed Tasks */}
          <div style={{ 
            textAlign: 'center', 
            padding: '20px 16px', 
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', 
            borderRadius: '12px',
            border: '1px solid rgba(168, 237, 234, 0.3)',
            boxShadow: '0 4px 12px rgba(168, 237, 234, 0.2)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(168, 237, 234, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(168, 237, 234, 0.2)';
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: '#059669',
              marginBottom: '4px'
            }}>
              {completedTasks}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#047857', 
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Completed Tasks
            </div>
          </div>

          {/* In Progress Tasks */}
          <div style={{ 
            textAlign: 'center', 
            padding: '20px 16px', 
            background: 'linear-gradient(135deg, #cbb4d4 0%, #20002c 100%)', 
            borderRadius: '12px',
            border: '1px solid rgba(203, 180, 212, 0.3)',
            boxShadow: '0 4px 12px rgba(203, 180, 212, 0.2)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(203, 180, 212, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(203, 180, 212, 0.2)';
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: '#ffffff',
              marginBottom: '4px'
            }}>
              {inProgressTasks}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#e5e7eb', 
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              In Progress
            </div>
          </div>

          {/* Project Count */}
          <div style={{ 
            textAlign: 'center', 
            padding: '20px 16px', 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
            borderRadius: '12px',
            border: '1px solid rgba(79, 172, 254, 0.3)',
            boxShadow: '0 4px 12px rgba(79, 172, 254, 0.2)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 172, 254, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 172, 254, 0.2)';
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '800', 
              color: '#ffffff',
              marginBottom: '4px'
            }}>
              {myProjects.length}
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: '#e0f7fa', 
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              My Projects
            </div>
          </div>
        </div>

        {/* Task Progress */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Task Completion Rate</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
              {myTasks.length > 0 ? Math.round((completedTasks / myTasks.length) * 100) : 0}%
            </span>
          </div>
          <ProgressBar 
            now={myTasks.length > 0 ? (completedTasks / myTasks.length) * 100 : 0} 
            variant="success"   
            style={{ height: '6px', borderRadius: '3px' }}
          />
        </div>
      </div>
    </Container>
  );
}
