import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

const Login = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!Email || !Password) {
      setError("Please enter both Email and Password.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/user/login", {
        method: "POST",
        body: JSON.stringify({ Email, Password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Login success:", data);
        
        // Store user and token in context
        loginUser(data.user, data.token);

        // Navigate based on user role
        if (data.user.isManager === true) {
          navigate("/manager");
        } else if (data.user.isManager === false) {
          navigate("/employee");
        } else {
          setError("Unknown user role");
        }
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };    

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: 420,
        width: '100%',
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            margin: '0 0 8px 0', 
            color: '#4f46e5', 
            fontSize: '28px', 
            fontWeight: '700'
          }}>
            📋 PM Tool
          </h1>
          <h2 style={{ 
            margin: 0, 
            color: '#374151', 
            fontSize: '20px', 
            fontWeight: '600'
          }}>
            Welcome Back
          </h2>
          <p style={{ 
            margin: '8px 0 0 0', 
            color: '#6b7280', 
            fontSize: '14px'
          }}>
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              placeholder="Enter your email"
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Password
            </label>
            <input
              type="password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
              placeholder="Enter your password"
            />
          </div>
          
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            style={{
              width: '100%',
              background: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = '#4338ca'}
            onMouseLeave={(e) => e.target.style.background = '#4f46e5'}
          >
            Sign In
          </button>
        </form>
        
        <div style={{ 
          marginTop: '24px', 
          textAlign: 'center',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <span style={{ color: '#6b7280', fontSize: '14px' }}>
            Don't have an account? 
          </span>
          <a 
            href="/signup" 
            style={{
              color: '#4f46e5',
              textDecoration: 'none',
              fontWeight: '500',
              marginLeft: '4px'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            Sign up here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
