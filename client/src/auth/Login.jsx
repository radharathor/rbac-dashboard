import React, { useState } from "react";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState(""); // Initial state for email is empty
  const [password, setPassword] = useState(""); // Initial state for password is empty
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Login successful!");
        onLoginSuccess(data.user); // Pass user to the parent component
        setEmail(""); // Reset the email input after submission
        setPassword(""); // Reset the password input after submission
        navigate("/dashboard"); // Redirect to the dashboard
      } else {
        alert(data.message); // Show error message if login fails
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email} // Bind value to state
          onChange={(e) => setEmail(e.target.value)} // Update state on input change
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password} // Bind value to state
          onChange={(e) => setPassword(e.target.value)} // Update state on input change
          required
        />
        <button type="submit">Login</button>
        <p>
          Don’t have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
