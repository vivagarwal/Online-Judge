import React from "react";
import { useState , useEffect} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

   // Reset form values on component mount
   useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/login", { email, password })

      .then((response) => {
        const result = response.data;
        console.log(result);
        if (result.message === "You have successfully logged in!") {
          if(result.role === "admin")
            navigate("/problems"); // home page for admin
          else
            navigate("/homepageuser"); //home page for users
        } else {
          // Handle other responses if needed
          console.log("Login failed or unexpected response");
          resetForm();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        resetForm();
      });
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
};

  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
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
            Login
          </button>
        </form>
        <p>Don't have an account?</p>
        <Link
          to="/register"
          className="btn btn-default border w-100 rounded-0 text-decoration-none"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default Login;
