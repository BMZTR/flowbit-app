import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', duration: '', priority: 'moyenne' });
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/tasks`)
      .then(response => setTasks(response.data || []))
      .catch(error => {
        console.error('Fetch tasks error:', error.response?.status, error.message);
        setError('Failed to load tasks');
      });
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/users`)
      .then(response => setUsers(response.data || []))
      .catch(error => {
        console.error('Fetch users error:', error.response?.status, error.message);
        setError('Failed to load users');
      });
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks`, {
        name: newTask.name,
        duration: parseInt(newTask.duration),
        priority: newTask.priority
      });
      setTasks([...tasks, response.data]);
      setNewTask({ name: '', duration: '', priority: 'moyenne' });
      setError('');
    } catch (error) {
      console.error('Add task error:', error.response?.status, error.message);
      setError('Failed to add task');
    }
  };

  return (
    <div className="App">
      <h1>FlowBit</h1>
      {error && <p className="error">{error}</p>}
      <div className="form-container">
        <h2>Add Task</h2>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            value={newTask.name}
            onChange={e => setNewTask({ ...newTask, name: e.target.value })}
            placeholder="Task name"
            className="form-input"
            required
          />
          <input
            type="number"
            value={newTask.duration}
            onChange={e => setNewTask({ ...newTask, duration: e.target.value })}
            placeholder="Duration (min)"
            className="form-input"
            required
          />
          <select
            value={newTask.priority}
            onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
            className="form-select"
          >
            <option value="basse">Low</option>
            <option value="moyenne">Medium</option>
            <option value="haute">High</option>
          </select>
          <button type="submit" className="form-button">Add Task</button>
        </form>
      </div>
      <div>
        <h2>Users</h2>
        {users.length > 0 ? (
          <ul className="list">
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
          <ul className="list">
            {tasks.map(task => (
              <li key={task.id}>
                {task.name} - {task.priority} - Slot: {task.suggestedSlot?.start || 'N/A'}
              </li>
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
