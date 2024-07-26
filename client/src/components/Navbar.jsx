import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/Navbar.css'; // Import the CSS file for styling

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      CodeArena
      <div className="navbar-container">
        <ul className="navbar-menu">
          {user ? (
            user.role === 'admin' ? (
              <>
                <li>
                  <Link to="/problems" className="navbar-link">
                    CRUD
                  </Link>
                </li>
                <li>
                  <Link to="/homepageuser" className="navbar-link">
                    Problems
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="custom-logout-btn">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/homepageuser" className="navbar-link">
                    Problems
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="custom-logout-btn">
                    Logout
                  </button>
                </li>
              </>
            )
          ) : (
            <>
              <li>
                <Link to="/register" className="navbar-link">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="navbar-link">
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
