import React from 'react';
import './ForumPage.css';

const ForumPage = () => {
  return (
    <div className="forum-page">
      <div className="page-header">
        <h1>Forum</h1>
        <p>Community posts will appear here when real data is connected.</p>
      </div>
      <div className="no-results">
        <div className="no-results-content">
          <i className="fas fa-comments"></i>
          <h3>No topics yet</h3>
          <p>Demo forum data has been removed.</p>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
