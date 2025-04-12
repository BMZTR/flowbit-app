import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/tasks`)
      .then(response => setTasks(response.data || []))
      .catch(error => {
        console.error('Fetch tasks error:', error.response?.status, error.response?.data || error.message);
        setTasks([]);
      });
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/users`)
      .then(response => setUsers(response.data || []))
      .catch(error => {
        console.error('Fetch users error:', error.response?.status, error.response?.data || error.message);
        setUsers([]);
      });
  }, []);

  return (
    <div className="App">
      <h1>FlowBit</h1>
      <div>
        <h2>Users</h2>
        {users.length > 0 ? (
          <ul>
            {users.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        ) : (
          <p>No users available</p>
        )}
      </div>
      <div>
        <h2>Tasks</h2>
        {tasks.length > 0 ? (
          <ul>
            {tasks.map(task => (
              <li key={task.id}>{task.name} - {task.priority}</li>
            ))}
          </ul>
        ) : (
          <p>No tasks available</p>
        )}
      </div>
    </div>
  );
}

export default App;
