import React from 'react';
import './Footer.css';

const Footer = ({ darkMode }) => {
  return (
    <footer className={`footer ${darkMode ? 'dark' : 'light'}`}>
      <div className="footer-content">
        <p className="footer-text">
          Made with ❤️ for food lovers everywhere
        </p>
      </div>
    </footer>
  );
};

export default Footer;
