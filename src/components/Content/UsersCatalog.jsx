import React, { useMemo, useState } from 'react';
import './UsersCatalog.css';

const USERS_KEY = 'mangauz_registered_users';

const parseSafe = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const UsersCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('level');
  const registeredUsers = useMemo(() => parseSafe(localStorage.getItem(USERS_KEY), []), []);

  const users = useMemo(() => {
    const filtered = registeredUsers.filter((u) => (u.username || '').toLowerCase().includes(searchTerm.toLowerCase()));
    return filtered.sort((a, b) => {
      if (sortBy === 'points') return (b.points || 0) - (a.points || 0);
      return (b.level || 0) - (a.level || 0);
    });
  }, [registeredUsers, searchTerm, sortBy]);

  return (
    <div className="users-catalog">
      <div className="catalog-header">
        <h2>Users</h2>
        <div className="catalog-controls">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search users..." />
          </div>
          <div className="sort-controls">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="level">By level</option>
              <option value="points">By points</option>
            </select>
          </div>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="no-results">
          <div className="no-results-content">
            <i className="fas fa-users"></i>
            <h3>No users yet</h3>
            <p>No production user data available.</p>
          </div>
        </div>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <article key={user.id} className="user-card">
              <div className="user-top">
                <div className="user-avatar">{(user.username || '?')[0]}</div>
                <div>
                  <h3>{user.username}</h3>
                  <p>Level {user.level || 1} • {(user.points || 0).toLocaleString()} pts</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersCatalog;
