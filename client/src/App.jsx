// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './components/Signup';
import Login from './components/Login';
import Navbar from './components/Navbar';

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
    </div>
  );
};

const App = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div>
      {isHomePage && <Navbar />}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
};

const AppWrapper = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default AppWrapper;
