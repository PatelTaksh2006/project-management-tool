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
      budget: "",
      team: [],
      managerId: "",
    });
    if (onClose) onClose();
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name==="End_date" && value< new Date().toISOString().split('T')[0]){
      alert("End Date cannot be in the past");
      return;
    }
    if(name==="End_date" && formData.Start_Date && value < formData.Start_Date){
      alert("End Date cannot be before Start Date");
      return;
    }
    if(name==="Start_Date" && formData.End_date && value > formData.End_date){
      alert("Start Date cannot be after End Date");
      return;
    }
    
    if(name==="budget" && Number(value)<0){
      alert("Budget cannot be negative");
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle team selection (multi-select)
  const handleTeamChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedTeam = selectedOptions.map((option) => {
      const emp = EmployeeList.find((emp) => emp._id === option.value);
      return emp
        ? { id: emp._id, name: emp.Name, role: emp.role }
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

   
    const teamMembers = formData.team.map((emp) => emp.id);
    const newProject = {
      // Id is ignored, managerId is included
      managerId: formData.managerId,
      Name: formData.Name,
      Employees: formData.team.length,
      StartDate: formData.Start_Date,
      EndDate: formData.End_date,
      Status: formData.Status,
      client: formData.client,
      description: formData.description,
      budget: Number(formData.budget) || 0,
      budgetUsed: 0,
      team: teamMembers,
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
          {/* Helper note for required fields */}
          <div role="note" style={{
            marginBottom: 12,
            fontSize: 14,
            color: '#111827',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(220,38,38,0.04)',
            padding: '6px 10px',
            borderRadius: 6
          }}>
            <span style={{ color: '#dc2626', fontWeight: 800, fontSize: 16 }} aria-hidden="true">*</span>
            <span style={{ color: '#374151' }}>Required fields are marked with a red <strong>*</strong>.</span>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Project Name<span style={{ color: '#dc2626' }}>*</span></Form.Label>
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
            <Form.Label>Start Date <span style={{ color: '#dc2626' }}>*</span></Form.Label>
            <Form.Control
              type="date"
              name="Start_Date"
              value={formData.Start_Date}
              onChange={handleInputChange}
              required
            />
          </Form.Group> 
          <Form.Group className="mb-3">
            <Form.Label>End Date <span style={{ color: '#dc2626' }}>*</span></Form.Label>
            <Form.Control
              type="date"
              name="End_date"
              value={formData.End_date}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Status <span style={{ color: '#dc2626' }}>*</span></Form.Label>
            <Form.Select
              name="Status"
              value={formData.Status}
              onChange={handleInputChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
            </Form.Select>
          </Form.Group>
          { (formData.Status=="Active" && <Form.Group className="mb-3">
            <Form.Label>Team Members</Form.Label>
            <Form.Select
              multiple
              value={formData.team.map((emp) => emp.id)}
              onChange={handleTeamChange}
            >
              {EmployeeList &&
                EmployeeList.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.EmpId}-{emp.Name}-{emp.role}
                  </option>
                ))}
            </Form.Select>
            <Form.Text className="text-muted">
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple employees.
            </Form.Text>
          </Form.Group>)}
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