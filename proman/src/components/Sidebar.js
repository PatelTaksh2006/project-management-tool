import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ user, value, id_name }) {
  const base_path = user === "manager" ? "/manager" : "/employee";

  const isActive = (key) => (value || "").toLowerCase() === key;

  const linkStyle = (active) => ({
    display: 'block',
    padding: '12px 16px',
    marginBottom: '8px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    background: active ? '#4f46e5' : 'transparent',
    color: active ? 'white' : '#374151',
    border: active ? 'none' : '1px solid transparent'
  });

  const linkHoverStyle = {
    background: '#f3f4f6',
    color: '#1f2937'
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: 240, 
      minHeight: '100vh',
      background: 'white',
      borderRight: '1px solid #e5e7eb',
      padding: '24px 20px'
    }}>
      <div style={{ 
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#374151'
        }}>
          🧭 Navigation
        </h3>
        {id_name && (
          <p style={{ 
            margin: '8px 0 0 0', 
            fontSize: '14px', 
            color: '#6b7280'
          }}>
            {id_name}
          </p>
        )}
      </div>
      
      <nav style={{ flex: 1 }}>
        <Link
          to={base_path}
          style={linkStyle(isActive("dashboard"))}
          onMouseEnter={(e) => {
            if (!isActive("dashboard")) {
              Object.assign(e.target.style, linkHoverStyle);
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive("dashboard")) {
              e.target.style.background = 'transparent';
              e.target.style.color = '#374151';
            }
          }}
        >
          📊 Dashboard
        </Link>

        {user === "manager" && (
          <Link
            to={`${base_path}/project`}
            style={linkStyle(isActive("project"))}
            onMouseEnter={(e) => {
              if (!isActive("project")) {
                Object.assign(e.target.style, linkHoverStyle);
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive("project")) {
                e.target.style.background = 'transparent';
                e.target.style.color = '#374151';
              }
            }}
          >
            📁 Projects
          </Link>
        )}
        {user==="manager" && (
          <Link
            to={`${base_path}/employees`}
            style={linkStyle(isActive("employees"))}
            onMouseEnter={(e) => {
              if (!isActive("employees")) {
                Object.assign(e.target.style, linkHoverStyle);
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive("employees")) {
                e.target.style.background = 'transparent';
                e.target.style.color = '#374151';
              }
            }}
          >
            👥 Employees
          </Link>
        )}
        {user === "employee" && (
          <Link
            to={`${base_path}/tasks`}
            style={linkStyle(isActive("task"))}
            onMouseEnter={(e) => {
              if (!isActive("task")) {
                Object.assign(e.target.style, linkHoverStyle);
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive("task")) {
                e.target.style.background = 'transparent';
                e.target.style.color = '#374151';
              }
            }}
          >
            ✅ Tasks
          </Link>
        )}
        
      </nav>
    </div>
  );
}
