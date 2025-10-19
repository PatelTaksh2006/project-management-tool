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
    <div className="bg-light min-vh-100">
      <Navbar name="manager" />
      <Row className="g-0">
        {/* Sticky sidebar */}
        <Col
          md={3}
          className="bg-white border-end"
          style={{ position: "sticky", top: 0, alignSelf: "flex-start", height: "100vh", overflowY: "auto" }}
        >
          <Sidebar user="manager" value="dashboard" />
        </Col>

        <Col md={9} className="p-4">
          <Container fluid className="px-0">

            {/* Page header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h3 className="mb-1">Manager Dashboard</h3>
                <div className="text-muted">Overview of projects, performance, and budget</div>
              </div>
            </div>

            {/* Quick stat tiles */}
            

            {/* Main cards */}
            <Row className="g-3">
              <Col lg={6}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Header className="bg-success-subtle text-success fw-semibold">
                    <i className="bi bi-kanban me-2" />
                    Active Projects
                  </Card.Header>
                  <Card.Body>
                    <ul className="mb-0 ps-3">

                      {projects.map(element => 
                        <li key={element._id} className="mb-1 text-capitalize">{element.Name}</li>                        
                      )}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={6}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Header className="bg-primary-subtle text-primary fw-semibold">
                    <i className="bi bi-bar-chart-fill me-2" />
                    Performance
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div>
                        <Badge bg="success" className="me-2">Completed Projects</Badge>
                        <span className="fw-semibold">{projects.filter(p=>p.Status==="Active").length}</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <Badge bg="info" className="me-2">Completed Tasks</Badge>
                        <span className="fw-semibold">{CompletedTask}</span>
                      </div>
                    </div>
                    <hr />
                    <div className="text-muted small mb-1">Completion</div>
                    <ProgressBar   now={totalTask > 0 ? (100 * CompletedTask) / totalTask : 0} variant="success"   label={`${totalTask > 0 ? ((100 * CompletedTask) / totalTask).toFixed(0) : 0}%`}
 className="rounded-1" />
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={6}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Header className="bg-warning-subtle text-warning fw-semibold">
                    <i className="bi bi-activity me-2" />
                    Current Status
                  </Card.Header>
                  <Card.Body>
                    <ul className="mb-0 ps-3">
                      <li className="mb-2">
                        <Badge bg="primary" className="me-2">Total Projects</Badge>
                        {projects.length}
                      </li>
                      <li>
                        <Badge bg="secondary" className="me-2">Total Tasks</Badge>
                        {totalTask}
                      </li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={6}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Header className="bg-info-subtle text-info fw-semibold">
                    <i className="bi bi-currency-dollar me-2" />
                    Budget Overview
                  </Card.Header>
                  <Card.Body>
                    <ul className="mb-3 ps-3">
                      <li className="mb-2">
                        <Badge bg="success" className="me-2">Total Budget</Badge>
                        ${totalBudget}
                      </li>
                      <li className="mb-2">
                        <Badge bg="danger" className="me-2">Used</Badge>
                        ${usedBudget}
                      </li>
                      <li>
                        <Badge bg="info" className="me-2">Remaining</Badge>
                        ${remainingBudget}
                      </li>
                    </ul>
                    <div className="text-muted small mb-1">Utilization</div>
                    <ProgressBar now={100*usedBudget/totalBudget} variant="info" label={`${(100*usedBudget/totalBudget).toFixed(0)}%`} className="rounded-1" />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Recent activity */}
            

          </Container>
        </Col>
      </Row>
    </div>
  );
}
