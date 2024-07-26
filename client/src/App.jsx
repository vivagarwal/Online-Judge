import React from "react";
import { BrowserRouter, Routes, Route , useLocation , Navigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ProblemForm from "./components/ProblemForm";
import ProblemList from "./components/ProblemList";
import ProblemView from "./components/ProblemView";
import ProblemList1 from "./components/ProblemList1";
import ProblemDetails from "./components/ProblemDetails";

const App = () => {
  return (
    <div>
      <Navbar/>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/problems/new" element={<ProblemForm />} />
          <Route path="/problems/:id" element={<ProblemForm />} />
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/problems/view/:id" element={<ProblemView />} />
          <Route path="/homepageuser" element={<ProblemList1 />} />
          <Route path="/problems/submission/:id" element={<ProblemDetails/>}/>
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
