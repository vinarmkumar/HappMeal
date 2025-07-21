import React, { useState } from 'react';
import axios from 'axios';
import './RecipeGenerator.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const RecipeGenerator = ({ onClose, darkMode }) => {
  const [formData, setFormData] = useState({
    ingredients: '',
    cuisine: '',
    dietaryRestrictions: '',
    mealType: '',
    cookingTime: '',
    servings: '',
    difficulty: '',
    additionalRequests: ''
  });
  const [generatedRecipe, setGeneratedRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cuisineOptions = [
    'Italian', 'Chinese', 'Indian', 'Mexican', 'Mediterranean', 
    'Japanese', 'Thai', 'French', 'American', 'Korean', 'Greek', 'Spanish'
  ];

  const mealTypeOptions = [
    'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Appetizer'
  ];

  const difficultyOptions = [
    'Easy', 'Medium', 'Hard'
  ];

  const cookingTimeOptions = [
    '15 minutes', '30 minutes', '45 minutes', '1 hour', '1.5 hours', '2+ hours'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const createRecipePrompt = () => {
    let prompt = "Generate a detailed recipe based on the following requirements:\n\n";
    
    if (formData.ingredients) {
      prompt += `Ingredients to include: ${formData.ingredients}\n`;
    }
    
    if (formData.cuisine) {
      prompt += `Cuisine type: ${formData.cuisine}\n`;
    }
    
    if (formData.mealType) {
      prompt += `Meal type: ${formData.mealType}\n`;
    }
    
    if (formData.cookingTime) {
      prompt += `Cooking time: ${formData.cookingTime}\n`;
    }
    
    if (formData.servings) {
      prompt += `Number of servings: ${formData.servings}\n`;
    }
    
    if (formData.difficulty) {
      prompt += `Difficulty level: ${formData.difficulty}\n`;
    }
    
    if (formData.dietaryRestrictions) {
      prompt += `Dietary restrictions: ${formData.dietaryRestrictions}\n`;
    }
    
    if (formData.additionalRequests) {
      prompt += `Additional requirements: ${formData.additionalRequests}\n`;
    }

    prompt += `\nPlease provide a complete recipe with:
    1. Recipe name
    2. Complete ingredients list with measurements
    3. Step-by-step cooking instructions
    4. Cooking time and serving information
    5. Any helpful tips or variations
    
    Format the response in a clear, easy-to-read manner.`;

    return prompt;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.ingredients && !formData.additionalRequests) {
      setError('Please provide either ingredients or describe what you want to cook');
      return;
    }

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    // Debug: Log the current auth state
    console.log('Auth check:', { 
      hasToken: !!token, 
      hasUserData: !!userData,
      tokenLength: token?.length,
      userData: userData ? JSON.parse(userData) : null
    });
    
    if (!token || !userData) {
      setError('Please sign in again to generate recipes');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedRecipe('');

    try {
      const prompt = createRecipePrompt();
      
      const response = await axios.post(
        `${API_BASE_URL}/gemini/suggest`,
        {
          prompt,
          context: 'recipe_generation'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setGeneratedRecipe(response.data.suggestion);
    } catch (error) {
      console.error('Recipe generation error:', error);
      
      if (error.response?.status === 401) {
        // Invalid token - clear it and ask user to sign in again
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setError('Your session has expired. Please sign in again to generate recipes.');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to generate recipe. Please try again.';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      ingredients: '',
      cuisine: '',
      dietaryRestrictions: '',
      mealType: '',
      cookingTime: '',
      servings: '',
      difficulty: '',
      additionalRequests: ''
    });
    setGeneratedRecipe('');
    setError('');
  };

  const handleCopyRecipe = () => {
    navigator.clipboard.writeText(generatedRecipe);
    // You could add a toast notification here
  };

  return (
    <div className="recipe-generator-overlay" onClick={onClose}>
      <div 
        className={`recipe-generator-modal ${darkMode ? 'dark' : 'light'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="recipe-generator-header">
          <div className="generator-icon">🧑‍🍳</div>
          <h2 className="generator-title">AI Recipe Generator</h2>
          <p className="generator-subtitle">Let AI create the perfect recipe for you!</p>
          <button className="generator-close" onClick={onClose}>✕</button>
        </div>

        <div className="recipe-generator-content">
          {!generatedRecipe ? (
            <form onSubmit={handleSubmit} className="recipe-generator-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">🥕 Available Ingredients</label>
                  <textarea
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    className={`form-textarea ${darkMode ? 'dark' : 'light'}`}
                    placeholder="List ingredients you have (e.g., chicken, tomatoes, onions...)"
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">🌍 Cuisine Type</label>
                  <select
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleChange}
                    className={`form-select ${darkMode ? 'dark' : 'light'}`}
                  >
                    <option value="">Any Cuisine</option>
                    {cuisineOptions.map(cuisine => (
                      <option key={cuisine} value={cuisine}>{cuisine}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">🍽️ Meal Type</label>
                  <select
                    name="mealType"
                    value={formData.mealType}
                    onChange={handleChange}
                    className={`form-select ${darkMode ? 'dark' : 'light'}`}
                  >
                    <option value="">Any Meal</option>
                    {mealTypeOptions.map(meal => (
                      <option key={meal} value={meal}>{meal}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">⏱️ Cooking Time</label>
                  <select
                    name="cookingTime"
                    value={formData.cookingTime}
                    onChange={handleChange}
                    className={`form-select ${darkMode ? 'dark' : 'light'}`}
                  >
                    <option value="">Any Time</option>
                    {cookingTimeOptions.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">👥 Servings</label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleChange}
                    className={`form-input ${darkMode ? 'dark' : 'light'}`}
                    placeholder="Number of people"
                    min="1"
                    max="20"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">📊 Difficulty Level</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className={`form-select ${darkMode ? 'dark' : 'light'}`}
                  >
                    <option value="">Any Difficulty</option>
                    {difficultyOptions.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">🥗 Dietary Restrictions</label>
                  <input
                    type="text"
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={handleChange}
                    className={`form-input ${darkMode ? 'dark' : 'light'}`}
                    placeholder="e.g., vegetarian, gluten-free, keto"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">💭 Additional Requests</label>
                  <textarea
                    name="additionalRequests"
                    value={formData.additionalRequests}
                    onChange={handleChange}
                    className={`form-textarea ${darkMode ? 'dark' : 'light'}`}
                    placeholder="Describe what you're craving or any special requirements..."
                    rows="2"
                  />
                </div>
              </div>

              {error && (
                <div className="error-message">{error}</div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleReset}
                  className="reset-button"
                >
                  🔄 Reset
                </button>
                <button
                  type="submit"
                  className="generate-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Generating Recipe...
                    </>
                  ) : (
                    <>
                      🪄 Generate Recipe
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="recipe-result">
              <div className="recipe-actions">
                <button
                  onClick={handleCopyRecipe}
                  className="copy-button"
                >
                  📋 Copy Recipe
                </button>
                <button
                  onClick={() => setGeneratedRecipe('')}
                  className="new-recipe-button"
                >
                  🆕 Generate New Recipe
                </button>
              </div>
              
              <div className={`recipe-content ${darkMode ? 'dark' : 'light'}`}>
                <pre>{generatedRecipe}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeGenerator;
