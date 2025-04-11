import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import TeamView from './components/TeamView';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    axios.get(`${apiUrl}/api/tasks`)
      .then(res => setTasks(res.data))
      .catch(err => setError('Erreur lors de la récupération des tâches'));

    axios.get(`${apiUrl}/api/users`)
      .then(res => setUsers(res.data))
      .catch(err => setError('Erreur lors de la récupération des utilisateurs'));
  }, []);

  const addTask = (task) => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    axios.post(`${apiUrl}/api/tasks`, task)
      .then(res => setTasks([...tasks, res.data]))
      .catch(err => setError('Erreur lors de l’ajout de la tâche'));
  };

  return (
    <div className="App">
      <h1>FlowBit</h1>
      {error && <p className="error">{error}</p>}
      <TaskInput onAddTask={addTask} />
      <TaskList tasks={tasks} />
      <TeamView users={users} tasks={tasks} />
    </div>
  );
}

export default App;