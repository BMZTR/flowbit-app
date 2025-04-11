import React, { useState } from 'react';

const TaskInput = ({ onAddTask }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [priority, setPriority] = useState('moyenne');

  const handleSubmit = () => {
    if (name && duration && !isNaN(duration)) {
      onAddTask({
        userId: 1,
        name,
        duration: parseInt(duration),
        priority,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
      setName('');
      setDuration('');
      setPriority('moyenne');
    }
  };

  return (
    <div className="task-input">
      <input
        type="text"
        placeholder="Nouvelle tâche"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Durée (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="basse">Basse</option>
        <option value="moyenne">Moyenne</option>
        <option value="haute">Haute</option>
      </select>
      <button onClick={handleSubmit}>Ajouter</button>
    </div>
  );
};

export default TaskInput;