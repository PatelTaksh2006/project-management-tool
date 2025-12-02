import React, { useState, useEffect } from "react";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function EditTask({ task, show, onClose, onTaskUpdate, employeeList }) {
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    assignedTo: "",
    status: "To Do",
    dueDate: "",
    files: [],
  });

  const [originalDueFormat, setOriginalDueFormat] = useState(null);

  useEffect(() => {
    if (task) {
      const toInputDate = (val) => {
        if (!val) return "";
        if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val)) return val.split("T")[0];
        if (typeof val === "string" && /^\d{2}-\d{2}-\d{4}$/.test(val)) {
          const [dd, mm, yyyy] = val.split("-");
          return `${yyyy}-${mm}-${dd}`;
        }
        const d = new Date(val);
        if (!isNaN(d)) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          return `${yyyy}-${mm}-${dd}`;
        }
        return "";
      };

      const detectFormat = (val) => {
        if (!val) return null;
        if (/^\d{2}-\d{2}-\d{4}$/.test(val)) return "dd-mm-yyyy";
        if (/^\d{4}-\d{2}-\d{2}/.test(val)) return "iso";
        return "other";
      };

      setOriginalDueFormat(detectFormat(task.dueDate));

      setFormData({
        _id: task._id || "",
        name: task.name || "",
        assignedTo:
          typeof task.assignedTo === "object" && task.assignedTo !== null
            ? task.assignedTo._id || task.assignedTo.id || ""
            : task.assignedTo || "",
        status: task.status || "To Do",
        dueDate: toInputDate(task.dueDate),
        files: Array.isArray(task.files) ? [...task.files] : [],
      });
    }
  }, [task, show]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "dueDate" && value < new Date().toISOString().split("T")[0]) {
      alert("Due Date cannot be in the past");
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🧹 Remove file from local list
  const handleRemoveFile = (idx) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== idx),
    }));
  };

  // 🧾 Submit changes
  const handleSubmit = (e) => {
    e.preventDefault();
    let outDueDate = formData.dueDate;
    if (formData.dueDate && originalDueFormat === "dd-mm-yyyy") {
      const [yyyy, mm, dd] = formData.dueDate.split("-");
      outDueDate = `${dd}-${mm}-${yyyy}`;
    }

    const updatedTask = {
      _id: formData._id,
      name: formData.name,
      assignedTo: formData.assignedTo,
      status: formData.status,
      dueDate: outDueDate,
      files: formData.files, // includes removed items
    };

    if (onTaskUpdate) onTaskUpdate(updatedTask);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Task</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Assigned To</Form.Label>
            <Form.Select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              required
              disabled={formData.status !== "To Do"}
            >
              <option value="">Select assignee</option>
              {employeeList &&
                employeeList.map((emp, idx) => {
                  if (!emp) return null;
                  const id = String(emp._id || emp.id || idx);
                  const label = (emp.Name || emp.name || id) + "-" + (emp.EmpId || "");
                  return (
                    <option key={id} value={id}>
                      {label}
                    </option>
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
              disabled={formData.status !== "To Do"}
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

          {/* 📂 File Management Section */}
          <Form.Group className="mb-3">
            <Form.Label>Attached Files</Form.Label>
            {formData.files && formData.files.length > 0 ? (
              <ListGroup>
                {formData.files.map((file, idx) => (
                  <ListGroup.Item
                    key={idx}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <a
                      href={`${API_URL}${file.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      {file.name}
                    </a>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveFile(idx)}
                      disabled={formData.status === "Completed"}
                    >
                      Remove
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="text-muted">No files attached.</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              required
              disabled={formData.status !== "To Do"}
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
