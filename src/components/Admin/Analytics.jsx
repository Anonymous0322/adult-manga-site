import React from 'react';
import './Analytics.css';

const Analytics = () => {
  return (
    <div className="analytics">
      <h2>Analytics</h2>
      <div className="no-results">
        <div className="no-results-content">
          <i className="fas fa-chart-line"></i>
          <h3>No analytics data</h3>
          <p>Demo analytics removed for production deploy.</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
