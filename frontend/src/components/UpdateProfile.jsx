import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { updateUser } from "../Data/Users";
import { useUser } from "../contexts/UserContext";

export default function UpdateProfile({ show, onClose, currentUser }) {
  const { loginUser, token } = useUser();
  const [formData, setFormData] = useState({
    EmpId: "",
    Name: "",
    Email: "",
    phone: "",
    department: "",
    role: "",
    joiningDate: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (currentUser) {
      setFormData({
        EmpId: currentUser.EmpId || "",
        Name: currentUser.Name || currentUser.name || "",
        Email: currentUser.Email || "",
        phone: currentUser.phone || "",
        department: currentUser.department || "",
        role: currentUser.role || "",
        joiningDate: currentUser.joiningDate ? 
          currentUser.joiningDate.split('T')[0] : ""
      });
      setError("");
      setValidationErrors({});
    }
  }, [currentUser, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    setValidationErrors(prev => ({
      ...prev,
      [name]: ""
    }));
    setError("");
  };

  const validateForm = () => {
    const errors = {};

    // EmpId validation - must be E or M followed by 5 digits
    if (formData.EmpId && !/^[EM]\d{5}$/.test(formData.EmpId)) {
      errors.EmpId = "Employee ID must be exactly one letter (E/M) followed by 5 digits.";
    }

    // EmpId Manager check - if starts with M, user must be a manager
    if (formData.EmpId && formData.EmpId[0] === 'M' && !currentUser?.isManager) {
      errors.EmpId = "Employee ID starting with 'M' must be for a Manager account.";
    }

    // EmpId Employee check - if starts with E, user cannot be a manager
    if (formData.EmpId && formData.EmpId[0] === 'E' && currentUser?.isManager) {
      errors.EmpId = "Employee ID starting with 'E' cannot be for a Manager account.";
    }

    // Name validation - no numbers or special characters
    if (!/^[A-Za-z\s]+$/.test(formData.Name)) {
      errors.Name = "Name cannot contain numbers or special characters.";
    }

    // Email validation (basic)
    if (!formData.Email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      errors.Email = "Please enter a valid email address.";
    }

    // Phone validation - must be 10 digits
    if (formData.phone && formData.phone.length !== 10) {
      errors.phone = "Phone number must be exactly 10 digits.";
    }

    // Role validation - no numbers or special characters
    if (formData.role && !/^[A-Za-z\s]+$/.test(formData.role)) {
      errors.role = "Role cannot contain numbers or special characters.";
    }

    // Department validation - no numbers or special characters
    if (formData.department && !/^[A-Za-z\s]+$/.test(formData.department)) {
      errors.department = "Department cannot contain numbers or special characters.";
    }

    // Joined Date validation - cannot be in the future
    if (formData.joiningDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.joiningDate);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        errors.joiningDate = "Joining date cannot be in the future.";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Map server error codes to user-friendly messages
  const mapServerErrorToMessage = (data, status) => {
    if (data && data.error) {
      switch (data.error) {
        case 'ValidationError':
          return data.details || 'Some fields are invalid. Please check your input.';
        case 'DuplicateKey':
          return 'An account with that email already exists.';
        case 'InternalServerError':
        default:
          return 'Something went wrong. Please try again later.';
      }
    }

    // Fallback by HTTP status
    if (status === 400) return 'Invalid input. Please check the form.';
    if (status === 404) return 'User not found.';
    if (status === 409) return 'An account with that email already exists.';
    if (status === 500) return 'Server error. Please try again later.';
    return 'Something went wrong. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Frontend validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await updateUser(currentUser._id, formData, token);
      
      if (result.success) {
        // Update user context with fresh data from server
        const updatedUser = {
          ...currentUser,
          ...result.user
        };
        loginUser(updatedUser, token);
        
        alert("Profile updated successfully!");
        onClose();
      } else {
        // Handle backend errors
        const userMessage = mapServerErrorToMessage(
          { error: result.error }, 
          result.status || 500
        );
        setError(userMessage);
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error("Update profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Employee ID <span style={{ color: '#dc2626' }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="EmpId"
              value={formData.EmpId}
              onChange={handleChange}
              required
              isInvalid={!!validationErrors.EmpId}
              placeholder="e.g., E12345 or M12345"
              maxLength={6}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.EmpId}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Must be E (Employee) or M (Manager) followed by 5 digits
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Name <span style={{ color: '#dc2626' }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              required
              isInvalid={!!validationErrors.Name}
              placeholder="Enter your full name"
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.Name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Email <span style={{ color: '#dc2626' }}>*</span>
            </Form.Label>
            <Form.Control
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              isInvalid={!!validationErrors.Email}
              placeholder="Enter your email address"
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.Email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Phone <span style={{ color: '#dc2626' }}>*</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              isInvalid={!!validationErrors.phone}
              placeholder="10-digit phone number"
              maxLength={10}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.phone}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Must be exactly 10 digits
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Department <span style={{ color: '#dc2626' }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              isInvalid={!!validationErrors.department}
              placeholder="Enter department name"
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.department}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Role <span style={{ color: '#dc2626' }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              isInvalid={!!validationErrors.role}
              placeholder="Enter your job role"
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.role}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Joined Date <span style={{ color: '#dc2626' }}>*</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              isInvalid={!!validationErrors.joiningDate}
            />
            <Form.Control.Feedback type="invalid">
              {validationErrors.joiningDate}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              Cannot be in the future
            </Form.Text>
          </Form.Group>

          <div className="d-flex gap-2 justify-content-end mt-4">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
