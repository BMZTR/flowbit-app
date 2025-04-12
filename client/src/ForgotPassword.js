import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
      setMessage(`Recovery code: ${response.data.tempCode} (check server logs)`);
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to process request');
      setMessage('');
    }
  };

  return (
    <div className="auth-container">
      <h1>Recover Password</h1>
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="form-input"
          required
        />
        <button type="submit" className="form-button">Send Recovery Code</button>
      </form>
      <p>
        Back to <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default ForgotPassword;
