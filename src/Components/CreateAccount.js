import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/LoginPage.css";

function CreateAccount() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [matchError, setMatchError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password || !firstName || !lastName || !emailId || !confirmedPassword) {
      setError("All fields are required.");
    } else if (password !== confirmedPassword) {
      setMatchError("Passwords do not match.");
    } else {
      setError("");
      setMatchError("");

      const userData = { username, password, firstName, lastName, emailId };

      try {
        const response = await fetch("http://localhost:8080/api/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to create account. Please try again.");
        }

        setSuccess("Account created successfully!");
      } catch (error) {
        setError(error.message || "Failed to create account. Please try again.");
      }
    }
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
    } else if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one number.");
    } else if (!/[!@#$%^&*]/.test(password)) {
      setPasswordError("Password must contain at least one special character.");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmedPassword(e.target.value);
    if (e.target.value !== password) {
      setError("Passwords do not match!");
    } else {
      setError("");
    }
  };

  return (
    <div class="log-in-form">
      <div class="form-container">
        <form class="form-body" onSubmit={handleSubmit}>

          <div class="form-input">
            <input
              type="text"
              placeholder="FirstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div class="form-input">
            <input
              type="text"
              placeholder="LastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div class="form-input">
            <input
              type="text"
              placeholder="Email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            />
          </div>

          <div class="form-input">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div class="form-input">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
            />
          </div>

          {passwordError && (
            <div className="message">
              <p>{passwordError}</p>
            </div>
          )}

          <div class="form-input">
            <input
              type="password"
              placeholder="ConfirmPassword"
              value={confirmedPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>

          {success && (
            <div className="message success-message">
              <p>{success}</p>
            </div>
          )}

          {error && (
            <div className="message error-message">
              <p>{error}</p>
            </div>
          )}

          <div class="button">
            <input type="submit" class="form-btn" />
          </div>

          <div class="sign-up-link">
            <p>Already have an account? <Link to="/">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;