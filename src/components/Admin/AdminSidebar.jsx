import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const { t } = useLanguage();
  const menuItems = [
    { path: '/admin', label: t('adminPanel'), icon: 'fa-tachometer-alt' },
    { path: '/admin/upload', label: t('contentUpload'), icon: 'fa-upload' },
    { path: '/admin/analytics', label: t('analytics'), icon: 'fa-chart-line' },
    { path: '/admin/users', label: t('users'), icon: 'fa-users' },
    { path: '/admin/content', label: t('contentManagement'), icon: 'fa-book' },
    { path: '/admin/comments', label: t('commentsModeration'), icon: 'fa-comments' },
    { path: '/admin/settings', label: t('settings'), icon: 'fa-cog' }
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h3><i className="fas fa-user-shield"></i> {t('adminPanel')}</h3>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

    </aside>
  );
};

export default AdminSidebar;
