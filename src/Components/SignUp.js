import React, { useState } from "react";
import "./Login.css"; // Create Signup.css with the provided styles
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const apiUrl = process.env.REACT_APP_BACKEND;
  const navigate = useNavigate();
  const validateForm = () => {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if all fields are filled
    if (!email) {
      setEmailError("Email required");
      setPasswordError("");
      setUserNameError("");
      setSuccessMessage("");
      return false;
    } else if (!username) {
      setEmailError("");
      setPasswordError("");
      setUserNameError("Username required");
      setSuccessMessage("");
    } else if (!password) {
      setEmailError("");
      setPasswordError("Password required");
      setUserNameError("");
      setSuccessMessage("");
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      setPasswordError("");
      setUserNameError("");
      setSuccessMessage("");
      return false;
    } else if (password.length < 8) {
      setUserNameError("");
      setEmailError("");
      setPasswordError("Password must be at least 8 characters");
      setSuccessMessage("");
      return false;
    } else {
      setEmailError("");
      setUserNameError("");
      setPasswordError("");
      setSuccessMessage("Signup successful!");
      return true;
    }
  };

  const Signup = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const body = {
        username: username,
        email: email,
        password: password,
      };
      // Call the API to create a new user
      axios({
        url: apiUrl + "api/signup",
        data: body,
        method: "POST",
      })
        .then((res) => {
          console.log(res);
          setSuccessMessage("Signup successful!");
          setEmail("");
          setPassword("");
          setUsername("");
          localStorage.setItem("token", res.data.token);
          navigate(`/${res.data.chatId}`);
        })
        .catch((err) => {
          console.log(err);
          setSuccessMessage("Try Again");
        });
    }
  };

  return (
    <div className="user-page">
      <div className="container">
        <h2>Signup</h2>
        <form onSubmit={Signup}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="error-message">{emailError}</div>
          </div>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <div className="error-message">{userNameError}</div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="error-message">{passwordError}</div>
          </div>
          <button className="user-btn" onClick={Signup}>
            Signup
          </button>
          <div className="success-message">{successMessage}</div>
        </form>
        <p>
          Already have an account?
          <br /> <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
