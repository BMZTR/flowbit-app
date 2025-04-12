import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

function MainApp() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      setIsLoading(false);
      return;
    }

    axios
      .get("https://flowbit-app.onrender.com/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTasks(response.data || []);
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Échec du chargement des tâches");
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        setIsLoading(false);
      });
  }, [navigate]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="App">
      <h1>FlowBit</h1>
      {error && <p className="error">{error}</p>}
      <h2>Tâches</h2>
      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.name} - {task.priority}</li>
          ))}
        </ul>
      ) : (
        <p>Aucune tâche disponible</p>
      )}
    </div>
  );
}

export default MainApp;
