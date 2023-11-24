import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";

const Login = ({ socket }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_BACKEND;
  const Login = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const body = {
        email: email,
        password: password,
      };
      // Call the API to create a new user
      axios({
        url: apiUrl + "api/login",
        data: body,
        method: "POST",
      })
        .then((res) => {
          console.log(res);
          setSuccessMessage("Login successful!");
          setEmail("");
          setPassword("");
          localStorage.setItem("token", res.data.token);
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
          setSuccessMessage("Try Again");
        });
    }
  };
  const validateForm = () => {
    // Simple password validation (at least 8 characters)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      setSuccessMessage("");
      setPasswordError("");
      return false;
    } else if (password.length < 8) {
      setPasswordError("Password should be 8 character long");
      setSuccessMessage("");
      setEmailError("");
      return false;
    } else {
      setPasswordError("");
      setEmailError("");
      setSuccessMessage("Login In...");
      return true;
    }
  };

  return (
    <div className="user-page">
      <div className="container">
        <h2>Login</h2>
        <form onSubmit={Login}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="error-message" id="password-error">
              {emailError}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="error-message" id="password-error">
              {passwordError}
            </div>
          </div>
          <button className="user-btn" onClick={Login}>
            Login
          </button>
          <div className="success-message" id="success-message">
            {successMessage}
          </div>
        </form>
        <p>
          Don't have an account?
          <br /> <Link to="/signup">Signup here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
