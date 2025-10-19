import React, { useState } from "react";
import { useNavigate,Link} from "react-router-dom";
const initialState = {
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
        <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #ddd", borderRadius: 8 }}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} autoComplete="off">
                <div>
                    <label>Name</label>
                    <input name="Name" value={form.Name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email</label>
                    <input name="Email" type="email" value={form.Email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password</label>
                    <input name="Password" type="password" value={form.Password} onChange={handleChange} required />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input name="ConfirmPassword" type="password" value={form.ConfirmPassword} onChange={handleChange} required />
                </div>
                <div>
                    <label>
                        <input name="isManager" type="checkbox" checked={form.isManager} onChange={handleChange} />
                        Is Manager
                    </label>
                </div>
                <div>
                    <label>Role</label>
                    <input name="role" value={form.role} onChange={handleChange} required />
                </div>
                <div>
                    <label>Department</label>
                    <input name="department" value={form.department} onChange={handleChange} required />
                </div>
                <div>
                    <label>Joining Date</label>
                    <input name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} required />
                </div>
                <div>
                    <label>Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required />
                </div>
                <div>
                    <label>Address</label>
                    <input name="address" value={form.address} onChange={handleChange} required />
                </div>
                {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
                <button type="submit" style={{ marginTop: 16 }}>Sign Up</button>
            </form>
            <Link to="/">Already have an account,login</Link>
        </div>
    );
}