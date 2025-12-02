import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, ListGroup } from "react-bootstrap";
import { getEmployees } from "../Data/Employee";
import { useUser } from "../contexts/UserContext";

export default function EditProject({
  project,
  show,
  onClose,
  onProjectUpdate,
  
}) {
  const { token } = useUser();
  // All employees in the system
  const [allEmployees, setAllEmployees] = useState([]);

  // Load employees when component mounts
  useEffect(() => {
    const loadEmployees = async () => {
      const employees = await getEmployees(token);
      setAllEmployees(employees);
    };
    loadEmployees();
  }, []);

  // Initialize form data with the project prop
  const [formData, setFormData] = useState({
    _id: "",
    Name: "",
    StartDate: "",
    EndDate: "",
    Status: "Active",
    client: "",
    description: "",
    budget: "",
    team: [],
  });

  // Selected team (employees in this project)
  const [selectedTeam, setSelectedTeam] = useState([]);

  // Employees not in the team
  const [availableEmployees, setAvailableEmployees] = useState([]);

  // Helper to normalize dates to YYYY-MM-DD
  const normalizeDate = (d) => {
    if (!d) return "";
    const dateObj = new Date(d);
    if (isNaN(dateObj)) return "";
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Store original team objects from the incoming project so we can revert when needed
  const [originalTeam, setOriginalTeam] = useState([]);

  // Update form data and employee lists when project prop changes
  useEffect(() => {
    if (project) {
      // project.team may be an array of IDs or an array of member objects
      const rawTeam = project.team || [];
      const teamIds = rawTeam.map(t => (t && typeof t === 'object') ? (t._id || t.id) : t);
      const teamObjs = allEmployees.filter(emp => teamIds.includes(emp._id));

      setFormData({
        ...project,
        StartDate: normalizeDate(project.StartDate || project.Start_Date || project.StartDate),
        EndDate: normalizeDate(project.EndDate || project.End_date || project.EndDate),
        team: teamObjs,
      });
      setSelectedTeam(teamObjs);
      setOriginalTeam(teamObjs);
    }
  }, [project, show, allEmployees]);

  // Determine lock condition: whenever the form status is 'Completed', lock all fields except Status

  // When status becomes 'Completed', immediately revert editable fields and team back to original project values
  // useEffect(() => {
  //   if (formData.Status === 'Completed' && project) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       Name: project.Name,
  //       client: project.client,
  //       description: project.description,
  //       budget: project.budget || prev.budget,
  //       StartDate: normalizeDate(project.StartDate || project.Start_Date || project.StartDate),
  //       EndDate: normalizeDate(project.EndDate || project.End_date || project.EndDate),
  //     }));
  //     // revert selected team to original
  //     setSelectedTeam(originalTeam);
  //   }
  // }, [formData.Status, project, originalTeam]);


  // Update available employees whenever selectedTeam changes
  useEffect(() => {
    const selectedIds = new Set(selectedTeam.map((emp) => emp._id));
    setAvailableEmployees(
      allEmployees.filter((emp) => !selectedIds.has(emp._id))
    );
  }, [selectedTeam, allEmployees]);

  // Handle modal close
  const handleClose = () => {
    setFormData({
      Id: "",
      Name: "",
      StartDate: "",
      EndDate: "",
      Status: "Active",
      client: "",
      description: "",
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
    if(name==="Status" && value === "Completed"){
      if(project.tasks.find(t => t.status !== "Completed")){
        alert("Cannot mark project as Completed while there are incomplete tasks.");
        return;
      }
    }
    if(name==="EndDate" && value< new Date().toISOString().split('T')[0]){
      alert("End Date cannot be in the past");
      return;
    }
    if(name==="EndDate" && formData.StartDate && value < formData.StartDate){
      alert("End Date cannot be before Start Date");
      return;
    }
    if(name==="StartDate" && formData.EndDate && value > formData.EndDate){
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

  // Add employee to team
  const handleAddEmployee = (emp) => {
    if (formData.Status !== 'Active') return; // ignore when not active
    setSelectedTeam((prev) => [...prev, emp]);
  };

  // Remove employee from team
  const handleRemoveEmployee = (empId) => {
    if (formData.Status !== 'Active') return; // ignore when not active
    setSelectedTeam((prev) => prev.filter((emp) => emp._id !== empId));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();


// If project is not Active, preserve the original team (don't apply UI changes)
let teamMembers;
if (formData.Status !== 'Active' && project && project.team) {
  // preserve existing team ids from project
  const rawTeam = project.team || [];
  teamMembers = rawTeam.map(t => (t && typeof t === 'object') ? (t._id || t.id) : t);
} else {
  teamMembers = selectedTeam.map(emp => emp._id);
}

const updatedProject = {
    ...project,
    _id: formData._id,
    Name: formData.Name,
    Employees: selectedTeam.length,
    StartDate: formData.StartDate,
    EndDate: formData.EndDate,
    Status: formData.Status,
    client: formData.client,
    description: formData.description,
    budget: Number(formData.budget) || 0,
    team: teamMembers,   // <--- only IDs go to backend
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
      <Form onSubmit={handleSubmit} >
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
              disabled={formData.Status !== 'Pending'}
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
              disabled={formData.Status !== 'Pending'}
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
              disabled={formData.Status === 'Completed'}
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
              disabled={formData.Status !== "Pending" }
            />
          </Form.Group>
          
          {/* Start Date */}
          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="StartDate"
              value={formData.StartDate}
              onChange={handleInputChange}
              required
              disabled={formData.Status !== 'Pending'}
            />
          </Form.Group>
          {/* End Date */}
          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="EndDate"
              value={formData.EndDate}
              onChange={handleInputChange}
              required
              disabled={formData.Status === 'Completed'}
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
          {formData.Status !== "Active" && (
            <span>This project is not active. Team changes are not allowed.</span>
          )}
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
                        key={emp._id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        {emp.Name} ({emp.role})
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveEmployee(emp._id)}
                          disabled={formData.Status !== "Active"}
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
                        key={emp._id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        {emp.Name} ({emp.role})
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleAddEmployee(emp)}
                          disabled={formData.Status !== "Active"}
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