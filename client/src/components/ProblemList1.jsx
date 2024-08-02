import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ProblemList1 = () => {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get("https://server.codebash.online/api/problems");
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
    return (
      <div className="text-center py-8 text-gray-400">Loading problems...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-red-500 to-brown-600 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Problems Set
        </h1>
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
                Action
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
                  <Link
                    to={`/problems/submission/${problem._id}`}
                    className="bg-green-600 text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-green-700 transition-colors duration-300"
                  >
                    Solve Challenge
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemList1;
