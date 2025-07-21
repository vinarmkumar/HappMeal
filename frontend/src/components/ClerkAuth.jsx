import React from 'react';
import { 
  SignInButton, 
  SignUpButton, 
  UserButton, 
  useUser, 
  SignedIn, 
  SignedOut 
} from '@clerk/clerk-react';
import './ClerkAuth.css';

const ClerkAuth = ({ darkMode }) => {
  const { user } = useUser();

  return (
    <div className="clerk-auth">
      {/* When user is signed out */}
      <SignedOut>
        <div className="auth-buttons chef-buttons glassy-buttons">
          <SignInButton mode="modal">
            <button className="auth-btn signin-btn chef-signin glassy-btn">
              <span className="btn-icon">👨‍🍳</span>
              <span>Enter Kitchen</span>
            </button>
          </SignInButton>
          
          <SignUpButton mode="modal">
            <button className="auth-btn signup-btn chef-signup glassy-btn">
              <span className="btn-icon">🧑‍🍳</span>
              <span>Become Chef</span>
            </button>
          </SignUpButton>
        </div>
      </SignedOut>

      {/* When user is signed in */}
      <SignedIn>
        <div className={`user-menu-container ${darkMode ? 'dark' : 'light'}`}>
          <div className="chef-welcome">
            <span className="chef-greeting">
              Welcome back, Chef {user?.firstName || user?.username || 'Chef'}! 👨‍🍳
            </span>
          </div>
          
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "clerk-avatar-box",
                userButtonTrigger: "clerk-user-button"
              },
              variables: {
                colorPrimary: "#ff6b35",
                colorBackground: darkMode ? "#1f2937" : "#ffffff",
                colorText: darkMode ? "#ffffff" : "#1f2937"
              }
            }}
            afterSignOutUrl="/"
          />
        </div>
      </SignedIn>
    </div>
  );
};

export default ClerkAuth;
