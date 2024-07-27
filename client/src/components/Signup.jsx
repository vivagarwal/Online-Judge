import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Lock } from "lucide-react";

function Signup() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to store error message
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Reset form values on component mount
  useEffect(() => {
    setFirstname("");
    setLastname("");
    setEmail("");
    setPassword("");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous error message
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    axios
      .post("http://localhost:8080/register", { firstname, lastname, email, password })
      .then((response) => {
        const result = response.data;
        console.log(result);
        if (result.message === "You have successfully registered!") {
          alert("You have successfully registered");
          navigate("/login");
        } else {
          // Handle other responses if needed
          console.log("Registration failed or unexpected response");
          setError(result.message); // Display server message as error
          resetForm();
        }
      })
      .catch((err) => {
        console.log(err);

        // Handle different error scenarios
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message); // Set the error message from server
        } else if (err.request) {
          setError("Network Error: Please try again later");
        } else {
          setError("An unexpected error occurred");
        }
        resetForm();
      });
  };

  const resetForm = () => {
    setFirstname("");
    setLastname("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Register</h2>

        {/* Display the error message if it exists */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <User className="absolute top-3 left-3 text-gray-400" size={20} />
            <label htmlFor="firstname">
              <strong>First Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter first name"
              autoComplete="off"
              name="firstname"
              className="form-control rounded-0"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <User className="absolute top-3 left-3 text-gray-400" size={20} />
            <label htmlFor="lastname">
              <strong>Last Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter last name"
              autoComplete="off"
              name="lastname"
              className="form-control rounded-0"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>
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
              required
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
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Register
          </button>
        </form>
        <p>Already have an account?<Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default Signup;
