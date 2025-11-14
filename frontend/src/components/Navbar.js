import React from "react";
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function TopNavbar({ name }) {
  const navigate = useNavigate();
  const { logoutUser } = useUser();

  const handleLogout = () => {
    logoutUser(); // Clear user data and token from context and localStorage
    navigate('/'); // Navigate to login page
  };

  return (
    <div style={{
      background: '#4f46e5',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid #3730a3'
    }}>
      <Container fluid style={{ padding: '12px 24px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%'
        }}>
          <div style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: '700',
            textDecoration: 'none'
          }}>
            📋 PM Tool
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px'
          }}>
            <span style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '14px',
              display: window.innerWidth > 576 ? 'inline' : 'none'
            }}>
              Welcome, {name}
            </span>

            <Button 
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                color: 'white',
                padding: '6px 12px',
                fontSize: '14px',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
