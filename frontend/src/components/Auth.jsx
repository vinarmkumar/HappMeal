import React from 'react';
import UserMenu from './UserMenu';
import './SimpleAuth.css';

const Auth = ({ darkMode, user, onSignIn, onSignUp, onLogout }) => {
  return (
    <div className="auth-component">
      {user && (user.username || user.name) ? (
        <UserMenu 
          user={user} 
          onSignOut={onLogout} 
          darkMode={darkMode} 
        />
      ) : (
        <div className="auth-buttons chef-buttons">
          <button 
            className="auth-btn signin-btn chef-signin"
            onClick={onSignIn}
          >
            <span className="btn-icon">👨‍🍳</span>
            <span>Enter Kitchen</span>
          </button>
          <button 
            className="auth-btn signup-btn chef-signup"
            onClick={onSignUp}
          >
            <span className="btn-icon">🧑‍🍳</span>
            <span>Become Chef</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Auth;
