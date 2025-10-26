import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Row, Col, Card, Badge, ProgressBar, ListGroup, Container } from "react-bootstrap";
import { useUser } from "../../contexts/UserContext";

export default function Employee_Dashboard() {
  const { user } = useUser();
  
  const employeeId = user?._id || user?.id || user?.Id;
  const employeeName = user?.name || user?.Name || user?.Email || "Employee";
  
  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Navbar name="employee" />
      <Row className="g-0">
        <Col md={3} className="border-end bg-white">
          <Sidebar user="employee" value="dashboard" id_name={employeeName}/>
        </Col>

        <Col md={9}>
          <div style={{
            background: '#4f46e5',
            color: 'white',
            padding: '30px',
            marginBottom: '30px'
          }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
              👋 Welcome, {employeeName}
            </h2>
            <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
              Your dashboard overview and project updates
            </p>
          </div>
          
          <Container fluid className="px-4">

            {/* Row 1 */}
            <Row style={{ marginBottom: '24px' }}>
              <Col md={6} style={{ padding: '0 12px', marginBottom: '16px' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  height: '100%'
                }}>
                  <div style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontWeight: '600'
                  }}>
                    🚀 Active Projects
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      <span style={{ color: '#374151' }}>1st project</span>
                      <Badge bg="success" pill>On Track</Badge>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      <span style={{ color: '#374151' }}>2nd Project</span>
                      <Badge bg="warning" text="dark" pill>At Risk</Badge>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 0'
                    }}>
                      <span style={{ color: '#374151' }}>3rd project</span>
                      <Badge bg="secondary" pill>Paused</Badge>
                    </div>
                  </div>
                </div>
              </Col>

              <Col md={6} style={{ padding: '0 12px', marginBottom: '16px' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  height: '100%'
                }}>
                  <div style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontWeight: '600'
                  }}>
                    📈 Performance
                  </div>
                  <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Badge bg="success" style={{ fontSize: '11px' }}>Completed Projects</Badge>
                    <span style={{ fontWeight: '600', color: '#374151' }}>12</span>
                  </div>
                  <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Badge bg="info" style={{ fontSize: '11px' }}>Completed Tasks</Badge>
                    <span style={{ fontWeight: '600', color: '#374151' }}>48</span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Weekly completion</div>
                  <ProgressBar 
                    now={68} 
                    variant="success" 
                    label="68%" 
                    style={{ height: '8px', borderRadius: '4px' }}
                  />
                </div>
              </Col>
            </Row>

            {/* Row 2 */}
            <Row>
              <Col md={6} style={{ padding: '0 12px', marginBottom: '16px' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  height: '100%'
                }}>
                  <div style={{
                    background: '#f59e0b',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontWeight: '600'
                  }}>
                    📊 Current Status
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      <span style={{ color: '#374151' }}>Total Projects</span>
                      <Badge bg="primary" pill>15</Badge>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 0'
                    }}>
                      <span style={{ color: '#374151' }}>Total Tasks</span>
                      <Badge bg="secondary" pill>120</Badge>
                    </div>
                  </div>
                </div>
              </Col>

              <Col md={6} style={{ padding: '0 12px', marginBottom: '16px' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  height: '100%'
                }}>
                  <div style={{
                    background: '#06b6d4',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontWeight: '600'
                  }}>
                    🏆 Employee Status
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      <span style={{ color: '#374151' }}>Top performer</span>
                      <Badge bg="success" pill>97%</Badge>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      <span style={{ color: '#374151' }}>2nd performer</span>
                      <Badge bg="success" pill>92%</Badge>
                    </div>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>This week</div>
                  <ProgressBar 
                    now={54} 
                    variant="info" 
                    label="54%" 
                    style={{ height: '8px', borderRadius: '4px' }}
                  />
                </div>
              </Col>
            </Row>

          </Container>
        </Col>
      </Row>
    </div>
  );
}
