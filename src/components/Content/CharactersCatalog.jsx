import React from 'react';
import './CharactersCatalog.css';

const CharactersCatalog = () => {
  return (
    <div className="characters-catalog">
      <div className="catalog-header">
        <h2>Characters</h2>
      </div>
      <div className="no-results">
        <div className="no-results-content">
          <i className="fas fa-user-friends"></i>
          <h3>No character data</h3>
          <p>Character catalog is empty in production mode.</p>
        </div>
      </div>
    </div>
  );
};

export default CharactersCatalog;
