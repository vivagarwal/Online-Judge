import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, Mail } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message
  const navigate = useNavigate();

  // Reset form values on component mount
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!(email && password)) {
      alert("Please enter all the information");
      return;
    }

    // Clear previous error message
    setErrorMessage("");

    axios
      .post("http://localhost:8080/login", { email, password })
      .then((response) => {
        const result = response.data;
        console.log(result);
        const { token, user } = response.data;

        if (token && user) {
          // Store token and user info in localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          // Set the default Authorization header for future requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        if (result.message === "You have successfully logged in!") {
          if (result.user.role === "admin") navigate("/problems"); // home page for admin
          else navigate("/homepageuser"); // home page for users
        } else {
          // Handle other responses if needed
          console.log("Login failed or unexpected response");
          resetForm();
        }
      })
      .catch((error) => {
        console.error("Error:", error);

        // Check if there is a response from the server
        if (error.response && error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message); // Set the error message
        } else {
          setErrorMessage("An unexpected error occurred."); // Default error message
        }

        resetForm();
      });
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>

        {/* Display the error message if it exists */}
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter email"
              autoComplete="off"
              name="email"
              className="form-control rounded-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              className="form-control rounded-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Sign In
          </button>
        </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

export default Login;
