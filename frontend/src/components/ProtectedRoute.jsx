import React from "react";
import { Navigate, useParams, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const ProtectedRoute = ({ children, role, requireProjectAccess }) => {
  const { user, token, loading, tokenInvalid } = useUser();
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

  // Check for invalid token or missing token - redirect to login
  if (tokenInvalid || !token) {
    return <Navigate to="/" replace />;
  }

  // Not logged in at all
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Role-specific restriction
  if (role === "manager" && !user.isManager) {
    return <Navigate to="/employee" replace />;
  }

  if (role === "employee" && user.isManager) {
    return <Navigate to="/manager" replace />;
  }

  // Block direct URL access for project routes
  if (requireProjectAccess && id) {
    // Check if user navigated here programmatically (via button click)
    const navigatedProgrammatically = location.state?.fromApp === true;
    
    if (!navigatedProgrammatically) {
      // User typed URL directly or refreshed - block access
      return <Navigate to="/manager/project" replace state={{ error: "Direct URL access is not allowed. Please use the View button." }} />;
    }
  }

  // Authorized
  return children;
};

export default ProtectedRoute;
