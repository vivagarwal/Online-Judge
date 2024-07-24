import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProblemView from "./ProblemView"; // Import the ProblemView component
import "./css/SplitView.css"; // Import the CSS file for split view
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-tomorrow.css";

const ProblemDetails = () => {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");
  const editorRef = useRef(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  

  useEffect(() => {
    // Disable spell-checking for the entire component
    document.body.spellcheck = false;

    // Re-enable spell-checking when component unmounts
    return () => {
      document.body.spellcheck = true;
    };
  }, []);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) {
        setError("Problem ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/problems/${id}`
        );
        setProblem(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching problem:", err);
        setError("Failed to fetch problem details. Please try again later.");
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleRun = async () => {
    if (!id) {
      setOutput("Error: Problem ID is missing.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/run", {
        language,
        code,
        input,
      });
      console.log(response.data);
      setOutput(response.data.output);
    } catch (error) {
      console.error("Error running code:", error);
      setOutput(
        "Error: " +
          (error.response?.data?.error || "An unexpected error occurred")
      );
    }
  };

  const handleSubmit = async () => {
    if (!id) {
      setOutput('Error: Problem ID is missing.');
      return;
    }
    setSubmitting(true);
    try {
      const compilerResponse = await axios.post('http://localhost:5001/submit', {
        problemId: id,
        code,
        language,
        testCases: problem.testCases
      });
      setSubmissionResult({
        status: compilerResponse.data.status,
        message: compilerResponse.data.message
      });
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmissionResult({
        status: 'Runtime Error',
        message: 'An unexpected error occurred during submission.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading problem...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!problem) {
    return <div className="text-center mt-8">Problem not found.</div>;
  }

  return (
    <div className="split-container h-screen bg-gray-100">
      {/* Problem View (Left Side) */}
      <div className="split-left p-6">
        <ProblemView problem={problem} />
      </div>

      {/* Compiler (Right Side) */}
      <div className="split-right p-6">
        <h1 className="text-3xl font-bold mb-4">Online Code Compiler</h1>
        <div className="border-gray-300 rounded-lg py-1.5 px-4 mb-1 focus:outline-none focus:border-indigo-500">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-700 text-black py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="cpp" className="text-black">
              C++
            </option>
            <option value="java" className="text-black">
              Java
            </option>
            <option value="py" className="text-black">
              Python
            </option>
            <option value="c" className="text-black">
              C
            </option>
          </select>
        </div>
        <div
          className="bg-gray-900 text-white shadow-md w-full mb-4 rounded-md"
          style={{ height: "40vh", overflowY: "auto", overflowX: "auto" }}
          ref={editorRef}
        >
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              highlight(code, languages[language] || languages.clike)
            }
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              backgroundColor: "#2d2d2d",
              color: "#f8f8f2",
              minHeight: "40vh",
            }}
          />
        </div>

        {/* Input textarea */}
        <div
          className="bg-gray-900 text-white shadow-md p-2 rounded-md"
          style={{ overflowY: "auto", overflowX: "auto" }}
        >
          <h2 className="text-lg font-semibold mb-2">Input</h2>
          <textarea
            rows="3"
            cols="60"
            value={input}
            placeholder="Enter your input"
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-gray-800 text-black border border-gray-700 rounded-md py-1.5 px-4 mb-1 focus:outline-none focus:border-indigo-500 resize-none"
          ></textarea>
        </div>

        {/*Run Button*/}
        <button
          onClick={handleRun}
          className="bg-blue-500 hover:bg-blue-600 text-black font-bold py-2 px-4 rounded"
        >
          Run
        </button>
        <button 
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-black font-bold py-2 px-4 rounded"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>

        <div
          className="bg-gray-900 text-black shadow-md p-4 rounded-md mb-4"
          style={{ height: "100px", overflowY: "auto" }}
        >
          <h2 className="text-lg font-semibold mb-2">Output</h2>
          <div
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
            }}
          >
            {output}
          </div>
        </div>
        
        {submissionResult && (
          <div className="mt-4">
            <h3 className="bg-gray-900 text-black shadow-md p-4 rounded-md mb-4">Submission Result:</h3>
            <div className={`p-4 rounded ${
              submissionResult.status === 'Accepted' ? 'bg-green-700' :
              submissionResult.status === 'Wrong Answer' ? 'bg-red-700' :
              submissionResult.status === 'Time Limit Exceeded' ? 'bg-yellow-700' :
              submissionResult.status === 'Runtime Error' ? 'bg-purple-700' :
              'bg-gray-700'
            }`}>
              <p className="font-bold">{submissionResult.status}</p>
              <p>{submissionResult.message}</p>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default ProblemDetails;
