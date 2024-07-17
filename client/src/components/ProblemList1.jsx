import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './css/ProblemList.css'; // Import the CSS file

const ProblemList1 = () => {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    axios.get('http://localhost:8080/api/problems')
      .then(response => setProblems(response.data))
      .catch(error => console.error('There was an error fetching the problems!', error));
  }, []);

  return (
    <div className="problem-list-container">
      <h1>Problems</h1>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <tr key={problem._id}>
              <td>{index + 1}</td>
              <td><Link to={`/problems/view/${problem._id}`}>{problem.name}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemList1;
