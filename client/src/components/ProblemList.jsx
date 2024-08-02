import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState(""); // State to store error message
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Clear any previous errors
    setError("");

    axios
      .get("https://server.codebash.online/api/problems")
      .then((response) => {
        setProblems(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the problems!", error);
        setError("Failed to fetch problems. Please try again later.");
      });
  }, []);

  const handleDelete = (id) => {
    // Clear any previous errors
    setError("");
    if (window.confirm("Are you sure you want to delete")) {
      axios
        .delete(`https://server.codebash.online/api/problems/${id}`)
        .then(() => {
          setProblems(problems.filter((problem) => problem._id !== id));
          alert("Problem deleted successfully!"); // Alert on successful deletion
        })
        .catch((error) => {
          console.error("There was an error deleting the problem!", error);

          // Display a specific error message based on the type of error
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            alert(`Error: ${error.response.data.message}`);
          } else if (error.request) {
            alert(
              "Network Error: Unable to reach the server. Please try again later."
            );
          } else {
            alert("An unexpected error occurred. Please try again.");
          }
        });
    }
  };

  const handleUpdate = (id) => {
    navigate(`/problems/${id}`); // Use navigate to go to the update form
  };

  const handleSolve = (id) => {
    navigate(`/problems/submission/${id}`);
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-purple-500 to-blue-600 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Problems
        </h1>
        <Link
          to="/problems/new"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition mb-4 inline-block"
        >
          Add New Problem
        </Link>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
            role="alert"
          >
            {error}
          </div>
        )}

        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="w-20 py-3 px-4 bg-black text-white font-semibold text-center">
                S.No
              </th>
              <th className="py-3 px-4 bg-black text-white font-semibold text-left">
                Name
              </th>
              <th className="py-3 px-4 bg-black text-white font-semibold text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr
                key={problem._id}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200`}
              >
                <td className="text-center py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">
                  <Link
                    to={`/problems/view/${problem._id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {problem.name}
                  </Link>
                </td>
                <td className="text-center py-3 px-4">
                  <button
                    onClick={() => handleDelete(problem._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded mr-2 hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleUpdate(problem._id)}
                    className="bg-yellow-500 text-black py-1 px-3 rounded mr-2 hover:bg-yellow-600 transition"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleSolve(problem._id)}
                    className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition"
                  >
                    Solve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemList;
