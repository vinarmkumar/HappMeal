import React, { useState, useEffect } from "react";
import "./Header.css";
import logo from "../assets/happymeal-logo.svg";
import homeIcon from "../assets/home-icon.svg";

const Header = ({
  darkMode,
  toggleDarkMode,
  user,
  onSignIn,
  onSignUp,
  onLogout,
  onOpenRecipeGenerator,
  onOpenProfile,
  onNavigate,
  currentView,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        !event.target.closest(".new-mobile-menu") &&
        !event.target.closest(".new-hamburger")
      ) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`new-header ${darkMode ? "dark" : "light"} ${
        isScrolled ? "scrolled" : ""
      }`}
    >
      <div className="new-header-container">
        {/* Brand Logo */}
        <div className="new-brand">
          <div className="new-logo">
            <img
              src={logo}
              alt="HappyMeal"
              className="new-logo-img"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "flex";
              }}
            />
            <div className="new-logo-fallback">🍽️</div>
          </div>
          <span className="new-brand-name">HappyMeal</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="new-nav desktop-nav">
          <button
            onClick={() => onNavigate("home")}
            className={`nav-btn home-btn ${
              currentView === "home" ? "active" : ""
            }`}
            aria-label="Home"
          >
            <img src={homeIcon} alt="Home" className="nav-icon" />
          </button>
          <button
            onClick={() => onNavigate("recipes")}
            className={`nav-btn ${currentView === "recipes" ? "active" : ""}`}
          >
            📖 Recipes
          </button>
          <button
            onClick={() => onNavigate("profile")}
            className={`nav-btn ${currentView === "profile" ? "active" : ""}`}
          >
            👤 Profile
          </button>
        </nav>

        {/* Desktop Actions */}
        <div className="new-actions desktop-actions">
          {/* AI Recipe Button */}
          <button
            onClick={
              user
                ? onOpenRecipeGenerator
                : () => alert("Please sign in to generate recipes")
            }
            className="new-btn new-btn-ai"
            title={user ? "Generate AI Recipe" : "Sign in to generate recipes"}
          >
            <span className="new-btn-icon">✨</span>
            <span className="new-btn-text">AI Recipe</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="new-btn new-btn-theme"
            title={`Switch to ${darkMode ? "light" : "dark"} mode`}
          >
            {darkMode ? "🏖️" : "🌠"}
          </button>

          {/* Auth Buttons */}
          {user && (user.username || user.name) ? (
            <div className="new-user-menu">
              <div className="new-user-avatar">
                {(user.username || user.name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="new-user-dropdown">
                <div className="new-user-info">
                  <span className="new-user-name">
                    {user.username || user.name}
                  </span>
                  <span className="new-user-email">{user.email}</span>
                </div>
                <button
                  onClick={onOpenProfile}
                  className="new-btn new-btn-profile"
                >
                  Profile Settings
                </button>
                <button onClick={onLogout} className="new-btn new-btn-logout">
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="new-auth-buttons">
              <button onClick={onSignIn} className="new-btn new-btn-signin">
                Sign In
              </button>
              <button onClick={onSignUp} className="new-btn new-btn-signup">
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`new-hamburger ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`new-mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <div className="new-mobile-overlay" onClick={closeMobileMenu}></div>
        <div className="new-mobile-content">
          <div className="new-mobile-header">
            <span className="new-mobile-title">Menu</span>
            <button className="new-mobile-close" onClick={closeMobileMenu}>
              ×
            </button>
          </div>

          <div className="new-mobile-nav">
            <button
              onClick={() => {
                onNavigate("home");
                closeMobileMenu();
              }}
              className={`new-mobile-nav-item ${
                currentView === "home" ? "active" : ""
              }`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => {
                onNavigate("recipes");
                closeMobileMenu();
              }}
              className={`new-mobile-nav-item ${
                currentView === "recipes" ? "active" : ""
              }`}
            >
              📖 Recipes
            </button>
            {user && (
              <button
                onClick={() => {
                  onNavigate("profile");
                  closeMobileMenu();
                }}
                className={`new-mobile-nav-item ${
                  currentView === "profile" ? "active" : ""
                }`}
              >
                👤 Profile
              </button>
            )}
          </div>

          <div className="new-mobile-actions">
            {/* AI Recipe Button */}
            <button
              onClick={() => {
                if (user) {
                  onOpenRecipeGenerator();
                } else {
                  alert("Please sign in to generate recipes");
                }
                closeMobileMenu();
              }}
              className="new-mobile-btn new-mobile-btn-ai"
            >
              ✨ Generate AI Recipe
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                toggleDarkMode();
                closeMobileMenu();
              }}
              className="new-mobile-btn new-mobile-btn-theme"
            >
              {darkMode ? "☀️ Light Mode" : "🌑 Dark Mode"}
            </button>

            {/* Auth Section */}
            {user && (user.username || user.name) ? (
              <div className="new-mobile-user">
                <div className="new-mobile-user-info">
                  <div className="new-mobile-user-avatar">
                    {(user.username || user.name || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="new-mobile-user-details">
                    <span className="new-mobile-user-name">
                      {user.username || user.name}
                    </span>
                    <span className="new-mobile-user-email">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    closeMobileMenu();
                  }}
                  className="new-mobile-btn new-mobile-btn-logout"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="new-mobile-auth">
                <button
                  onClick={() => {
                    onSignIn();
                    closeMobileMenu();
                  }}
                  className="new-mobile-btn new-mobile-btn-signin"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onSignUp();
                    closeMobileMenu();
                  }}
                  className="new-mobile-btn new-mobile-btn-signup"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
