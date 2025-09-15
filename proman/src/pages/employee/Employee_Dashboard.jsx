import React from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Row, Col, Card, Badge, ProgressBar, ListGroup, Container } from "react-bootstrap";

export default function Employee_Dashboard() {
  return (
    <div className="bg-light min-vh-100">
      <Navbar name="employee" />
      <Row className="g-0">
        <Col md={3} className="border-end bg-white">
          <Sidebar user="employee" value="dashboard" id_name="Frank"/>
        </Col>

        <Col md={9} className="p-4">
          <Container fluid className="px-0">

            {/* Row 1 */}
            <Row className="pt-3 g-3">
              <Col md={{ span: 4, offset: 0 }}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Header className="bg-success-subtle text-success fw-semibold">
                    Active Projects
                  </Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        1st project
                        <Badge bg="success" pill>On Track</Badge>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        2nd Project
                        <Badge bg="warning" text="dark" pill>At Risk</Badge>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        3rd project
                        <Badge bg="secondary" pill>Paused</Badge>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={{ span: 4, offset: 4 }}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Header className="bg-primary-subtle text-primary fw-semibold">
                    Performance
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-2">
                      <Badge bg="success" className="me-2">Completed Projects</Badge>
                      <span className="fw-semibold">12</span>
                    </div>
                    <div className="mb-3">
                      <Badge bg="info" className="me-2">Completed Tasks</Badge>
                      <span className="fw-semibold">48</span>
                    </div>
                    <div className="text-muted small mb-1">Weekly completion</div>
                    <ProgressBar now={68} variant="success" label="68%" className="rounded-1" />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Row 2 */}
            <Row className="pt-4 mt-2 g-3">
              <Col md={{ span: 4, offset: 0 }}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Header className="bg-warning-subtle text-warning fw-semibold">
                    Current Status
                  </Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        Total Projects
                        <Badge bg="primary" pill>15</Badge>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        Total Tasks
                        <Badge bg="secondary" pill>120</Badge>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={{ span: 4, offset: 4 }}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Header className="bg-info-subtle text-info fw-semibold">
                    Employee Status
                  </Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        Top performer
                        <Badge bg="success" pill>97%</Badge>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        2nd performer
                        <Badge bg="success" pill>92%</Badge>
                      </ListGroup.Item>
                    </ListGroup>
                    <hr />
                    <div className="text-muted small">This week</div>
                    <ProgressBar now={54} variant="info" label="54%" className="rounded-1" />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

          </Container>
        </Col>
      </Row>
    </div>
  );
}
