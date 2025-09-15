import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, ListGroup } from "react-bootstrap";
import employeeList from "../Data/Employee";

export default function EditProject({
  project,
  show,
  onClose,
  onProjectUpdate,
  
}) {
  // All employees in the system
  const allEmployees = employeeList;

  // Initialize form data with the project prop
  const [formData, setFormData] = useState({
    Id: "",
    Name: "",
    Start_Date: "",
    End_date: "",
    Status: "Active",
    client: "",
    description: "",
    stakeholders: "",
    budget: "",
    team: [],
  });

  // Selected team (employees in this project)
  const [selectedTeam, setSelectedTeam] = useState([]);

  // Employees not in the team
  const [availableEmployees, setAvailableEmployees] = useState([]);

  // Update form data and employee lists when project prop changes
  useEffect(() => {
    if (project) {
      setFormData({
        Id: project.Id || "",
        Name: project.Name || "",
        Start_Date: project.Start_Date || "",
        End_date: project.End_date || "",
        Status: project.Status || "Active",
        client: project.client || "",
        description: project.description || "",
        stakeholders: project.stakeholders
          ? project.stakeholders.join(", ")
          : "",
        budget: project.budget || "",
        team: project.team || [],
      });
      setSelectedTeam(project.team || []);
    }
  }, [project, show]);

  // Update available employees whenever selectedTeam changes
  useEffect(() => {
    const selectedIds = new Set(selectedTeam.map((emp) => emp.id));
    setAvailableEmployees(
      allEmployees.filter((emp) => !selectedIds.has(emp.id))
    );
  }, [selectedTeam, allEmployees]);

  // Handle modal close
  const handleClose = () => {
    setFormData({
      Id: "",
      Name: "",
      Start_Date: "",
      End_date: "",
      Status: "Active",
      client: "",
      description: "",
      stakeholders: "",
      budget: "",
      team: [],
    });
    setSelectedTeam([]);
    setAvailableEmployees(allEmployees);
    if (onClose) onClose();
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
  };

  // Add employee to team
  const handleAddEmployee = (emp) => {
    setSelectedTeam((prev) => [...prev, emp]);
  };

  // Remove employee from team
  const handleRemoveEmployee = (empId) => {
    setSelectedTeam((prev) => prev.filter((emp) => emp.id !== empId));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert comma-separated stakeholders to array
    const stakeholdersArr = formData.stakeholders
      ? formData.stakeholders.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const updatedProject = {
  ...project, // keep all existing properties (managerId, task, milestones, etc.)
  Id: formData.Id,
  Name: formData.Name,
  Employees: selectedTeam.length,
  Start_Date: formData.Start_Date,
  End_date: formData.End_date,
  Status: formData.Status,
  client: formData.client,
  description: formData.description,
  stakeholders: stakeholdersArr,
  budget: Number(formData.budget) || 0,
  team: selectedTeam,
};


    if (onProjectUpdate) {
      onProjectUpdate(updatedProject);
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Project</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Project Name */}
          <Form.Group className="mb-3">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              placeholder="Enter project name"
              required
            />
          </Form.Group>
          {/* Client */}
          <Form.Group className="mb-3">
            <Form.Label>Client</Form.Label>
            <Form.Control
              type="text"
              name="client"
              value={formData.client}
              onChange={handleInputChange}
              placeholder="Enter client name"
            />
          </Form.Group>
          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter project description"
            />
          </Form.Group>
          {/* Stakeholders */}
          <Form.Group className="mb-3">
            <Form.Label>Stakeholders (comma separated)</Form.Label>
            <Form.Control
              type="text"
              name="stakeholders"
              value={formData.stakeholders}
              onChange={handleInputChange}
              placeholder="e.g. IT, HR, CEO"
            />
          </Form.Group>
          {/* Budget */}
          <Form.Group className="mb-3">
            <Form.Label>Budget</Form.Label>
            <Form.Control
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              placeholder="Enter budget"
            />
          </Form.Group>
          {/* Team Members */}
          <Form.Group className="mb-3">
            <Form.Label>Team Members</Form.Label>
            <Row>
              <Col md={6}>
                <div>
                  <strong>Selected Team</strong>
                  <ListGroup className="mb-2">
                    {selectedTeam.length === 0 && (
                      <ListGroup.Item>No team members selected.</ListGroup.Item>
                    )}
                    {selectedTeam.map((emp) => (
                      <ListGroup.Item
                        key={emp.id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        {emp.name} ({emp.role})
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveEmployee(emp.id)}
                        >
                          Remove
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              </Col>
              <Col md={6}>
                <div>
                  <strong>Add Employee</strong>
                  <ListGroup className="mb-2">
                    {availableEmployees.length === 0 && (
                      <ListGroup.Item>All employees are in the team.</ListGroup.Item>
                    )}
                    {availableEmployees.map((emp) => (
                      <ListGroup.Item
                        key={emp.id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        {emp.name} ({emp.role})
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleAddEmployee(emp)}
                        >
                          Add
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              </Col>
            </Row>
          </Form.Group>
          {/* Start Date */}
          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="Start_Date"
              value={formData.Start_Date}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          {/* End Date */}
          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="End_date"
              value={formData.End_date}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          {/* Status */}
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="Status"
              value={formData.Status}
              onChange={handleInputChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}