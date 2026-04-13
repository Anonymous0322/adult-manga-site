import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar';
import UploadContent from '../components/Admin/UploadContent';
import Analytics from '../components/Admin/Analytics';
import UserManagement from '../components/Admin/UserManagement';
import Dashboard from './AdminPage/Dashboard';
import ContentManagement from './AdminPage/ContentManagement';
import CommentsModeration from './AdminPage/CommentsModeration';
import AdminSettings from './AdminPage/AdminSettings';
import './AdminPage.css';

const AdminPage = () => {
  return (
    <div className="admin-page">
      <AdminSidebar />
      <div className="admin-content">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<UploadContent />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="comments" element={<CommentsModeration />} />
          <Route path="settings" element={<AdminSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;
