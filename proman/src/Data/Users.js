let users = [];

const listeners = [];

function notify() {
  listeners.forEach((cb) => cb(users));
}

// Update user profile
async function updateUser(userId, updatedUserData) {
  try {
    const res = await fetch(`http://localhost:3001/api/user/update/${userId}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedUserData)
    });

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
async function getUserById(userId) {
  try {
    const res = await fetch(`http://localhost:3001/api/user/get/${userId}`);
    
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
