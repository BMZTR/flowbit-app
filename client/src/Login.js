import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://flowbit-app.onrender.com/api/auth/login",
        { username, password }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      navigate("/app");
    } catch (error) {
      setError("Connexion échouée : identifiants incorrects");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Connexion FlowBit</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nom d'utilisateur ou email"
            required
            style={{ margin: "10px", padding: "5px" }}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            style={{ margin: "10px", padding: "5px" }}
          />
        </div>
        <button type="submit" style={{ padding: "5px 20px" }}>
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default Login;
