import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Register() {
  const [user, setUser] = useState({ name: '', email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, user);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      navigate('/app');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to register');
    }
  };

  return (
    <div className="auth-container">
      <h1>FlowBit Register</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={user.name}
          onChange={e => setUser({ ...user, name: e.target.value })}
          className="form-input"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={e => setUser({ ...user, email: e.target.value })}
          className="form-input"
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={user.username}
          onChange={e => setUser({ ...user, username: e.target.value })}
          className="form-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={e => setUser({ ...user, password: e.target.value })}
          className="form-input"
          required
        />
        <button type="submit" className="form-button">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Register;
