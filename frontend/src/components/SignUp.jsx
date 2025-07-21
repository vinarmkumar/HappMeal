import React, { useState } from 'react';
import axios from 'axios';
import './SimpleAuth.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const SignUp = ({ onClose, onSwitchToSignIn, onSuccess, darkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password || !formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.trim().length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword || !formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password.trim() !== formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const requestData = {
        username: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      };
      
      console.log('Sending registration request:', requestData);
      
      const response = await axios.post(`${API_BASE_URL}/auth/register`, requestData);
      
      const { user, token } = response.data;
      onSuccess(user, token);
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Sign up failed. Please try again.';
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
          <div className="auth-chef-icon cooking">🧑‍🍳</div>
          <h2 className="auth-title">Join Our Kitchen!</h2>
          <p className="auth-subtitle">Become a master chef with personalized recipes</p>
          <button className="auth-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">👨‍🍳 Chef Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'error' : ''} ${darkMode ? 'dark' : 'light'}`}
              placeholder="What should we call you, Chef?"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">🍽️ Kitchen Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''} ${darkMode ? 'dark' : 'light'}`}
              placeholder="Your chef's email address"
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
              placeholder="Create your secret kitchen code"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">🔒 Confirm Secret Code</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''} ${darkMode ? 'dark' : 'light'}`}
              placeholder="Confirm your secret code"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <button 
            type="submit" 
            className="auth-button chef-button signup"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner-small"></span>
                <span style={{ marginLeft: '0.5rem' }}>Setting up your kitchen...</span>
              </>
            ) : (
              <>
                <span className="chef-hat">🧑‍🍳</span>
                <span>Join the Kitchen!</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already a master chef?{' '}
            <button 
              className="auth-link" 
              onClick={onSwitchToSignIn}
            >
              Return to your kitchen! 👨‍🍳
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
