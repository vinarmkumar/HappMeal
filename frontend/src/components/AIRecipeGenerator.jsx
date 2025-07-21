import React, { useState } from 'react';
import './AIRecipeGenerator.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const AIRecipeGenerator = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    cuisine: 'Italian',
    mealType: 'dinner',
    difficulty: 'intermediate',
    cookingTime: '30',
    dietaryRestrictions: [],
    preferredIngredients: []
  });

  const cuisineOptions = [
    'Italian', 'Mexican', 'Japanese', 'Chinese', 'Indian', 'Thai', 
    'French', 'Mediterranean', 'American', 'Korean', 'Spanish', 'any'
  ];

  const mealTypeOptions = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'];
  const difficultyOptions = ['easy', 'intermediate', 'advanced'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInput = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const generateRecipe = async () => {
    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to generate recipes');
      }

      console.log('Generating recipe with parameters:', formData);

      const response = await fetch(`${API_BASE_URL}/recipes/generate-with-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate recipe');
      }

      setRecipe(data.recipe);
      console.log('✅ Generated recipe with perfect image:', data);
    } catch (err) {
      setError(err.message);
      console.error('Recipe generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async () => {
    if (!recipe) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to save recipes');
      }

      const response = await fetch(`${API_BASE_URL}/ai/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(recipe)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save recipe');
      }

      setIsSaved(true);
      console.log('✅ Recipe saved successfully:', data);
      
      // Reset saved state after 3 seconds for better UX
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
      
    } catch (err) {
      setError(err.message);
      console.error('Recipe save error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Reset saved state when generating a new recipe
  const handleGenerateRecipe = async () => {
    setIsSaved(false);
    await generateRecipe();
  };

  return (
    <div className="ai-recipe-generator">
      <div className="generator-header">
        <h2>🤖 AI Recipe Generator with Perfect Images</h2>
        <p>Generate custom recipes with AI and get perfectly matching photos from Unsplash!</p>
      </div>

      <div className="generator-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Cuisine Type:</label>
            <select 
              name="cuisine" 
              value={formData.cuisine} 
              onChange={handleInputChange}
              className="form-select"
            >
              {cuisineOptions.map(cuisine => (
                <option key={cuisine} value={cuisine}>
                  {cuisine === 'any' ? 'Any Cuisine' : cuisine}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Meal Type:</label>
            <select 
              name="mealType" 
              value={formData.mealType} 
              onChange={handleInputChange}
              className="form-select"
            >
              {mealTypeOptions.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Difficulty:</label>
            <select 
              name="difficulty" 
              value={formData.difficulty} 
              onChange={handleInputChange}
              className="form-select"
            >
              {difficultyOptions.map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Cooking Time (minutes):</label>
            <input
              type="number"
              name="cookingTime"
              value={formData.cookingTime}
              onChange={handleInputChange}
              min="5"
              max="180"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Preferred Ingredients (comma-separated):</label>
          <input
            type="text"
            placeholder="e.g., tomatoes, cheese, chicken, herbs"
            onChange={(e) => handleArrayInput('preferredIngredients', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group full-width">
          <label>Dietary Restrictions (comma-separated):</label>
          <input
            type="text"
            placeholder="e.g., vegetarian, gluten-free, dairy-free"
            onChange={(e) => handleArrayInput('dietaryRestrictions', e.target.value)}
            className="form-input"
          />
        </div>

        <button 
          className="generate-btn" 
          onClick={generateRecipe} 
          disabled={loading}
        >
          {loading ? '🔄 Generating Recipe...' : '🎯 Generate Recipe with Perfect Image'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {recipe && (
        <div className="generated-recipe">
          <div className="recipe-header">
            <div className="recipe-image-container">
              <img 
                src={recipe.image} 
                alt={recipe.name}
                className="recipe-image"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop';
                }}
              />
              <div className="image-source-badge">
                📸 {recipe.image?.includes('unsplash.com') ? 'Unsplash Match' : 'Fallback'}
              </div>
            </div>
            <div className="recipe-info">
              <h3>{recipe.name}</h3>
              <p>{recipe.description}</p>
              <div className="recipe-meta">
                <span>🍽️ {recipe.servings} servings</span>
                <span>⏱️ {recipe.cookingTime} min</span>
                <span>🌍 {recipe.cuisine}</span>
                <span>📊 {recipe.difficulty}</span>
              </div>
            </div>
          </div>

          <div className="recipe-content">
            <div className="ingredients-section">
              <h4>📝 Ingredients ({recipe.ingredients?.length} items)</h4>
              <ul>
                {recipe.ingredients?.map((ingredient, index) => (
                  <li key={index}>
                    <strong>{ingredient.amount}</strong> {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="instructions-section">
              <h4>👨‍🍳 Instructions ({recipe.instructions?.length} steps)</h4>
              <ol>
                {recipe.instructions?.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            {recipe.nutrition && (
              <div className="nutrition-section">
                <h4>📊 Nutrition (per serving)</h4>
                <div className="nutrition-grid">
                  <span>🔥 {recipe.nutrition.calories} cal</span>
                  <span>🥩 {recipe.nutrition.protein} protein</span>
                  <span>🍞 {recipe.nutrition.carbs} carbs</span>
                  <span>🥑 {recipe.nutrition.fat} fat</span>
                </div>
              </div>
            )}

            <div className="recipe-actions">
              <button 
                className={`save-recipe-btn ${isSaved ? 'saved' : ''}`}
                onClick={saveRecipe}
                disabled={saving || isSaved}
              >
                {saving ? '💾 Saving...' : isSaved ? '✅ Recipe Saved!' : '⭐ Save Recipe'}
              </button>
              <button className="regenerate-btn" onClick={handleGenerateRecipe} disabled={loading}>
                🔄 Generate Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecipeGenerator;
