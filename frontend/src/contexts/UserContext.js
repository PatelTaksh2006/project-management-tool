import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {useCookies} from 'react-cookie';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create the UserContext
const UserContext = createContext();

// UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [tokenInvalid, setTokenInvalid] = useState(false); // Track token validity
  const tokenValidationInterval = useRef(null);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  // Load user data from localStorage on app start
  // Monitor cookie token changes
  useEffect(() => {
    setToken(cookies.token || null);
    
    // If token is removed/changed externally, validate it
    if (cookies.token && cookies.token !== token) {
      validateToken(cookies.token);
    } else if (!cookies.token && token) {
      // Token was removed
      setTokenInvalid(true);
      logoutUser();
    }
  }, [cookies.token]);
  
  useEffect(() => {
  const init = async () => {
    if (cookies.token && !user) {
      await refreshUser();
    }
    setLoading(false);
  };
  init();
}, [token]);

  // Login function to store user and token
  const loginUser = (userData, userToken) => {
    setUser(userData);
    setCookie('token', userToken,{path:'/'});
    setToken(userToken);
    setTokenInvalid(false);
    setLoading(false);
    
    // Start periodic token validation (every 5 minutes)
    if (tokenValidationInterval.current) {
      clearInterval(tokenValidationInterval.current);
    }
    tokenValidationInterval.current = setInterval(() => {
      validateToken(userToken);
    }, 5 * 60 * 1000); // 5 minutes
  };

  // Token validation function
  const validateToken = async (tokenToValidate) => {
    if (!tokenToValidate) {
      setTokenInvalid(true);
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/api/user/validate-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenToValidate}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 403) {
        const data = await response.json().catch(() => ({}));
        if (data.message === "Invalid token") {
          console.warn('Token validation failed: Invalid token');
          setTokenInvalid(true);
          logoutUser();
          return false;
        }
      }

      if (!response.ok) {
        console.warn('Token validation failed:', response.status);
        setTokenInvalid(true);
        logoutUser();
        return false;
      }

      setTokenInvalid(false);
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      setTokenInvalid(true);
      logoutUser();
      return false;
    }
  };

  // Logout function to clear user and token
  const logoutUser = () => {
    setUser(null);
    removeCookie('token');
    setToken(null);
    setTokenInvalid(false);
    
    // Clear validation interval
    if (tokenValidationInterval.current) {
      clearInterval(tokenValidationInterval.current);
      tokenValidationInterval.current = null;
    }
  };

  // Refresh user data from backend
const refreshUser = async () => {
  try {
    if (!cookies.token) {
      console.warn("No token available. Cannot refresh user.");
      return false;
    }

    // 1. Fetch latest user from backend
    const meRes = await fetch(`${API_URL}/api/user/me`, {
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${cookies.token}`,
        "Content-Type": "application/json",
        
      },
    });
    if (!meRes.ok) {
      console.error("Failed to fetch /me:", meRes.status);
      return false;
    }
    if(meRes.status==403 && meRes.message=="Invalid token"){
      console.warn("Invalid token, user refresh failed.");
      return false;
    }


    const meData = await meRes.json();
    const currentUser = meData.user;

    if (!currentUser) {
      console.error("Invalid /me response, no user ID");
      return false;
    }

    // 2. Fetch tasks for this user
    const tasksRes = await fetch(
      `${API_URL}/api/task/getByEmployee/${currentUser._id}`,
      {
        headers: {
          "Authorization": `Bearer ${cookies.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!tasksRes.ok) {
      console.error("Failed to fetch tasks:", tasksRes.status);
      return false;
    }

    const tasksData = await tasksRes.json();

    // 3. Update user state
    const freshUser = {
      ...currentUser,
      tasks: tasksData.tasks || tasksData || [],
    };

    setUser(freshUser);
    return true;
  } catch (err) {
    console.error("refreshUser failed:", err);
    return false;
  }
};

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (tokenValidationInterval.current) {
        clearInterval(tokenValidationInterval.current);
      }
    };
  }, []);

  const value = {
    user,
    token,
    loading,
    tokenInvalid,
    loginUser,
    logoutUser,
    setUser,
    refreshUser,
    validateToken,
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
