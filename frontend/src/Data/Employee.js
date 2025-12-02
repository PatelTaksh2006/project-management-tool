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

let employees = [
];

const listeners = [];

function notify() {
  listeners.forEach((cb) => cb(employees));
}

async function Add(newEmployee, token) {
  try {
    const res = await fetch(`${API_URL}/api/emp/add`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newEmployee)
    });
    
    // Handle token validation errors
    if (await handleTokenError(res)) {
      return false;
    }
    
    if (res.ok) {
      employees.push(newEmployee);
      notify();
      return true;
    } else {
      console.error('Failed to add employee:', res.status, res.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error adding employee:', error);
    return false;
  }
}

function update(updatedEmployee) {
  employees = employees.map(e => (e._id === updatedEmployee._id ? updatedEmployee : e));
  notify();
}

function del(employeeId) {
  employees = employees.filter((e) => e._id !== employeeId);
  notify();
}



// Subscribe to changes (for React components)
function subscribe(cb) {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

// Get the latest employees (for React state initialization)
async function getEmployees(token) {
  try {
    const res = await fetch(`${API_URL}/api/emp/getAll`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Handle token validation errors
    if (await handleTokenError(res)) {
      employees = [];
      notify();
      return employees;
    }
    
    if (res.ok) {
      const data = await res.json();
      employees = data.emps || [];
      notify();
    } else {
      console.error('Failed to fetch employees:', res.status, res.statusText);
      employees = [];
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
    employees = [];
  }
  return employees;
}

export default employees;
export { Add, update, del, subscribe, getEmployees };