import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/LoginPage.css";
import { useNavigate } from "react-router-dom";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    if (username === "" || password === "") {
      setError(true);
    } else {
      setError(false);

      fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
          }
          return response.json();
        })
        .then(data => {
          localStorage.setItem("token", data.token);
          localStorage.setItem('username', username);
          navigate(`/${username}/events`);
        })
        .catch((error) => {
          console.error("Error:", error);
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div class="log-in-form">
      <div class="form-container">
        <form class="form-body" onSubmit={handleSubmit}>

          <div class="form-input">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div class="form-input">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {loading && (<div className="spinner-div">
            <svg class="spinner" width="35px" height="35px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
              <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
            </svg>
          </div>)}

          {error && (
            <div className="message">
              <p>Invalid email or password!</p>
            </div>
          )}

          <div class="button">
            <input type="submit" class="form-btn" />
          </div>

          <div class="sign-up-link">
            <p>Don't have an account? <Link to="/create">Create</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;