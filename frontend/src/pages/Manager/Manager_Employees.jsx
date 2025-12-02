import React, { useState, useEffect } from "react";
import { Row, Col, Container, Badge, Button, Card } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { getEmployees, subscribe } from "../../Data/Employee";
import { useUser } from "../../contexts/UserContext";

export default function Manager_Employees() {
  const { user, token } = useUser();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch employees and subscribe to changes
  useEffect(() => {
    let mounted = true;

    // Subscribe to employee changes
    const unsubscribe = subscribe((allEmployees) => {
      if (mounted && Array.isArray(allEmployees)) {
        // Filter out managers, keep only regular employees
        const nonManagerEmployees = allEmployees.filter(emp => !emp.isManager);
        setEmployees(nonManagerEmployees);
      }
    });

    // Initial fetch of employees
    const fetchEmployees = async () => {
      try {
        const fetchedEmployees = await getEmployees(token);
        if (mounted && Array.isArray(fetchedEmployees)) {
          // Filter out managers, keep only regular employees
          const nonManagerEmployees = fetchedEmployees.filter(emp => !emp.isManager);
          setEmployees(nonManagerEmployees);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();

    return () => {
      mounted = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Filter employees based on search
  useEffect(() => {
    let filtered = employees;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        (emp.Name || emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.Email || emp.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.EmpId || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
  }, [employees, searchTerm]);



  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <Navbar name="manager" />
      <Row style={{ margin: 0 }}>
        <Col md={3} style={{ padding: 0 }}>
          <Sidebar user="manager" value="employees" />
        </Col>
        <Col md={9} style={{ padding: '20px 30px' }}>
          {/* Header Section */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
            color: 'white'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '2rem', 
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  👥 Team Members
                </h2>
                <p style={{ 
                  margin: 0, 
                  fontSize: '1rem', 
                  opacity: 0.9
                }}>
                  Manage and view all employees in your organization
                </p>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{ fontSize: '1.5rem', textAlign: 'center' }}>
                  {filteredEmployees.length}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Employees</div>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151' 
              }}>
                Search Employees
              </label>
              <input
                type="text"
                placeholder="Search by name, email, or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              />
            </div>
          </div>

          {/* Employees List */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h4 style={{ 
              margin: '0 0 20px 0', 
              color: '#374151', 
              fontSize: '18px', 
              fontWeight: '600',
              paddingBottom: '12px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              Employee List ({filteredEmployees.length})
            </h4>

            {filteredEmployees.length > 0 ? (
              <div style={{ display: 'grid', gap: '16px' }}>
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px',
                      background: '#f8f9fa',
                      borderRadius: '10px',
                      border: '1px solid #e9ecef',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Employee Avatar */}
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      marginRight: '16px',
                      boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)'
                    }}>
                      {(employee.Name || employee.name || 'U').charAt(0).toUpperCase()}
                    </div>

                    {/* Employee Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <h6 style={{ 
                          margin: 0, 
                          color: '#1f2937', 
                          fontSize: '16px', 
                          fontWeight: '600'
                        }}>
                          {employee.Name || employee.name || 'Unknown'}
                        </h6>
                        <Badge bg="primary" style={{ fontSize: '11px' }}>
                          {employee.EmpId || 'N/A'}
                        </Badge>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '14px', color: '#6b7280' }}>
                          📧 {employee.Email || employee.email || 'N/A'}
                        </span>
                        {employee.phone && (
                          <span style={{ fontSize: '14px', color: '#6b7280' }}>
                            📱 {employee.phone}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {employee.role && (
                          <Badge bg="success" style={{ fontSize: '11px' }}>
                            {employee.role}
                          </Badge>
                        )}
                        {employee.department && (
                          <Badge bg="info" style={{ fontSize: '11px' }}>
                            {employee.department}
                          </Badge>
                        )}
                        {employee.joiningDate && (
                          <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                            Joined: {new Date(employee.joiningDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#9ca3af'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>👥</div>
                <h4 style={{ margin: '0 0 8px 0', color: '#6b7280' }}>No Employees Found</h4>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  {searchTerm 
                    ? "Try adjusting your search term" 
                    : "No employees have been added yet"}
                </p>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}
