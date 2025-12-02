import React, { useState } from "react";
import { useNavigate,Link, Navigate} from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const initialState = {
    EmpId:"",
  Name: "",
  Email: "",
  Password: "",
  ConfirmPassword:"",
  isManager: false,
  role: "",
  department: "",
  joiningDate: "",
  phone: "",
  address: ""
}


export default function Signup() {
    const navigate=useNavigate();

    const [form, setForm] = useState(initialState);
        const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        


  setError("");
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit =async (e) => {
    e.preventDefault();
    setError("");
        console.log(form.Password + "  " + form.ConfirmPassword);
        if (form.Password !== form.ConfirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        else if(form.phone.length!==10){
            setError("Phone number must be 10 digits long.");
            return;
        }
        else if(form.EmpId && !/^[EM]\d{5}$/.test(form.EmpId)){
            setError("Employee ID must be exactly one letter (E/M) followed by 5 digits.");
            return;
        }
        else if(form.EmpId[0]==='M' && !form.isManager){
            setError("Employee ID starting with 'M' must be for a Manager account.");
            return;
        }
        else if(form.EmpId[0]==='E' && form.isManager){
            setError("Employee ID starting with 'E' cannot be for a Manager account.");
            return;
        }
else if ((() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(form.joiningDate);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate > today;
})()) {
    setError("Joining date cannot be in the future.");
    return;
}
else if (!form.Email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) {
      setError("Please enter a valid email address.");
      return;
    }
else if(!/^[A-Za-z\s]+$/.test(form.Name))
{
    setError("Name cannot contain numbers/special characters.");
    return;
}
else if(!/^[A-Za-z\s]+$/.test(form.role))
{
    setError("Role cannot contain numbers/special characters.");
    return;
}
else if(!/^[A-Za-z\s]+$/.test(form.department))
{
    setError("Department cannot contain numbers/special characters.");
    return;
}
        // Submit form logic here (e.g., API call)
        const API = `${API_URL}/api/user/signup`;

        // Map server error codes to safe, user-facing messages
        const mapServerErrorToMessage = (data, status) => {
            if (data && data.error) {
                switch (data.error) {
                    case 'MissingFields':
                        return 'Please fill all required fields.';
                    case 'DuplicateKey':
                        return 'An account with that email/employee Id already exists.';
                    case 'ValidationError':
                        return 'Some fields are invalid. Please check your input.';
                    case 'HashingError':
                        return 'Unable to process your password. Try again later.';
                    case 'ServerConfigurationError':
                        return 'Server is not configured correctly. Try again later.';
                    case 'AuthenticationFailed':
                        return 'Incorrect credentials.';
                    case 'InternalServerError':
                    default:
                        return 'Something went wrong. Please try again later.';
                }
            }

            // Fallback by HTTP status
            if (status === 400) return 'Invalid input. Please check the form.';
            if (status === 409) return 'An account with that email already exists.';
            if (status === 500) return 'Server error. Please try again later.';
            return 'Something went wrong. Please try again.';
        };

        try {
            const res = await fetch(API, {
                method: 'POST',
                body: JSON.stringify(form),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            let data = null;
            try {
                data = await res.json();
            } catch (jsonErr) {
                // Non-JSON response
                console.error('Failed to parse signup response as JSON', jsonErr);
            }

            if (res.ok) {
                    // Successful signup — show a browser alert and reset form
                    alert('Account created successfully. Please sign in.');
                setForm(initialState);
                navigate('/');
                console.info('Signup success (server):', data);
                return;
            }

            // Not OK — map the server error to a safe frontend message
            const userMessage = mapServerErrorToMessage(data, res.status);
            setError(userMessage);

            // Keep full server response in console for debugging (do not show to users)
            console.error('Signup failed', { status: res.status, body: data });

        } catch (networkErr) {
            console.error('Network or fetch error during signup', networkErr);
            setError('Network error. Please check your connection and try again.');
            
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
                maxWidth: 500,
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
                        Create Account
                    </h2>
                    <p style={{ 
                        margin: '8px 0 0 0', 
                        color: '#6b7280', 
                        fontSize: '14px'
                    }}>
                        Join our project management platform
                    </p>
                    <div role="note" style={{
                        marginTop: '10px',
                        fontSize: '14px',
                        color: '#111827',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(220,38,38,0.04)',
                        padding: '6px 10px',
                        borderRadius: '6px'
                    }}>
                        <span style={{
                            color: '#dc2626',
                            fontWeight: 800,
                            fontSize: '16px',
                            lineHeight: '1'
                        }} aria-hidden="true">*</span>
                        <span>Required fields are marked with a red <strong>*</strong>.</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} autoComplete="off">
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>Employee ID<span style={{ color: '#dc2626' }}>*</span></label>
                        <input 
                            name="EmpId"
                            value={form.EmpId} 
                            onChange={handleChange}
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
                            onBlur={(e) => {e.target.style.borderColor = '#d1d5db';}}
                            placeholder="Enter your employee ID"
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>Name<span style={{ color: '#dc2626' }}>*</span></label>
                        <input 
                            name="Name" 
                            value={form.Name} 
                            onChange={handleChange} 
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
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>Email<span style={{ color: '#dc2626' }}>*</span></label>
                        <input 
                            name="Email" 
                            type="email" 
                            value={form.Email} 
                            onChange={handleChange} 
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
                            placeholder="Enter your email address"
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#374151',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>Password<span style={{ color: '#dc2626' }}>*</span></label>
                            <input 
                                name="Password" 
                                type="password" 
                                value={form.Password} 
                                onChange={handleChange} 
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
                                placeholder="Create password"
                            />
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#374151',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>Confirm Password<span style={{ color: '#dc2626' }}>*</span></label>
                            <input 
                                name="ConfirmPassword" 
                                type="password" 
                                value={form.ConfirmPassword} 
                                onChange={handleChange} 
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
                                placeholder="Confirm password"
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: '20px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            <input 
                                name="isManager" 
                                type="checkbox" 
                                checked={form.isManager} 
                                onChange={handleChange}
                                style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                            />
                            Manager Account
                        </label>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#374151',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>Role<span style={{ color: '#dc2626' }}>*</span></label>
                            <input 
                                name="role" 
                                value={form.role} 
                                onChange={handleChange} 
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
                                placeholder="Your job role"
                            />
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#374151',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>Department<span style={{ color: '#dc2626' }}>*</span></label>
                            <input 
                                name="department" 
                                value={form.department} 
                                onChange={handleChange} 
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
                                placeholder="Department"
                            />
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#374151',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>Joining Date<span style={{ color: '#dc2626' }}>*</span></label>
                            <input 
                                name="joiningDate" 
                                type="date" 
                                value={form.joiningDate} 
                                onChange={handleChange} 
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
                            />
                        </div>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#374151',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>Phone<span style={{ color: '#dc2626' }}>*</span></label>
                            <input 
                                name="phone" 
                                type="number"
                                value={form.phone} 
                                onChange={handleChange} 
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
                                placeholder="Phone number"
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>Address<span style={{ color: '#dc2626' }}>*</span></label>
                        <input 
                            name="address" 
                            value={form.address} 
                            onChange={handleChange} 
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
                            placeholder="Your address"
                        />
                    </div>
                    
                    
                    
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
                        Create Account
                    </button>
                    {error && (
                        <div style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                            padding: '12px',
                            borderRadius: '8px',
                            marginTop: '16px',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}
                </form>
                
                <div style={{ 
                    marginTop: '24px', 
                    textAlign: 'center',
                    paddingTop: '24px',
                    borderTop: '1px solid #e5e7eb'
                }}>
                    <Link 
                        to="/" 
                        style={{
                            color: '#4f46e5',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                        Already have an account? Sign in here
                    </Link>
                </div>
            </div>
        </div>
    );
}