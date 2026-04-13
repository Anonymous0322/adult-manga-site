import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: '',
    banner: ''
  });

  useEffect(() => {
    if (!user) return;
    const cached = localStorage.getItem(`mangauz_profile_${user.id}`);
    if (cached) {
      setProfileData(JSON.parse(cached));
      return;
    }
    setProfileData({
      username: user.username || '',
      email: user.email || '',
      bio: 'Manga fan and active reader.',
      avatar: user.avatar || '',
      banner: user.banner || ''
    });
  }, [user]);

  const tabs = useMemo(
    () => [
      { id: 'overview', label: 'Overview', icon: 'fa-home' },
      { id: 'library', label: 'Library', icon: 'fa-book' },
      { id: 'reviews', label: 'Reviews', icon: 'fa-star' },
      { id: 'settings', label: 'Settings', icon: 'fa-cog' }
    ],
    []
  );

  if (!user) {
    return (
      <div className="profile-page">
        <div className="not-logged-in">
          <h2>Please login first</h2>
        </div>
      </div>
    );
  }

  const saveProfile = () => {
    const next = { ...profileData };
    localStorage.setItem(`mangauz_profile_${user.id}`, JSON.stringify(next));
    updateProfile({
      username: next.username,
      email: next.email,
      avatar: next.avatar,
      banner: next.banner
    });
    setIsEditing(false);
  };

  const onAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const base64 = await toBase64(file);
    setProfileData((prev) => ({ ...prev, avatar: base64 }));
  };

  const onBannerChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const base64 = await toBase64(file);
    setProfileData((prev) => ({ ...prev, banner: base64 }));
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-cover" style={profileData.banner ? { backgroundImage: `url(${profileData.banner})` } : undefined}>
          <div className="cover-overlay"></div>
          {isEditing && (
            <label className="file-btn banner-btn">
              Upload banner
              <input type="file" accept="image/*" onChange={onBannerChange} hidden />
            </label>
          )}
        </div>

        <div className="profile-info">
          <div className="avatar-section">
            <div className="avatar-container">
              <div className="avatar">
                {profileData.avatar ? <img src={profileData.avatar} alt={profileData.username} /> : <i className="fas fa-user"></i>}
              </div>
              {isEditing && (
                <label className="file-btn">
                  Upload avatar
                  <input type="file" accept="image/*" onChange={onAvatarChange} hidden />
                </label>
              )}
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-header-row">
              {isEditing ? (
                <input
                  className="username-input"
                  value={profileData.username}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, username: e.target.value }))}
                />
              ) : (
                <h1 className="username">{profileData.username}</h1>
              )}

              {isEditing ? (
                <div className="edit-buttons">
                  <button className="save-btn" onClick={saveProfile}>Save</button>
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              ) : (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <i className="fas fa-edit"></i>
                  Edit profile
                </button>
              )}
            </div>

            <div className="profile-meta">
              {isEditing ? (
                <input
                  className="email-input"
                  value={profileData.email}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                />
              ) : (
                <span className="meta-item"><i className="fas fa-envelope"></i>{profileData.email}</span>
              )}
            </div>

            <div className="profile-bio">
              <h3>About</h3>
              {isEditing ? (
                <textarea
                  className="bio-input"
                  value={profileData.bio}
                  onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                />
              ) : (
                <p>{profileData.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <div className="tabs-nav">
          {tabs.map((tab) => (
            <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <i className={`fas ${tab.icon}`}></i> {tab.label}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {activeTab === 'overview' && <div className="library-tab"><p>Profile is ready to use.</p></div>}
          {activeTab === 'library' && <div className="library-tab"><p>Your saved titles will appear here.</p></div>}
          {activeTab === 'reviews' && <div className="library-tab"><p>Your reviews will appear here.</p></div>}
          {activeTab === 'settings' && <div className="settings-tab"><p>Use global Settings page for language and preferences.</p></div>}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
