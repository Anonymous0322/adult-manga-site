import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (!isAdmin()) {
    return (
      <div className="admin-access-denied">
        <h2>Доступ запрещен</h2>
        <p>У вас нет прав для доступа к админ-панели</p>
        <button onClick={() => window.history.back()}>
          Вернуться назад
        </button>
      </div>
    );
  }

  return children;
};

export default AdminRoute;