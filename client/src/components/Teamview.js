import React from 'react';

const TeamView = ({ users, tasks }) => {
  return (
    <div className="team-view">
      <h2>Vue d'équipe</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong>: {tasks.filter(t => t.userId === user.id).map(t => t.name).join(', ') || 'Aucune tâche'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamView;