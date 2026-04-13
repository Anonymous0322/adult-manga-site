import React from 'react';
import UploadContent from '../../components/Admin/UploadContent';
import './ContentUpload.css';

const ContentUpload = () => {
  return (
    <div className="admin-content-upload">
      <h1>Загрузка контента</h1>
      <UploadContent />
    </div>
  );
};

export default ContentUpload;