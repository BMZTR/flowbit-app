import React from 'react';

const TaskList = ({ tasks }) => {
  return (
    <div className="task-list">
      <h2>Vos tâches</h2>
      {tasks.length === 0 ? (
        <p>Aucune tâche pour le moment.</p>
      ) : (
        tasks.map(task => (
          <div key={task.id} className="task-item">
            <p><strong>{task.name}</strong> ({task.duration} min, Priorité: {task.priority})</p>
            {task.suggestedSlot ? (
              <p>Suggéré: {new Date(task.suggestedSlot.start).toLocaleTimeString()} - {new Date(task.suggestedSlot.end).toLocaleTimeString()}</p>
            ) : (
              <p>Aucun créneau suggéré</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;