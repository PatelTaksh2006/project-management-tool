import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Cookies from 'js-cookie';

// Custom hook for token validation across the app
export const useTokenValidation = () => {
  const navigate = useNavigate();
  const { logoutUser } = useUser();

  const handleTokenError = useCallback(async (response) => {
    if (response.status === 403) {
      try {
        const data = await response.clone().json();
        if (data.message === "Invalid token") {
          // Clear tokens and logout user
          Cookies.remove('token');
          logoutUser();
          // Navigate to login using React Router
          navigate('/', { replace: true });
          return true;
        }
      } catch (err) {
        // If can't parse JSON, still handle 403 status
        Cookies.remove('token');
        logoutUser();
        navigate('/', { replace: true });
        return true;
      }
    }
    return false;
  }, [navigate, logoutUser]);

  const validateTokenAndRedirect = useCallback(async (token) => {
    if (!token) {
      logoutUser();
      navigate('/', { replace: true });
      return false;
    }

    // Additional token format validation
    try {
      // Basic JWT format check (has 3 parts separated by dots)
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('Invalid token format detected');
        Cookies.remove('token');
        logoutUser();
        navigate('/', { replace: true });
        return false;
      }

      // Check if token is expired (decode payload without verification)
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < currentTime) {
        console.warn('Token expired');
        Cookies.remove('token');
        logoutUser();
        navigate('/', { replace: true });
        return false;
      }

      return true;
    } catch (error) {
      console.warn('Token validation failed:', error);
      Cookies.remove('token');
      logoutUser();
      navigate('/', { replace: true });
      return false;
    }
  }, [navigate, logoutUser]);

  return {
    handleTokenError,
    validateTokenAndRedirect
  };
};

export default useTokenValidation;