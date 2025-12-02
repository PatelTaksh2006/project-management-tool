import React from 'react';
import { Row, Col, ProgressBar } from 'react-bootstrap';

export default function PerformanceMetrics({ 
  projects, 
  totalTask, 
  completedTasks,
  startOfDay,
  today
}) {
  const overdueProjects = projects.filter(p => 
    p.EndDate && startOfDay(p.EndDate) < today && p.Status !== "Completed"
  );

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
              📈 Performance Metrics
            </h4>
          </div>
        
          {/* Key Metrics Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px', 
            marginBottom: '24px' 
          }}>
            {/* Total Projects */}
            <div style={{ 
              textAlign: 'center', 
              padding: '20px 16px', 
              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', 
              borderRadius: '12px',
              border: '1px solid rgba(252, 182, 159, 0.3)',
              boxShadow: '0 4px 12px rgba(252, 182, 159, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
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
                {projects.length}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#92400e', 
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Total Projects
              </div>
            </div>

            {/* Active Projects */}
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
                {projects.filter(p => p.Status === "Active").length}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#047857', 
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Active Projects
              </div>
            </div>

            {/* Completed Projects */}
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
                {projects.filter(p => p.Status === "Completed").length}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#e5e7eb', 
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Completed
              </div>
            </div>
          </div>

          {/* Task Statistics */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Tasks</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                {completedTasks}/{totalTask}
              </span>
            </div>
            <ProgressBar 
              now={totalTask > 0 ? (100 * completedTasks) / totalTask : 0} 
              variant="success"   
              style={{ height: '6px', borderRadius: '3px' }}
            />
          </div>

          <Row>
            <Col md={6}>
              {/* Overdue Projects */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                background: overdueProjects.length > 0 
                  ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)' 
                  : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                padding: '14px 18px',
                borderRadius: '10px',
                border: overdueProjects.length > 0 
                  ? '1px solid #fecaca' 
                  : '1px solid #bbf7d0',
                marginBottom: '16px',
                boxShadow: overdueProjects.length > 0 
                  ? '0 2px 8px rgba(239, 68, 68, 0.1)' 
                  : '0 2px 8px rgba(34, 197, 94, 0.1)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    background: overdueProjects.length > 0 ? '#ef4444' : '#22c55e', 
                    color: 'white', 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '18px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {overdueProjects.length > 0 ? '⚠️' : '✅'}
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: '15px', 
                      color: '#374151', 
                      fontWeight: '600',
                      marginBottom: '2px'
                    }}>
                      Overdue Projects
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: overdueProjects.length > 0 ? '#7f1d1d' : '#065f46',
                      fontWeight: '500'
                    }}>
                      {overdueProjects.length > 0 
                        ? 'Action Required' 
                        : 'All on track'}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  background: overdueProjects.length > 0 ? '#ef4444' : '#22c55e', 
                  color: 'white', 
                  padding: '8px 16px', 
                  borderRadius: '20px', 
                  fontSize: '16px', 
                  fontWeight: '700',
                  minWidth: '45px',
                  textAlign: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}>
                  {overdueProjects.length}
                </div>
              </div>
            </Col>

            <Col md={6}>
              {/* Success Rate */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                background: '#f8fafc',
                padding: '14px 18px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                marginBottom: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    background: '#22c55e', 
                    color: 'white', 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '18px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    📊
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: '15px', 
                      color: '#374151', 
                      fontWeight: '600',
                      marginBottom: '2px'
                    }}>
                      Success Rate
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#065f46',
                      fontWeight: '500'
                    }}>
                      Project Completion
                    </div>
                  </div>
                </div>
                <div style={{ 
                  background: '#22c55e', 
                  color: 'white', 
                  padding: '8px 16px', 
                  borderRadius: '20px', 
                  fontSize: '16px', 
                  fontWeight: '700',
                  minWidth: '45px',
                  textAlign: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}>
                  {projects.length > 0 ? Math.round((projects.filter(p => p.Status === "Completed").length / projects.length) * 100) : 0}%
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
}
