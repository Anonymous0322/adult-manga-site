import React from 'react';
import Analytics from '../../components/Admin/Analytics';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  return (
    <div className="admin-analytics">
      <h1>Аналитика</h1>
      <Analytics />
    </div>
  );
};

export default AnalyticsDashboard;