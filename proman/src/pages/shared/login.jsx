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
    <div
      style={{
        maxWidth: 400,
        margin: "60px auto",
        padding: 24,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Email</label>
          <input
            type="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Password</label>
          <input
            type="password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        {error && (
          <div style={{ color: "red", marginBottom: 12 }}>{error}</div>
        )}
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          Login
        </button>
      </form>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <span>Don't have an account? </span>
        <a href="/signup">Sign up</a>
      </div>
    </div>
  );
};

export default Login;
