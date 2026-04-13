import React from 'react';
import './TopUsers.css';

const TopUsers = () => {
  return (
    <div className="top-users-card">
      <h3><i className="fas fa-trophy"></i> Top users</h3>
      <div className="users-grid">
        <div className="user-card">
          <div className="user-info">
            <div className="username">No data</div>
            <div className="user-score">Production mode</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUsers;
