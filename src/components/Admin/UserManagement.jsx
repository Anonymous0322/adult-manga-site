import React, { useMemo, useState } from 'react';
import './UserManagement.css';

const USERS_KEY = 'mangauz_registered_users';

const parseSafe = (value, fallback) => {
  if (value === null || value === undefined || value === 'null') return fallback;
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const normalizeUsers = (value) => (Array.isArray(value) ? value : []);

const isDemoUser = (user) => {
  const text = `${user?.username || ''} ${user?.email || ''}`.toLowerCase();
  return text.includes('darklord') || text.includes('mangamaster');
};

const UserManagement = () => {
  const [users, setUsers] = useState(() => {
    const raw = parseSafe(localStorage.getItem(USERS_KEY), []);
    const normalized = normalizeUsers(raw);
    const cleaned = normalized.filter((u) => !isDemoUser(u));
    if (cleaned.length !== normalized.length || normalized.length !== raw?.length) {
      localStorage.setItem(USERS_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  const updateUser = (userId, patch) => {
    setUsers((prev) => {
      const next = normalizeUsers(prev).map((u) => (u.id === userId ? { ...u, ...patch } : u));
      localStorage.setItem(USERS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const deleteUser = (userId) => {
    setUsers((prev) => {
      const next = normalizeUsers(prev).filter((u) => u.id !== userId);
      localStorage.setItem(USERS_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <div className="management-header">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="no-results">
          <div className="no-results-content">
            <i className="fas fa-users"></i>
            <h3>No users</h3>
            <p>Demo users removed. Connect real backend data.</p>
          </div>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={() =>
                      setSelectedUsers(selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map((u) => u.id))
                    }
                  />
                </th>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() =>
                        setSelectedUsers((prev) =>
                          prev.includes(user.id) ? prev.filter((id) => id !== user.id) : [...prev, user.id]
                        )
                      }
                    />
                  </td>
                  <td>{user.username}</td>
                  <td>
                    <select value={user.role} onChange={(e) => updateUser(user.id, { role: e.target.value })} className="role-select">
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <select value={user.status || 'active'} onChange={(e) => updateUser(user.id, { status: e.target.value })} className="status-select active">
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td>
                    <button className="icon-btn delete" onClick={() => deleteUser(user.id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
