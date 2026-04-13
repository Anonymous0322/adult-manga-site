import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const stats = [
    { title: 'Total users', value: '0' },
    { title: 'Total content', value: '0' },
    { title: 'Online now', value: '0' },
    { title: 'New today', value: '0' }
  ];

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Demo analytics removed. Connect backend to display real metrics.</p>

      <div className="stats-grid">
        {stats.map((item) => (
          <div key={item.title} className="stat-card">
            <div className="stat-header">
              <span className="stat-title">{item.title}</span>
            </div>
            <div className="stat-value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
