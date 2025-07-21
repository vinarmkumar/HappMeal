import React, { useState } from 'react';
import axios from 'axios';
import './IngredientSearch.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const IngredientSearch = ({ onRecipesFound, darkMode }) => {
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!ingredients.trim()) {
      alert('Please enter some ingredients');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes/search-by-ingredients`, {
        params: {
          ingredients: ingredients.trim()
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success && response.data.data) {
        onRecipesFound(response.data.data);
      } else {
        alert('No recipes found with those ingredients');
        onRecipesFound([]); // Clear previous results
      }
    } catch (error) {
      console.error('Error searching by ingredients:', error);
      if (error.response?.status === 401) {
        alert('Authentication error. Please try refreshing the page.');
      } else if (error.response?.status === 404) {
        alert('No recipes found with those ingredients');
        onRecipesFound([]); // Clear previous results
      } else {
        alert('Failed to search recipes. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`ingredient-search ${darkMode ? 'dark' : 'light'}`}>
      <div className="ingredient-search-container glassmorphism">
        <h2 className="ingredient-search-title">🥗 Search by Ingredients</h2>
        <p className="ingredient-search-subtitle">
          Enter ingredients you have at home, separated by commas
        </p>
        
        <div className="ingredient-input-container">
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., chicken, tomatoes, onions, garlic"
            className="ingredient-input"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            className="ingredient-search-btn"
            disabled={loading || !ingredients.trim()}
          >
            {loading ? (
              <span className="loading-spinner">🔄</span>
            ) : (
              '🔍 Find Recipes'
            )}
          </button>
        </div>
        
        <div className="ingredient-tips">
          <h3>💡 Tips:</h3>
          <ul>
            <li>Use common ingredient names (e.g., "chicken breast" instead of "poultry")</li>
            <li>Separate multiple ingredients with commas</li>
            <li>The more ingredients you add, the more specific results you'll get</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IngredientSearch;
