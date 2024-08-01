import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProblemView from "./ProblemView"; // Import the ProblemView component
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
  const [submissionResult, setSubmissionResult] = useState({});
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
          `http://43.204.29.127:8080/api/problems/${id}`
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
      const response = await axios.post("http://43.205.127.107:5001/run", {
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
      setOutput("Error: Problem ID is missing.");
      return;
    }
    setSubmitting(true);
    try {
      const compilerResponse = await axios.post(
        "http://43.205.127.107:5001/submit",
        {
          problemId: id,
          code,
          language,
          testCases: problem.testCases,
        }
      );
      console.log(compilerResponse.data); // Log the response to check its structure
      setSubmissionResult({
        status: compilerResponse.data.status,
        message: compilerResponse.data.message,
      });
    } catch (error) {
      console.error("Error submitting code:", error);
      setSubmissionResult({
        status: "Runtime Error",
        message: "An unexpected error occurred during submission.",
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
    <div className="flex h-screen bg-gray-100 w-screen">
      {/* Problem View (Left Side) */}
      <div className="w-1/2 p-6 overflow-y-auto">
        <ProblemView />
      </div>

      {/* Compiler (Right Side) */}
      <div className="w-1/2 p-6 bg-gray-800 text-white">
        <h3 className="text-white font-bold mb-4">Compile Genie</h3>
        <div className="mb-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="py">Python</option>
            <option value="c">C</option>
          </select>
        </div>
        <div
          className="bg-gray-900 text-white shadow-md w-full mb-4 rounded-md"
          style={{ height: "30vh", overflowY: "auto", overflowX: "auto" }}
          ref={editorRef}
        >
          <Editor
            value={code}
            placeholder="Write your code here"
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
              minHeight: "30vh",
            }}
          />
        </div>

        {/* Input textarea */}
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Custom Input:</h3>
          <textarea
            value={input}
            placeholder="Enter your input.."
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-1/6 p-4 bg-gray-700 text-white font-mono rounded"
            spellCheck="false" // This line disables browser spell-checking
            autoCorrect="off" // This line disables autocorrect on mobile devices
            autoCapitalize="off" // This line disables auto-capitalization
            data-gramm="false" // Disables Grammarly
            data-gramm_editor="false" // Also disables Grammarly
            data-enable-grammarly="false" // Disables Grammarly
          />
        </div>

        <div className="mt-4 flex space-x-4">
          <button
            onClick={handleRun}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Run Code
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Output:</h3>
          <textarea
            value={output} 
            readOnly // read-only since it's just for displaying output
            className="w-full h-1/6 p-4 bg-gray-700 text-white font-mono rounded"
          />
        </div>
        {submissionResult && (
          <div className="mt-4">
            <div
              className={`p-4 rounded ${
                submissionResult.status === "Success"
                  ? "bg-green-700"
                  : submissionResult.status === "Failed"
                  ? "bg-red-700"
                  : submissionResult.status === "Time Limit Exceeded"
                  ? "bg-yellow-700"
                  : submissionResult.status === "Runtime Error"
                  ? "bg-purple-700"
                  : "bg-gray-800"
              }`}
            >
              <p className="font-bold">{submissionResult.status}</p>
              <p className="text-sm">{submissionResult.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDetails;
