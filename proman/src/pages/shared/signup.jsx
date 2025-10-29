import React, { useState } from "react";
import { useNavigate,Link} from "react-router-dom";
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
            // const navigate=useNavigate();

    const [form, setForm] = useState(initialState);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
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
        // Submit form logic here (e.g., API call)
        const res=await fetch('http://localhost:3001/api/user/signup',{
            method:'POST',
            body:JSON.stringify(form),
            headers:{
                'Content-Type':'application/json'
            }
        });

        if(res.ok)
        {
            res.json().then(data=>{
                console.log(data);
            });

        }
        
        alert("Signup successful!");
        setForm(initialState);
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
                </div>

                <form onSubmit={handleSubmit} autoComplete="off">
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>Employee ID</label>
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
                            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                        }}>Name</label>
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
                        }}>Email</label>
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
                            }}>Password</label>
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
                            }}>Confirm Password</label>
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
                            }}>Role</label>
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
                            }}>Department</label>
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
                            }}>Joining Date</label>
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
                            }}>Phone</label>
                            <input 
                                name="phone" 
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
                        }}>Address</label>
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
                        Create Account
                    </button>
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