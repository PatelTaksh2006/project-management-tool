import React from "react";
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";

export default function TopNavbar({ name }) {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand className="fw-bold" href="/">PM Tool</Navbar.Brand>

        <Navbar.Toggle aria-controls="topNavbar" />
        <Navbar.Collapse id="topNavbar">
          {/* Right-aligned block */}
          <Nav className="ms-auto align-items-center">
            <Navbar.Text className="text-white-50 me-3 d-none d-sm-inline">
              Welcome, {name}
            </Navbar.Text>

            {name}

            <Button variant="outline-light" size="sm" href="/" className="me-0">
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
