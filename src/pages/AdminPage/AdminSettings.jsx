import React, { useState } from 'react';

const AdminSettings = () => {
  const [maintenance, setMaintenance] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);

  return (
    <div>
      <h2>Admin Settings</h2>
      <div className="admin-card">
        <label className="admin-row">
          <span>Maintenance mode</span>
          <input
            type="checkbox"
            checked={maintenance}
            onChange={(e) => setMaintenance(e.target.checked)}
          />
        </label>
        <label className="admin-row">
          <span>Allow new registration</span>
          <input
            type="checkbox"
            checked={registrationOpen}
            onChange={(e) => setRegistrationOpen(e.target.checked)}
          />
        </label>
      </div>
    </div>
  );
};

export default AdminSettings;
