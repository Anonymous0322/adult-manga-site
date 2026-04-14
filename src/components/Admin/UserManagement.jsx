import React, { useEffect, useMemo, useState } from 'react';
import { usersApi } from '../../utils/api';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await usersApi.list({ page: 1, limit: 200 });
      setUsers(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          String(user.username || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          String(user.email || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  const updateUser = async (userId, patch) => {
    const previous = users;
    setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, ...patch } : u)));

    try {
      await usersApi.update(userId, patch);
    } catch (err) {
      setUsers(previous);
      setError(err?.response?.data?.message || 'Failed to update user');
    }
  };

  const deleteUser = async (userId) => {
    const previous = users;
    setUsers((prev) => prev.filter((u) => u._id !== userId));

    try {
      await usersApi.delete(userId);
    } catch (err) {
      setUsers(previous);
      setError(err?.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <div className="management-header">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="no-results" style={{ marginBottom: '0.75rem' }}>
          <div className="no-results-content">
            <h3>Request failed</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="no-results">
          <div className="no-results-content">
            <h3>Loading users...</h3>
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="no-results">
          <div className="no-results-content">
            <i className="fas fa-users"></i>
            <h3>No users</h3>
            <p>No registered users found.</p>
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
                      setSelectedUsers(
                        selectedUsers.length === filteredUsers.length
                          ? []
                          : filteredUsers.map((u) => u._id)
                      )
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
                <tr key={user._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() =>
                        setSelectedUsers((prev) =>
                          prev.includes(user._id)
                            ? prev.filter((id) => id !== user._id)
                            : [...prev, user._id]
                        )
                      }
                    />
                  </td>
                  <td>
                    <div>{user.username}</div>
                    <small>{user.email}</small>
                  </td>
                  <td>
                    <select
                      value={user.role || 'user'}
                      onChange={(e) => updateUser(user._id, { role: e.target.value })}
                      className="role-select"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span className="status-select active">Active</span>
                  </td>
                  <td>
                    <button className="icon-btn delete" onClick={() => deleteUser(user._id)}>
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
