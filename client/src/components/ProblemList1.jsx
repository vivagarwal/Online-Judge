import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./css/ProblemList.css"; // Import the CSS file

const ProblemList1 = () => {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/problems");
        setProblems(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch problems. Please try again later.");
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading problems...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="problem-list-container">
      <h1>Problems Set</h1>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <tr key={problem._id}>
              <td>{index + 1}</td>
              <td>
                <Link to={`/problems/view/${problem._id}`}>{problem.name}</Link>
              </td>
              <td>
                <Link
                  to={`/problems/submission/${problem._id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex justify-end">
                      <span className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out">
                        Solve Challenge 
                      </span>
                    </div>
                  </div>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemList1;
