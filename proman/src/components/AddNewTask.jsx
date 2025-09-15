import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function AddNewTask({ show, onClose, onTaskAdd,employeeList }) {
  // Form data state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    assignedTo: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: '',
    files: []
  });

  // Handle modal close
  const handleClose = () => {
    setFormData({
      id: '',
      name: '',
      assignedTo: '',
      status: 'To Do',
      priority: 'Medium',
      dueDate: '',
      files: []
    });
    if (onClose) {
      onClose();
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle file uploads
  // const handleFileChange = (e) => {
  //   const files = Array.from(e.target.files).map(file => ({
  //     name: file.name,
  //     url: URL.createObjectURL(file)
  //   }));
  //   setFormData(prevData => ({
  //     ...prevData,
  //     files
  //   }));
  // };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      name: formData.name,
      assignedTo: formData.assignedTo,
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate,
      files: formData.files
    };
    if (onTaskAdd) {
      onTaskAdd(newTask);
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Task</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          
          <Form.Group className="mb-3">
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter task name"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Assigned To</Form.Label>
            <Form.Select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              required
            >
              <option value="">Select assignee</option>
              {employeeList && employeeList.map((emp, idx) => (
                <option key={emp.id || idx} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              required
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Create Task
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}