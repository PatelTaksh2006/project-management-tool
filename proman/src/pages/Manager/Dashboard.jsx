import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Row, Col, Card, Badge, Container, ProgressBar } from "react-bootstrap";
import Managerprojects from "../../Data/Projects";
import { useUser } from "../../contexts/UserContext";

export default function Dashboard() {
  const { user } = useUser();
  let id = user?._id; // Use user ID from context, fallback to 101
  let projects = Managerprojects.filter(p => p.managerId === id);
  let CompletedTask=projects.reduce((acc, curr) => acc + (Array.isArray(curr.task) ? curr.task.filter(t => t.status === "Completed").length : 0),0);
let totalTask = projects.reduce((acc, curr) => acc + (Array.isArray(curr.task) ? curr.task.length : 0),0);  
  let totalBudget=projects.reduce((acc,curr)=>acc+curr.budget,0);
  let usedBudget=projects.reduce((acc,curr)=>acc+curr.budgetUsed,0);
  let remainingBudget=totalBudget-usedBudget;
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <Navbar name="manager" />
      <Row style={{ margin: 0 }}>
        <Col md={3} style={{ padding: 0 }}>
          <Sidebar user="manager" value="dashboard" />
        </Col>
        <Col md={9} style={{ padding: '20px 30px' }}>
          {/* Header Section */}
          <div style={{
            background: '#4f46e5',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '2rem', 
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  Manager Dashboard
                </h2>
                <p style={{ 
                  margin: 0, 
                  fontSize: '1rem', 
                  opacity: 0.9
                }}>
                  Overview of projects, performance, and budget
                </p>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{ fontSize: '2rem', textAlign: 'center' }}>📊</div>
              </div>
            </div>
          </div>

            {/* Quick stat tiles */}
            

            {/* Main cards */}
            <Row style={{ margin: '0 -8px' }}>
              <Col lg={6} style={{ padding: '0 8px', marginBottom: '16px' }}>
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
                    📋 Active Projects
                  </div>
                  <ul style={{ margin: 0, padding: '0 0 0 20px', listStyle: 'disc' }}>
                    {projects.map(element => 
                      <li key={element._id} style={{ 
                        marginBottom: '8px', 
                        textTransform: 'capitalize',
                        color: '#374151'
                      }}>
                        {element.Name}
                      </li>                        
                    )}
                  </ul>
                </div>
              </Col>

              <Col lg={6} style={{ padding: '0 8px', marginBottom: '16px' }}>
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
                  <div style={{ marginBottom: '12px' }}>
                    <Badge bg="success" style={{ marginRight: '8px', fontSize: '11px' }}>Active Projects</Badge>
                    <span style={{ fontWeight: '600' }}>{projects.filter(p=>p.Status==="Active").length}</span>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <Badge bg="info" style={{ marginRight: '8px', fontSize: '11px' }}>Completed Tasks</Badge>
                    <span style={{ fontWeight: '600' }}>{CompletedTask}</span>
                  </div>
                  <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                  <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Task Completion</div>
                  <ProgressBar 
                    now={totalTask > 0 ? (100 * CompletedTask) / totalTask : 0} 
                    variant="success"   
                    label={`${totalTask > 0 ? ((100 * CompletedTask) / totalTask).toFixed(0) : 0}%`}
                    style={{ height: '8px', borderRadius: '4px' }}
                  />
                </div>
              </Col>

              <Col lg={6} style={{ padding: '0 8px', marginBottom: '16px' }}>
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
                  <ul style={{ margin: 0, padding: '0 0 0 20px', listStyle: 'disc' }}>
                    <li style={{ marginBottom: '12px', color: '#374151' }}>
                      <Badge bg="primary" style={{ marginRight: '8px', fontSize: '11px' }}>Total Projects</Badge>
                      {projects.length}
                    </li>
                    <li style={{ color: '#374151' }}>
                      <Badge bg="secondary" style={{ marginRight: '8px', fontSize: '11px' }}>Total Tasks</Badge>
                      {totalTask}
                    </li>
                  </ul>
                </div>
              </Col>

              <Col lg={6} style={{ padding: '0 8px', marginBottom: '16px' }}>
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
                    💰 Budget Overview
                  </div>
                  <ul style={{ margin: '0 0 16px 0', padding: '0 0 0 20px', listStyle: 'disc' }}>
                    <li style={{ marginBottom: '8px', color: '#374151' }}>
                      <Badge bg="success" style={{ marginRight: '8px', fontSize: '11px' }}>Total Budget</Badge>
                      ${totalBudget}
                    </li>
                    <li style={{ marginBottom: '8px', color: '#374151' }}>
                      <Badge bg="danger" style={{ marginRight: '8px', fontSize: '11px' }}>Used</Badge>
                      ${usedBudget}
                    </li>
                    <li style={{ marginBottom: '16px', color: '#374151' }}>
                      <Badge bg="info" style={{ marginRight: '8px', fontSize: '11px' }}>Remaining</Badge>
                      ${remainingBudget}
                    </li>
                  </ul>
                  <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Budget Utilization</div>
                  <ProgressBar 
                    now={totalBudget > 0 ? 100*usedBudget/totalBudget : 0} 
                    variant="info" 
                    label={`${totalBudget > 0 ? (100*usedBudget/totalBudget).toFixed(0) : 0}%`} 
                    style={{ height: '8px', borderRadius: '4px' }}
                  />
                </div>
              </Col>
            </Row>
        </Col>
      </Row>
    </div>
  );
}
