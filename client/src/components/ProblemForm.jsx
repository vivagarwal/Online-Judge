import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProblemForm = ({ match, history }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');

  useEffect(() => {
    console.log("Inside useEffect");
    console.log("match:", match); // Log the entire match object
    console.log("match.params.id:", match?.params?.id); // Log specifically the id parameter
    if (match?.params?.id) {
      axios.get(`http://localhost:8080/api/problems/${match.params.id}`)
        .then(response => {
          const { name, description, inputs, outputs } = response.data;
          setName(name);
          setDescription(description);
          setInputs(inputs);
          setOutputs(outputs);
        })
        .catch(error => console.error('There was an error fetching the problem!', error));
    }
  }, [match?.params?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problemData = { name, description, inputs, outputs };
    try {
      if (match?.params?.id) {
        await axios.put(`http://localhost:8080/api/problems/${match.params.id}`, problemData);
      } else {
        await axios.post('http://localhost:8080/api/problems', problemData);
      }
      history?.push('/problems');
    } catch (error) {
      console.error(error);
      alert('Failed to save problem');
    }
  };

  const handleAddInput = () => {
    setInputs([...inputs, inputValue]);
    setInputValue('');
  };

  const handleAddOutput = () => {
    setOutputs([...outputs, outputValue]);
    setOutputValue('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Problem Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Problem Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <label>Inputs:</label>
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <button type="button" onClick={handleAddInput}>Add Input</button>
        <ul>
          {inputs.map((input, index) => (
            <li key={index}>{input}</li>
          ))}
        </ul>
      </div>
      <div>
        <label>Outputs:</label>
        <input type="text" value={outputValue} onChange={(e) => setOutputValue(e.target.value)} />
        <button type="button" onClick={handleAddOutput}>Add Output</button>
        <ul>
          {outputs.map((output, index) => (
            <li key={index}>{output}</li>
          ))}
        </ul>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ProblemForm;
