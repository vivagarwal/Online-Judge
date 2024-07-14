import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProblemList = () => {
 const [problems, setProblems] = useState([]);

 useEffect(() => {
   axios.get('http://localhost:8080/api/problems')
     .then(response => setProblems(response.data))
     .catch(error => console.error('There was an error fetching the problems!', error));
 }, []);

 const handleDelete = (id) => {
   axios.delete(`http://localhost:8080/api/problems/${id}`)
     .then(() => setProblems(problems.filter(problem => problem._id !== id)))
     .catch(error => console.error('There was an error deleting the problem!', error));
 };

 return (
   <div>
     <h1>Problems</h1>
     <Link to="/problems/new">Add New Problem</Link>
     <ul>
       {problems.map(problem => (
         <li key={problem._id}>
           <Link to={`/problems/${problem._id}`}>{problem.name}</Link>
           <button onClick={() => handleDelete(problem._id)}>Delete</button>
         </li>
       ))}
     </ul>
   </div>
 );
};

export default ProblemList;