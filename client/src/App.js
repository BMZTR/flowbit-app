import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

function MainApp() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', duration: '', priority: 'moyenne' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Checking token in MainApp');
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to /login');
      navigate('/login');
      return;
    }

    console.log('Fetching tasks with token:', token);
    axios.get(`${process.env.REACT_APP_API_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        console.log('Tasks fetched:', response.data);
        setTasks(response.data || []);
      })
      .catch(error => {
        console.error('Fetch tasks error:', error.response?.status, error.message);
        setError('Échec du chargement des tâches : ' + (error.message || 'Erreur inconnue'));
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log('Unauthorized, clearing token and redirecting to /login');
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          navigate('/login');
        }
      });
  }, [navigate]);

  useEffect(() => {
    console.log('Fetching users');
    axios.get(`${process.env.REACT_APP_API_URL}/api/users`)
      .then(response => {
        console.log('Users fetched:', response.data);
        setUsers(response.data || []);
      })
      .catch(error => {
        console.error('Fetch users error:', error.response?.status, error.message);
        setError('Échec du chargement des utilisateurs : ' + (error.message || 'Erreur inconnue'));
      });
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      console.log('Adding task:', newTask);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/tasks`,
        {
          name: newTask.name,
          duration: parseInt(newTask.duration),
          priority: newTask.priority
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Task added:', response.data);
      setTasks([...tasks, response.data]);
      setNewTask({ name: '', duration: '', priority: 'moyenne' });
      setError('');
    } catch (error) {
      console.error('Add task error:', error.response?.status, error.message);
      setError('Échec de l’ajout de la tâche : ' + (error.message || 'Erreur inconnue'));
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
      }
    }
  };

  return (
    <div className="App">
      <h1>FlowBit</h1>
      {error && <p className="error">{error}</p>}
      <div className="form-container">
        <h2>Ajouter une tâche</h2>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            value={newTask.name}
            onChange={e => setNewTask({ ...newTask, name: e.target.value })}
            placeholder="Nom de la tâche"
            className="form-input"
            required
          />
          <input
            type="number"
            value={newTask.duration}
            onChange={e => setNewTask({ ...newTask, duration: e.target.value })}
            placeholder="Durée (min)"
            className="form-input"
            required
          />
          <select
            value={newTask.priority}
            onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
            className="form-select"
            required
          >
            <option value="basse">Basse</option>
            <option value="moyenne">Moyenne</option>
            <option value="haute">Haute</option>
          </select>
          <button type="submit" className="form-button">Ajouter</button>
        </form>
      </div>
      <div>
        <h2>Utilisateurs</h2>
        {users.length > 0 ? (
          <ul className="list">
            {users.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        ) : (
          <p>Aucun utilisateur disponible</p>
        )}
      </div>
      <div>
        <h2>Tâches</h2>
        {tasks.length > 0 ? (
          <ul className="list">
            {tasks.map(task => (
              <li key={task.id}>
                {task.name} - {task.priority} - Slot: {task.suggestedSlot?.start || 'N/A'}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune tâche disponible</p>
        )}
      </div>
    </div>
  );
}

export default MainApp;
