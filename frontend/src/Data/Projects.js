import { Nav } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Helper function to handle token validation and navigation
const handleTokenError = async (response) => {
  if (response.status === 403) {
    try {
      const data = await response.clone().json();
      if (data.message === "Invalid token") {
        // Clear any stored tokens/user data
        Cookies.remove('token');
        // Redirect to login page
        Navigate('/');
        return true;
      }
    } catch (err) {
      // If can't parse JSON, still handle 403 status
      Cookies.remove('token');
      Navigate('/');
      return true;
    }
  }
  return false;
};

let projects = [
];

const listeners = [];

function notify() {
  listeners.forEach((cb) => cb(projects));
}
// Subscribe to changes (for React components)
function subscribe(cb) {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx > -1) listeners.splice(idx, 1);
  };
}
async function Add(newProject, token) {
  try {
    const res = await fetch(`${API_URL}/api/project/add`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newProject)
    });
    
    // Handle token validation errors
    if (await handleTokenError(res)) {
      return false;
    }
    
    if (!res.ok) {
      console.error('Failed to delete project:', res.status, res.statusText);
      return false;
    }
    
    await getProjects(newProject.managerId, token);
    notify();
    return true;
  } catch (error) {
    console.error('Error adding project:', error);
    return false;
  }
}

async function update(updatedProject, token) {
  try {
    const res = await fetch(`${API_URL}/api/project/update`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedProject)
    });
    
    // Handle token validation errors
    if (await handleTokenError(res)) {
      return false;
    }
    
    if (!res.ok) {
      console.error('Failed to update project:', res.status, res.statusText);
      return false;
    }
    
    await getProjects(updatedProject.managerId, token);
    notify();
    return true;
  } catch (error) {
    console.error('Error updating project:', error);
    return false;
  }
}

async function del(projectId, managerId, token) {
  // Optimistically remove locally so UI updates immediately
  projects = projects.filter((p) => p._id !== projectId);
  
  try {
    const res = await fetch(`${API_URL}/api/project/delete`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ _id: projectId })
    });
    
    // Handle token validation errors
    if (await handleTokenError(res)) {
      return false;
    }
    
    if (!res.ok) {
      console.error('Failed to delete project:', res.status, res.statusText);
      return false;
    }
    
  } catch (err) {
    console.error('Error deleting project:', err);
  }
  
  // Re-fetch projects for the same manager (if provided) to keep local store consistent
  await getProjects(managerId, token);
  notify();
  return true;
}



// Get the latest projects (for React state initialization)
async function getProjects(managerId, token) {
  console.log("token in getProjects:", token);  
  try {
    const res = await fetch(`${API_URL}/api/project/getAll?managerId=${managerId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    // Handle token validation errors
    if (await handleTokenError(res)) {
      projects = [];
      notify();
      return projects;
    }
    
    if (res.ok) {
      const data = await res.json();
      // Handle different response structures
      projects = data.projects || data || [];
      notify();
    } else {
      console.error('Failed to fetch projects:', res.status, res.statusText);
      projects = [];
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    projects = [];
  }
  return projects;
}

export default projects;
export { Add, update, del, subscribe, getProjects };