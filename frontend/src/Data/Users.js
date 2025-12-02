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

let users = [];

const listeners = [];

function notify() {
  listeners.forEach((cb) => cb(users));
}

// Update user profile
async function updateUser(userId, updatedUserData, token) {
  try {
    const res = await fetch(`${API_URL}/api/user/update/${userId}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedUserData)
    });

    // Handle token validation errors
    if (await handleTokenError(res)) {
      return { success: false, error: 'Authentication failed' };
    }

    if (res.ok) {
      const data = await res.json();
      console.log('User updated successfully:', data);
      
      // Update local users array
      users = users.map(u => (u._id === userId ? data.user : u));
      notify();
      
      return { success: true, user: data.user };
    } else {
      const errorData = await res.json();
      console.error('Failed to update user:', errorData);
      return { success: false, error: errorData.message || 'Update failed' };
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: error.message };
  }
}

// Get user by ID
async function getUserById(userId, token) {
  try {
    const res = await fetch(`${API_URL}/api/user/get/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Handle token validation errors
    if (await handleTokenError(res)) {
      return null;
    }
    
    if (res.ok) {
      const data = await res.json();
      return data.user;
    } else {
      console.error('Failed to fetch user');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Subscribe to changes (for React components)
function subscribe(cb) {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

export default users;
export { updateUser, getUserById, subscribe };
