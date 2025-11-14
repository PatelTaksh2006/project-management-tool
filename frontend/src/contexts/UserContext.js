import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create the UserContext
const UserContext = createContext();

// UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Load user data from localStorage on app start
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('userData');

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('userData');
      }
    }
    
    // Mark loading as complete
    setLoading(false);

    // Listen for storage changes in other tabs
    const handleStorageChange = (e) => {
      // Only handle changes to our specific keys
      if (e.key === 'token' || e.key === 'userData') {
        console.log('Storage changed in another tab:', e.key);
        
        // If token is removed, user logged out in another tab
        if (e.key === 'token' && !e.newValue) {
          console.log('User logged out in another tab');
          setUser(null);
          setToken(null);
          // Force redirect to login
          window.location.href = '/';
        }
        
        // If userData changed, update it
        if (e.key === 'userData' && e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (error) {
            console.error('Error parsing updated user data:', error);
          }
        }
      }
    };

    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Login function to store user and token
  const loginUser = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  // Logout function to clear user and token
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  };

  // Refresh user data from backend
  const refreshUser = async () => {
    // Get current values from localStorage to avoid stale closure values
    const currentToken = token || localStorage.getItem('token');
    const currentUserStr = localStorage.getItem('userData');
    
    if (!currentUserStr || !currentToken) {
      console.warn('Cannot refresh user: no user data or token in storage');
      return false;
    }

    let currentUser;
    try {
      currentUser = JSON.parse(currentUserStr);
    } catch (e) {
      console.error('Failed to parse user data from localStorage');
      return false;
    }

    if (!currentUser?._id) {
      console.warn('Cannot refresh user: no user ID found');
      return false;
    }

    try {
      console.log(`Fetching fresh tasks for employee ID: ${currentUser._id}`);
      
      // Fetch fresh tasks for this employee
      const tasksRes = await fetch(`${API_URL}/api/task/getByEmployee/${currentUser._id}`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        console.log('Fresh tasks received:', tasksData);
        
        // Update user object with fresh tasks
        const freshUserData = {
          ...currentUser,
          tasks: tasksData.tasks || tasksData || []
        };
        
        setUser(freshUserData);
        localStorage.setItem('userData', JSON.stringify(freshUserData));
        console.log('User data refreshed successfully, tasks count:', freshUserData.tasks.length);
        return true;
      } else {
        const errorText = await tasksRes.text();
        console.error('Failed to refresh tasks:', tasksRes.status, errorText);
        return false;
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return false;
    }
  };

  const value = {
    user,
    token,
    loading,
    loginUser,
    logoutUser,
    setUser,
    refreshUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
