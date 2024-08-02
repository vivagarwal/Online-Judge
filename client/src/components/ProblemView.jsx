import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProblemView = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    axios
      .get(`https://server.codebash.online/api/problems/${id}`)
      .then((response) => setProblem(response.data))
      .catch((error) =>
        console.error("There was an error fetching the problem!", error)
      );
  }, [id]);

  if (!problem)
    return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{problem.name}</h1>
      <p className="text-lg text-gray-700 mb-6">{problem.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Inputs</h3>
          <ul className="list-disc pl-5 space-y-2">
            {problem.inputs.map((input, index) => (
              <li key={index} className="text-gray-700">
                {input}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Outputs</h3>
          <ul className="list-disc pl-5 space-y-2">
            {problem.outputs.map((output, index) => (
              <li key={index} className="text-gray-700">
                {output}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProblemView;
