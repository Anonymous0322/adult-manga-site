import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaCog, FaSignOutAlt, FaUser, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../Auth/LoginModal';
import RegisterModal from '../Auth/RegisterModal';
import './UserMenu.css';

const UserMenu = () => {
  const { user, logout, isAdmin } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <>
      <div className="user-menu-container" ref={dropdownRef}>
        {user ? (
          <div className="user-profile" onClick={() => setShowDropdown((p) => !p)}>
            <div className="user-avatar">{user.avatar ? <img src={user.avatar} alt={user.username} /> : <FaUser />}</div>
            <span className="user-name">{user.username}</span>

            {showDropdown && (
              <div className="user-dropdown" onClick={(e) => e.stopPropagation()}>
                <div className="user-info">
                  <div className="user-level">Level: {user.level}</div>
                  <div className="user-points">Points: {user.points}</div>
                  {isAdmin() && <div className="user-role admin-badge"><i className="fas fa-crown"></i> Administrator</div>}
                </div>
                <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}><FaUser /> Profile</Link>
                <Link to="/library" className="dropdown-item" onClick={() => setShowDropdown(false)}><FaBook /> Library</Link>
                {isAdmin() && <Link to="/admin" className="dropdown-item admin-link" onClick={() => setShowDropdown(false)}><FaUserShield /> Admin Panel</Link>}
                <Link to="/settings" className="dropdown-item" onClick={() => setShowDropdown(false)}><FaCog /> Settings</Link>
                <button onClick={() => { logout(); setShowDropdown(false); }} className="dropdown-item logout"><FaSignOutAlt /> Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="login-btn" onClick={() => setShowLoginModal(true)}>Login</button>
            <button className="register-btn" onClick={() => setShowRegisterModal(true)}>Register</button>
          </div>
        )}
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSwitchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}
      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          onSwitchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </>
  );
};

export default UserMenu;
