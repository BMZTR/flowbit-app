import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, credentials);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      navigate('/app');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <div className="auth-container">
      <h1>FlowBit Login</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username or Email"
          value={credentials.username}
          onChange={e => setCredentials({ ...credentials, username: e.target.value })}
          className="form-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={e => setCredentials({ ...credentials, password: e.target.value })}
          className="form-input"
          required
        />
        <button type="submit" className="form-button">Login</button>
      </form>
      <p>
        Forgot password? <a href="/forgot-password">Recover</a>
      </p>
      <p>
        No account? <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;
