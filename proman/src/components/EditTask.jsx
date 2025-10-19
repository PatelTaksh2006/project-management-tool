import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function EditTask({ task, show, onClose, onTaskUpdate, employeeList }) {
  // Initialize form data with the task prop
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    assignedTo: "",
    status: "To Do",
    dueDate: "",
    files: [],
  });

  // Update form data when task prop changes
  useEffect(() => {
    if (task) {
      // helpers to normalize and detect formats
      const toInputDate = (val) => {
        if (!val) return "";
        // If already ISO-like (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)
        if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val)) {
          return val.split('T')[0];
        }
        // If dd-mm-yyyy
        if (typeof val === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(val)) {
          const [dd, mm, yyyy] = val.split('-');
          return `${yyyy}-${mm}-${dd}`;
        }
        // Try Date parse
        const d = new Date(val);
        if (!isNaN(d)) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        }
        return "";
      };

      const detectFormat = (val) => {
        if (!val) return null;
        if (typeof val === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(val)) return 'dd-mm-yyyy';
        if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val)) return 'iso';
        return 'other';
      };

      const detected = detectFormat(task.dueDate);
      setOriginalDueFormat(detected);

      setFormData({
        _id: task._id || "",
        name: task.name || "",
        // Normalize assignedTo to an id string when possible so the select can match
        assignedTo: (typeof task.assignedTo === 'object' && task.assignedTo !== null)
          ? (task.assignedTo._id || task.assignedTo.id || task.assignedTo.Name || task.assignedTo.name || "")
          : (task.assignedTo || ""),
        status: task.status || "To Do",
        dueDate: toInputDate(task.dueDate),
        files: task.files || [],
      });
    }
  }, [task, show]);

  // remember original due date format so we can preserve it on submit
  const [originalDueFormat, setOriginalDueFormat] = useState(null);

  // Handle modal close
  const handleClose = () => {
    setFormData({
      _id: "",
      name: "",
      assignedTo: "",
      status: "To Do",
      dueDate: "",
      files: [],
    });
    if (onClose) onClose();
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name==="dueDate" && value < new Date().toISOString().split('T')[0]){
      alert("Due Date cannot be in the past");
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
    // Convert dueDate back to original format when possible
    let outDueDate = formData.dueDate;
    if (formData.dueDate && originalDueFormat === 'dd-mm-yyyy') {
      const [yyyy, mm, dd] = formData.dueDate.split('-');
      outDueDate = `${dd}-${mm}-${yyyy}`;
    }

    const updatedTask = {
      _id: formData._id,
      name: formData.name,
      assignedTo: formData.assignedTo,
      status: formData.status,
      dueDate: outDueDate,
      files: formData.files
    };
    if (onTaskUpdate) {
      onTaskUpdate(updatedTask);
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Task</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* <Form.Group className="mb-3">
            <Form.Label>Task ID</Form.Label>
            <Form.Control
              type="text"
              name="_id"
              value={formData._id}
              onChange={handleInputChange}
              placeholder="Enter task ID"
              required
              disabled // Usually ID is not editable
            />
          </Form.Group> */}
          <Form.Group className="mb-3">
            <Form.Label>Assigned To</Form.Label>
            <Form.Select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              required
              disabled={formData.status!=="To Do"}
            >
              <option value="">Select assignee</option>
              {employeeList && employeeList.map((emp, idx) => {
                if (!emp) return null;
                if (typeof emp === 'string' || typeof emp === 'number') {
                  const val = String(emp);
                  return (
                    <option key={val + idx} value={val}>{val}</option>
                  );
                }
                // Normalize employee id and label so it matches the formData.assignedTo value
                const id = String(emp._id || emp.id || emp.Name || emp.name || idx);
                const label = emp.Name || emp.name || id;
                return (
                  <option key={id} value={id}>{label}</option>
                );
              })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter task name"
              required
              disabled={formData.status!=="To Do"}
            />
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
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              required
              disabled={formData.status!=="To Do"}
            />
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