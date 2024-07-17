import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import './css/ProblemForm.css';


const ProblemForm = ({ history }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const {id} = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8080/api/problems/${id}`)
        .then(response => {
          const { name, description, inputs, outputs } = response.data;
          setName(name);
          setDescription(description);
          setInputs(inputs);
          setOutputs(outputs);
        })
        .catch(error => console.error('There was an error fetching the problem!', error));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problemData = { name, description, inputs, outputs };
    try {
      if (id) {
        await axios.put(`http://localhost:8080/api/problems/${id}`, problemData)
        .then(response => {
          const result = response.data;
          console.log(result);
          if (result.message === "Problem Updated successfully") {
              alert(result.message);
              navigate('/problems');
          }
      })
        navigate('/problems');
      } else {
        await axios.post('http://localhost:8080/api/problems', problemData)
        .then(response => {
          const result = response.data;
          console.log(result);
          if (result.message === "You have successfully created the problem!") {
              alert(result.message);
              navigate('/problems');
          }
      });
      }
      history?.push('/problems');
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
  };

  const handleAddInput = () => {
    setInputs([...inputs, inputValue]);
    setInputValue('');
  };

  const handleAddOutput = () => {
    setOutputs([...outputs, outputValue]);
    setOutputValue('');
  };

  const handleDeleteInput = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  const handleDeleteOutput = (index) => {
    const newOutputs = outputs.filter((_, i) => i !== index);
    setOutputs(newOutputs);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Problem Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="form-control" />
        </div>
        <div className="form-group">
          <label>Problem Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="form-control" />
        </div>
        <div className="form-group">
          <label>Inputs:</label>
          <div className="input-group">
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="form-control" />
            <button type="button" onClick={handleAddInput} className="btn">Add Input</button>
          </div>
          <ul className="list">
            {inputs.map((input, index) => (
              <li key={index} className="list-item">{input}</li>
            ))}
          </ul>
        </div>
        <div className="form-group">
          <label>Outputs:</label>
          <div className="input-group">
            <input type="text" value={outputValue} onChange={(e) => setOutputValue(e.target.value)} className="form-control" />
            <button type="button" onClick={handleAddOutput} className="btn">Add Output</button>
          </div>
          <ul className="list">
            {outputs.map((output, index) => (
              <li key={index} className="list-item">{output}</li>
            ))}
          </ul>
        </div>
        <button type="submit" className="btn submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default ProblemForm;