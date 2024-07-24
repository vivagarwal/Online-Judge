import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './css/ProblemForm.css';

const ProblemForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [testCases, setTestCases] = useState([]); // State for test cases
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [testCaseInput, setTestCaseInput] = useState(''); // State for test case input
  const [testCaseOutput, setTestCaseOutput] = useState(''); // State for test case output
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8080/api/problems/${id}`)
        .then((response) => {
          const { name, description, inputs, outputs, testCases } = response.data;
          setName(name);
          setDescription(description);
          setInputs(inputs);
          setOutputs(outputs);
          setTestCases(testCases || []); // Initialize with existing test cases if editing
        })
        .catch((error) =>
          console.error('There was an error fetching the problem!', error)
        );
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation check before submitting
    if (!name || !description || inputs.length === 0 || outputs.length === 0 || testCases.length === 0) {
      alert("All fields are required, including at least one input, output, and test case.");
      return;
  }

  for (const testCase of testCases) {
      if (!testCase.input || !testCase.expectedOutput) {
          alert("Each test case must have both input and expected output.");
          return;
      }
  }
    const problemData = { name, description, inputs, outputs, testCases };
    try {
      if (id) {
        await axios
          .put(`http://localhost:8080/api/problems/${id}`, problemData)
          .then((response) => {
            const result = response.data;
            console.log(result);
            alert(result.message);
            if (result.message === 'Problem updated successfully') {
              navigate('/problems');
            }
          });
      } else {
        await axios
          .post('http://localhost:8080/api/problems', problemData)
          .then((response) => {
            const result = response.data;
            console.log(result);
            alert(result.message);
            if (result.message === 'You have successfully created the problem!') {
              navigate('/problems');
            }
          });
      }
    } catch (error) {
      console.error(error);
      alert(error);
      resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setInputs([]);
    setOutputs([]);
    setInputValue('');
    setOutputValue('');
    setTestCases([]); // Reset test cases
    setTestCaseInput(''); // Reset test case input field
    setTestCaseOutput(''); // Reset test case output field
  };

  const handleAddInput = () => {
    if (inputValue.trim() !== '') {
      setInputs([...inputs, inputValue]);
      setInputValue('');
    }
  };

  const handleAddOutput = () => {
    if (outputValue.trim() !== '') {
      setOutputs([...outputs, outputValue]);
      setOutputValue('');
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
    if (testCaseInput.trim() !== '' && testCaseOutput.trim() !== '') {
      setTestCases([
        ...testCases,
        { input: testCaseInput, expectedOutput: testCaseOutput },
      ]);
      setTestCaseInput('');
      setTestCaseOutput('');
    }
  };

  const handleDeleteTestCase = (index) => {
    const newTestCases = testCases.filter((_, i) => i !== index);
    setTestCases(newTestCases);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Problem Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Problem Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Inputs:</label>
          <div className="input-group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="form-control"
            />
            <button type="button" onClick={handleAddInput} className="btn">
              Add Input
            </button>
          </div>
          <ul className="list">
            {inputs.map((input, index) => (
              <li key={index} className="list-item">
                {input}
                <button
                  type="button"
                  onClick={() => handleDeleteInput(index)}
                  className="btn delete-btn"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="form-group">
          <label>Outputs:</label>
          <div className="input-group">
            <input
              type="text"
              value={outputValue}
              onChange={(e) => setOutputValue(e.target.value)}
              className="form-control"
            />
            <button type="button" onClick={handleAddOutput} className="btn">
              Add Output
            </button>
          </div>
          <ul className="list">
            {outputs.map((output, index) => (
              <li key={index} className="list-item">
                {output}
                <button
                  type="button"
                  onClick={() => handleDeleteOutput(index)}
                  className="btn delete-btn"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="form-group">
          <label>Test Cases:</label>
          <div className="input-group">
            <input
              type="text"
              placeholder="Test Case Input"
              value={testCaseInput}
              onChange={(e) => setTestCaseInput(e.target.value)}
              className="form-control"
            />
            <input
              type="text"
              placeholder="Expected Output"
              value={testCaseOutput}
              onChange={(e) => setTestCaseOutput(e.target.value)}
              className="form-control"
            />
            <button
              type="button"
              onClick={handleAddTestCase}
              className="btn"
            >
              Add Test Case
            </button>
          </div>
          <ul className="list">
            {testCases.map((testCase, index) => (
              <li key={index} className="list-item">
                <strong>Input:</strong> {testCase.input} - <strong>Expected Output:</strong> {testCase.expectedOutput}
                <button
                  type="button"
                  onClick={() => handleDeleteTestCase(index)}
                  className="btn delete-btn"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" className="btn submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProblemForm;
