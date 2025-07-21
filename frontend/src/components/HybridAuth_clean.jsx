import React from 'react';
import UserMenu from './UserMenu';
import './HybridAuth.css';

const HybridAuth = ({ darkMode, user, onSignIn, onSignUp, onSignOut }) => {
  return (
    <div className="hybrid-auth">
      {/* Custom Authentication */}
      <div className="custom-auth-section">
        {user && (user.username || user.name) ? (
          <UserMenu 
            user={user} 
            onSignOut={onSignOut} 
            darkMode={darkMode} 
          />
        ) : (
          <div className="auth-buttons chef-buttons glassy-buttons">
            <button 
              className="auth-btn signin-btn chef-signin glassy-btn"
              onClick={onSignIn}
            >
              <span className="btn-icon">👨‍🍳</span>
              <span>Enter Kitchen</span>
            </button>
            <button 
              className="auth-btn signup-btn chef-signup glassy-btn"
              onClick={onSignUp}
            >
              <span className="btn-icon">🧑‍🍳</span>
              <span>Become Chef</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HybridAuth;
