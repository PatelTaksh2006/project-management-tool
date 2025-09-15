import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function AddNewProject({ show, onClose, onProjectAdd, EmployeeList }) {
  // Form data state
  const [formData, setFormData] = useState({
    Name: "",
    Start_Date: "",
    End_date: "",
    Status: "Active",
    client: "",
    description: "",
    stakeholders: "",
    budget: "",
    team: [],
    managerId: "",
  });

  // Handle modal close
  const handleClose = () => {
    setFormData({
      Name: "",
      Start_Date: "",
      End_date: "",
      Status: "Active",
      client: "",
      description: "",
      stakeholders: "",
      budget: "",
      team: [],
      managerId: "",
    });
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

  // Handle team selection (multi-select)
  const handleTeamChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedTeam = selectedOptions.map((option) => {
      const emp = EmployeeList.find((emp) => emp.id === Number(option.value));
      return emp
        ? { id: emp.id, name: emp.name, role: emp.role }
        : null;
    }).filter(Boolean);
    setFormData((prevData) => ({
      ...prevData,
      team: selectedTeam,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert comma-separated stakeholders to array
    const stakeholdersArr = formData.stakeholders
      ? formData.stakeholders.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const newProject = {
      // Id is ignored, managerId is included
      managerId: Number(formData.managerId),
      Name: formData.Name,
      Employees: formData.team.length,
      Start_Date: formData.Start_Date,
      End_date: formData.End_date,
      Status: formData.Status,
      client: formData.client,
      description: formData.description,
      stakeholders: stakeholdersArr,
      budget: Number(formData.budget) || 0,
      budgetUsed: 0,
      team: formData.team,
      // milestones and task are intentionally omitted
    };

    if (onProjectAdd) {
      onProjectAdd(newProject);
    }

    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Project</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          
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
          <Form.Group className="mb-3">
            <Form.Label>Team Members</Form.Label>
            <Form.Select
              multiple
              value={formData.team.map((emp) => emp.id.toString())}
              onChange={handleTeamChange}
            >
              {EmployeeList &&
                EmployeeList.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.role})
                  </option>
                ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple employees.
            </Form.Text>
          </Form.Group>
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
            Create Project
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}