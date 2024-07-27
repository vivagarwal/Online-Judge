import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './css/ProblemList.css'; // Import the CSS file

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState(''); // State to store error message
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Clear any previous errors
    setError('');

    axios.get('http://localhost:8080/api/problems')
      .then(response => {
        setProblems(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the problems!', error);
        setError('Failed to fetch problems. Please try again later.');
      });
  }, []);

  const handleDelete = (id) => {
    // Clear any previous errors
    setError('');

    axios.delete(`http://localhost:8080/api/problems/${id}`)
      .then(() => {
        setProblems(problems.filter(problem => problem._id !== id));
        alert('Problem deleted successfully!'); // Alert on successful deletion
      })
      .catch(error => {
        console.error('There was an error deleting the problem!', error);

        // Display a specific error message based on the type of error
        if (error.response && error.response.data && error.response.data.message) {
          alert(`Error: ${error.response.data.message}`);
        } else if (error.request) {
          alert('Network Error: Unable to reach the server. Please try again later.');
        } else {
          alert('An unexpected error occurred. Please try again.');
        }
      });
  };

  const handleUpdate = (id) => {
    navigate(`/problems/${id}`); // Use navigate to go to the update form
  };

  return (
    <div className="problem-list-container">
      <h1>Problems</h1>
      <Link to="/problems/new" className="add-button">Add New Problem</Link>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <tr key={problem._id}>
              <td>{index + 1}</td>
              <td><Link to={`/problems/view/${problem._id}`}>{problem.name}</Link></td>
              <td>
                <button onClick={() => handleDelete(problem._id)} className="delete-button">Delete</button>
                <button onClick={() => handleUpdate(problem._id)} className="update-button">Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemList;
