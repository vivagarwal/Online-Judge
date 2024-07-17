import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './css/ProblemView.css'; // Import the CSS file

const ProblemView = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/problems/${id}`)
      .then(response => setProblem(response.data))
      .catch(error => console.error('There was an error fetching the problem!', error));
  }, [id]);

  if (!problem) return <div>Loading...</div>;

  return (
    <div className="problem-card">
      <h1 className="problem-title">{problem.name}</h1>
      <p className="problem-description">{problem.description}</p>
      <div className="problem-details">
        <div className="problem-input">
          <h3>Inputs</h3>
          <ul>
            {problem.inputs.map((input, index) => (
              <li key={index}>{input}</li>
            ))}
          </ul>
        </div>
        <div className="problem-output">
          <h3>Outputs</h3>
          <ul>
            {problem.outputs.map((output, index) => (
              <li key={index}>{output}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProblemView;
