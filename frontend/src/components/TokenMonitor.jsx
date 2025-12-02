import { useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useTokenValidation } from '../hooks/useTokenValidation';
import Cookies from 'js-cookie';

// Global token monitor component
const TokenMonitor = () => {
  const { user, token, logoutUser } = useUser();
  const { validateTokenAndRedirect } = useTokenValidation();

  // Monitor token changes and validate
  useEffect(() => {
    const checkToken = () => {
      const currentToken = Cookies.get('token');
      
      // If user is logged in but token is missing from cookies
      if (user && !currentToken) {
        console.warn('Token removed from cookies, logging out user');
        logoutUser();
        return;
      }

      // If token exists, validate its format and expiration
      if (currentToken && user) {
        validateTokenAndRedirect(currentToken);
      }
    };

    // Check token immediately
    checkToken();

    // Set up periodic token checking (every 30 seconds)
    const interval = setInterval(checkToken, 30000);

    // Set up storage event listener for cross-tab token monitoring
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.storageArea === localStorage) {
        checkToken();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Monitor cookie changes by polling
    let lastToken = Cookies.get('token');
    const cookieMonitor = setInterval(() => {
      const currentToken = Cookies.get('token');
      if (currentToken !== lastToken) {
        console.log('Cookie token changed, validating...');
        lastToken = currentToken;
        checkToken();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(cookieMonitor);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, token, logoutUser, validateTokenAndRedirect]);

  // Monitor for manual token alterations
  useEffect(() => {
    if (!token || !user) return;

    const checkTokenIntegrity = async () => {
      try {
        // Make a test API call to validate token
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/user/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 403) {
          const data = await response.json().catch(() => ({}));
          if (data.message === "Invalid token") {
            console.warn('Token integrity check failed, logging out');
            logoutUser();
          }
        }
      } catch (error) {
        console.warn('Token integrity check error:', error);
      }
    };

    // Check token integrity every 2 minutes
    const integrityInterval = setInterval(checkTokenIntegrity, 2 * 60 * 1000);

    return () => clearInterval(integrityInterval);
  }, [token, user, logoutUser]);

  return null; // This component doesn't render anything
};

export default TokenMonitor;