import React, { useState, useRef, useEffect } from 'react';
import './SimpleAuth.css';

const UserMenu = ({ user, onSignOut, darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = () => {
    setShowLogoutConfirm(true);
  };

  const confirmSignOut = () => {
    setShowLogoutConfirm(false);
    setIsOpen(false);
    onSignOut();
  };

  const cancelSignOut = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <div className="user-actions">
        <button
          className="user-avatar"
          onClick={() => setIsOpen(!isOpen)}
          title={`${user.username || user.name} - Click for menu`}
        >
          {getInitials(user.username || user.name)}
        </button>
        
        <button
          className="logout-btn chef-logout"
          onClick={handleSignOut}
          title="Leave the Kitchen"
        >
          🍽️
        </button>
      </div>

      {isOpen && (
        <div className={`user-dropdown chef-menu ${darkMode ? 'dark' : 'light'}`}>
          <div className="user-dropdown-item user-info chef-info">
            <div className="chef-badge">👨‍🍳 Chef</div>
            <strong>{user.username || user.name}</strong>
            <br />
            <small style={{ opacity: 0.7 }}>{user.email}</small>
          </div>
          <button className="user-dropdown-item">
            🧑‍🍳 Chef Profile
          </button>
          <button className="user-dropdown-item">
            ❤️ Favorite Recipes
          </button>
          <button className="user-dropdown-item">
            🛒 Shopping Lists
          </button>
          <button className="user-dropdown-item">
            📝 My Cookbooks
          </button>
          <button 
            className="user-dropdown-item logout chef-logout-menu"
            onClick={handleSignOut}
          >
            🍽️ Leave Kitchen
          </button>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="logout-confirm-overlay">
          <div className={`logout-confirm-popup ${darkMode ? 'dark' : 'light'}`}>
            <h3>🍽️ Leaving the Kitchen?</h3>
            <p>Are you sure you want to log out?</p>
            <div className="logout-confirm-buttons">
              <button className="stay-button" onClick={cancelSignOut}>
                Stay Cooking
              </button>
              <button className="confirm-logout-button" onClick={confirmSignOut}>
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
