import React, { useState } from 'react';
import axios from 'axios';
import './SimpleAuth.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const SignIn = ({ onClose, onSwitchToSignUp, onSuccess, darkMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });
      
      const { user, token } = response.data;
      onSuccess(user, token);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Sign in failed. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div 
        className={`auth-modal ${darkMode ? 'dark' : 'light'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="auth-header">
          <div className="auth-chef-icon">👨‍🍳</div>
          <h2 className="auth-title">Welcome Back, Chef!</h2>
          <p className="auth-subtitle">Ready to whip up something delicious?</p>
          <button className="auth-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">🍽️ Chef's Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''} ${darkMode ? 'dark' : 'light'}`}
              placeholder="Enter your chef's email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">🔐 Secret Recipe Code</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''} ${darkMode ? 'dark' : 'light'}`}
              placeholder="Enter your secret code"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <button 
            type="submit" 
            className="auth-button chef-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner-small"></span>
                <span style={{ marginLeft: '0.5rem' }}>Preparing your kitchen...</span>
              </>
            ) : (
              <>
                <span className="chef-hat">👨‍🍳</span>
                <span>Start Cooking!</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            New to our kitchen?{' '}
            <button 
              className="auth-link" 
              onClick={onSwitchToSignUp}
            >
              Join our chef community! 🍳
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
