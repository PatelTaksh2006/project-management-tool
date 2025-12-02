import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
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

let tasks = [];
const listeners = [];

function notify() {
  listeners.forEach((cb) => cb(tasks));
}


// Subscribe to changes (for React components)
function subscribe(cb) {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

// Get the latest tasks for a project (from backend)
async function getTasks(projectId, token) {
  try {
    const res = await fetch(`${API_URL}/api/task/getAll?projectId=${projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Handle token validation errors
    if (await handleTokenError(res)) {
      tasks = [];
      notify();
      return tasks;
    }
    
    if (res.ok) {
      const data = await res.json();
      // normalize response to an array of tasks
        const raw = Array.isArray(data.tasks) ? data.tasks : Array.isArray(data) ? data : [];
        // Use server-populated task objects directly (assumed to include assigned user)
        tasks = raw;
      notify();
    } else {
      console.error("Failed to fetch tasks:", res.status, res.statusText);
      tasks = [];
    }
  } catch (err) {
    console.error("Error fetching tasks:", err);
    tasks = [];
  }
  return tasks;
}

// Get tasks assigned to a specific employee
async function getEmployeeTasks(employeeId, token) {
  try {
    console.log('Fetching tasks for employee:', employeeId);
    const res = await fetch(`${API_URL}/api/task/getByEmployee/${employeeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Handle token validation errors
    if (await handleTokenError(res)) {
      tasks = [];
      notify();
      return tasks;
    }
    
    if (res.ok) {
      const data = await res.json();
      const raw = Array.isArray(data.tasks) ? data.tasks : Array.isArray(data) ? data : [];
      tasks = raw;  
      notify();
      console.log('Fetched tasks for employee:', tasks);
      return tasks;
    } else {
      console.error('Failed to fetch employee tasks:', res.status, res.statusText);
      tasks = [];
    }
  } catch (err) {
    console.error('Error fetching employee tasks:', err);
    tasks = [];
  }
  return tasks;
}

async function Add(newTask, token) {
  try {
    const res = await fetch(`${API_URL}/api/task/add`, {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newTask),
    });
    
    // Handle token validation errors
    if (await handleTokenError(res)) {
      return false;
    }
    
    if (!res.ok) {
      console.error('Failed to add task:', res.status, res.statusText);
      return false;
    }
    
    // refresh tasks for the project
    await getTasks(newTask.projectId, token);
    return true;
  } catch (err) {
    console.error("Error adding task:", err);
    return false;
  }
}

async function update(updatedTask, token) {
  try {
    const response = await fetch(`${API_URL}/api/task/update`, {
      method: "PUT",
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedTask),
    });

    // Handle token validation errors
    if (await handleTokenError(response)) {
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      alert(`❌ Failed to Update Task!\n\n${errorData.error || 'An unexpected error occurred. Please try again.'}`);
      // Don't refresh - task was not updated
      throw new Error(errorData.error || 'Update failed'); // Throw error to trigger catch block in caller
    }
    
    // Parse the response to check for flagForEnonet
    const data = await response.json();
    if (data.flagForEnonet) {
      alert('⚠️ File Not Found!\n\nThe file you are trying to delete was not found on the server. It may have already been deleted.\n\nThe task has been updated, but the file could not be removed from disk.');
    } 
    
    // refresh tasks for the project only after successful update
    await getTasks(updatedTask.projectId, token);
  } catch (err) {
    // Re-throw API errors
    if (err.message === 'Update failed') {
      throw err; // Re-throw to caller
    }
    console.error("Failed to update task:", err);
    alert('❌ Network Error!\n\nCould not connect to the server. Please check your internet connection and try again.');
    throw err; // Throw to trigger catch block in caller
  }
}

async function del(taskId, projectId, token) {
  try {
    const res = await fetch(`${API_URL}/api/task/delete`, {
      method: "DELETE",
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id: taskId }),
    });
    
    // Handle token validation errors
    if (await handleTokenError(res)) {
      return false;
    }
    
    if (!res.ok) {
      console.error('Failed to delete task:', res.status, res.statusText);
      return false;
    }
    
    await getTasks(projectId, token);
    return true;
  } catch (err) {
    console.error("Error deleting task:", err);
    return false;
  }
}

export default tasks;
export { getTasks, getEmployeeTasks, subscribe, Add, update, del };