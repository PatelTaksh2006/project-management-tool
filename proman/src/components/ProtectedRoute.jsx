import React from "react";
import { Navigate, useParams, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const ProtectedRoute = ({ children, role, requireProjectAccess }) => {
  const { user, token, loading } = useUser();
  const { id } = useParams(); // Get project ID from URL if present
  const location = useLocation();

  // Wait for loading to complete before checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Not logged in at all
  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  // Role-specific restriction
  if (role === "manager" && !user.isManager) {
    return <Navigate to="/employee" replace />;
  }

  if (role === "employee" && user.isManager) {
    return <Navigate to="/manager" replace />;
  }

  // Project access validation for manager routes with project ID
  if (requireProjectAccess && id && role === "manager") {
    const hasAccess = user.project?.some(project => 
      project._id === id || project.id === id
    );
    
    if (!hasAccess) {
      // Redirect to projects page with error message
      return <Navigate to="/manager/project" replace  />;
    }
  }

  // Authorized
  return children;
};

export default ProtectedRoute;
