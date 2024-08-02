import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProblemForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [testCases, setTestCases] = useState([]); // State for test cases
  const [inputValue, setInputValue] = useState("");
  const [outputValue, setOutputValue] = useState("");
  const [testCaseInput, setTestCaseInput] = useState(""); // State for test case input
  const [testCaseOutput, setTestCaseOutput] = useState(""); // State for test case output
  const [error, setError] = useState(""); // State to store error message
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios
        .get(`https://server.codebash.online/api/problems/${id}`)
        .then((response) => {
          const { name, description, inputs, outputs, testCases } =
            response.data;
          setName(name);
          setDescription(description);
          setInputs(inputs);
          setOutputs(outputs);
          setTestCases(testCases || []); // Initialize with existing test cases if editing
        })
        .catch((error) => {
          console.error("There was an error fetching the problem!", error);
          setError("Failed to fetch problem details. Please try again later.");
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error message
    setError("");

    // Final validation check before submitting
    if (
      !name ||
      !description ||
      inputs.length === 0 ||
      outputs.length === 0 ||
      testCases.length === 0
    ) {
      setError(
        "All fields are required, including at least one input, output, and test case."
      );
      return;
    }

    for (const testCase of testCases) {
      if (!testCase.input || !testCase.expectedOutput) {
        setError("Each test case must have both input and expected output.");
        return;
      }
    }

    const problemData = { name, description, inputs, outputs, testCases };

    try {
      if (id) {
        await axios
          .put(`https://server.codebash.online/api/problems/${id}`, problemData)
          .then((response) => {
            const result = response.data;
            if (result.message === "Problem updated successfully") {
              alert(result.message);
              navigate("/problems");
            } else {
              setError(result.message);
              resetForm();
            }
          });
      } else {
        await axios
          .post("https://server.codebash.online/api/problems", problemData)
          .then((response) => {
            const result = response.data;
            if (
              result.message === "You have successfully created the problem!"
            ) {
              alert(result.message);
              navigate("/problems");
            } else {
              setError(result.message);
              resetForm();
            }
          });
      }
    } catch (error) {
      console.error(error);
      resetForm();
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError("Network Error: Please try again later");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setInputs([]);
    setOutputs([]);
    setInputValue("");
    setOutputValue("");
    setTestCases([]); // Reset test cases
    setTestCaseInput(""); // Reset test case input field
    setTestCaseOutput(""); // Reset test case output field
  };

  const handleAddInput = () => {
    if (inputValue.trim() !== "") {
      setInputs([...inputs, inputValue]);
      setInputValue("");
    }
  };

  const handleAddOutput = () => {
    if (outputValue.trim() !== "") {
      setOutputs([...outputs, outputValue]);
      setOutputValue("");
    }
  };

  const handleDeleteInput = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  const handleDeleteOutput = (index) => {
    const newOutputs = outputs.filter((_, i) => i !== index);
    setOutputs(newOutputs);
  };

  const handleAddTestCase = () => {
    if (testCaseInput.trim() !== "" && testCaseOutput.trim() !== "") {
      setTestCases([
        ...testCases,
        { input: testCaseInput, expectedOutput: testCaseOutput },
      ]);
      setTestCaseInput("");
      setTestCaseOutput("");
    }
  };

  const handleDeleteTestCase = (index) => {
    const newTestCases = testCases.filter((_, i) => i !== index);
    setTestCases(newTestCases);
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100 flex items-center justify-center py-8 px-4 overflow-hiden">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">
              Problem Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">
              Problem Description:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">
              Inputs:
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleAddInput}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Add Input
              </button>
            </div>
            <ul className="mt-4 space-y-2">
              {inputs.map((input, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded shadow-sm"
                >
                  {input}
                  <button
                    type="button"
                    onClick={() => handleDeleteInput(index)}
                    className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">
              Outputs:
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={outputValue}
                onChange={(e) => setOutputValue(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleAddOutput}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Add Output
              </button>
            </div>
            <ul className="mt-4 space-y-2">
              {outputs.map((output, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded shadow-sm"
                >
                  {output}
                  <button
                    type="button"
                    onClick={() => handleDeleteOutput(index)}
                    className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="form-group">
            <label className="block text-lg font-medium text-gray-700">
              Test Cases:
            </label>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <textarea
                  type="text"
                  placeholder="Test Case Input"
                  value={testCaseInput}
                  onChange={(e) => setTestCaseInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <textarea
                  type="text"
                  placeholder="Expected Output"
                  value={testCaseOutput}
                  onChange={(e) => setTestCaseOutput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddTestCase}
                  className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
                >
                  Add Test Case
                </button>
              </div>
              <ul className="space-y-2">
                {testCases.map((testCase, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded shadow-sm"
                  >
                    <div>
                      <strong>Input:</strong> {testCase.input} -{" "}
                      <strong>Expected Output:</strong>{" "}
                      {testCase.expectedOutput}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteTestCase(index)}
                      className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition"
            >
              Reset
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProblemForm;
