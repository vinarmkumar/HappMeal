import React, { useState, useEffect, useRef } from 'react';
import { useGSAPAnimations } from '../hooks/useGSAPAnimations';
import { useLenisScroll, useParallaxEffects } from '../hooks/useLenisScroll';
import AnimatedRecipeCard from './AnimatedRecipeCard';
import './EnhancedRecipeList.css';

const EnhancedRecipeList = ({ darkMode, user }) => {
  // Initialize animations and smooth scroll
  const containerRef = useGSAPAnimations();
  useLenisScroll();
  useParallaxEffects();
  
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [userFavorites, setUserFavorites] = useState([]);
  const modalBodyRef = useRef(null);

  useEffect(() => {
    loadRecipes();
    loadUserFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  // Handle body scroll when modal opens/closes
  useEffect(() => {
    if (selectedRecipe) {
      document.body.classList.add('modal-open');
      
      // Add escape key listener
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setSelectedRecipe(null);
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedRecipe]);

  // Ensure modal body gets focus for scroll events
  useEffect(() => {
    if (modalBodyRef.current && selectedRecipe) {
      const modalBody = modalBodyRef.current;
      
      // Ensure the modal body is focusable and focused
      modalBody.setAttribute('tabindex', '-1');
      
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        modalBody.focus({ preventScroll: true });
        
        // Force a reflow to ensure proper scroll behavior
        modalBody.offsetHeight; // Trigger reflow
        
        // Ensure scroll is enabled by checking if content overflows
        if (modalBody.scrollHeight > modalBody.clientHeight) {
          modalBody.style.overflowY = 'auto';
        }
      }, 100);
      
      // Add wheel event listener for better trackpad support
      const handleWheel = (e) => {
        // Only handle wheel events on the modal body itself
        if (e.target === modalBody || modalBody.contains(e.target)) {
          e.stopPropagation();
          // Let the browser handle the scroll naturally
        }
      };
      
      modalBody.addEventListener('wheel', handleWheel, { passive: true });
      
      return () => {
        modalBody.removeEventListener('wheel', handleWheel);
      };
    }
  }, [selectedRecipe]);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit
      });

      // Always load user's saved recipes
      const endpoint = `/api/recipes-enhanced/my-recipes?${queryParams}`;

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setRecipes(data.data.recipes);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total
        }));
      }
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserFavorites = async () => {
    if (!user) {
      // No user logged in, set empty favorites
      setUserFavorites([]);
      return;
    }

    try {
      const response = await fetch('/api/users/favorites', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        console.warn('Failed to fetch favorites, status:', response.status);
        setUserFavorites([]);
        return;
      }
      
      const data = await response.json();
      
      console.log('Favorites API response:', data); // Debug log
      
      if (data.success && data.data) {
        // The favorites endpoint returns data.data.recipes, not data.data directly
        const favoriteRecipes = data.data.recipes || [];
        
        if (Array.isArray(favoriteRecipes)) {
          setUserFavorites(favoriteRecipes.map(fav => fav._id));
        } else {
          console.warn('Favorites recipes data is not an array:', favoriteRecipes);
          setUserFavorites([]);
        }
      } else {
        console.warn('Failed to load favorites or no data:', data);
        setUserFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setUserFavorites([]);
    }
  };

  const toggleFavorite = async (recipeId) => {
    try {
      const response = await fetch(`/api/users/favorites/${recipeId}`, {
        method: userFavorites.includes(recipeId) ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        if (userFavorites.includes(recipeId)) {
          setUserFavorites(prev => prev.filter(id => id !== recipeId));
        } else {
          setUserFavorites(prev => [...prev, recipeId]);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const generateShoppingList = async (recipe) => {
    try {
      const response = await fetch('/api/users/shopping-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: `Shopping List for ${recipe.title}`,
          items: recipe.ingredients.map(ing => ({
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
            checked: false
          }))
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Shopping list created successfully!');
      }
    } catch (error) {
      console.error('Error creating shopping list:', error);
      alert('Error creating shopping list. Please try again.');
    }
  };

  const renderRecipeCard = (recipe) => (
    <AnimatedRecipeCard
      key={recipe._id}
      recipe={recipe}
      userFavorites={userFavorites}
      onToggleFavorite={toggleFavorite}
      onViewRecipe={setSelectedRecipe}
      onShoppingList={generateShoppingList}
    />
  );

  const renderRecipeModal = () => {
    if (!selectedRecipe) return null;

    return (
      <div className="recipe-modal">
        <div 
          className="modal-overlay" 
          onClick={(e) => {
            // Only close if clicking directly on overlay, not on child elements
            if (e.target === e.currentTarget) {
              setSelectedRecipe(null);
            }
          }}
        ></div>
        <div className="modal-content">
          <div className="modal-header">
            <h2>{selectedRecipe.name || selectedRecipe.title}</h2>
            <button 
              onClick={() => setSelectedRecipe(null)}
              className="close-modal-btn"
            >
              ×
            </button>
          </div>

          <div className="modal-body" ref={modalBodyRef} tabIndex="-1">
            <div className="recipe-details">
              <p className="recipe-description-full">{selectedRecipe.description}</p>

              <div className="recipe-meta-full">
                <div className="meta-grid">
                  <div className="meta-item">
                    <span className="meta-label">Prep Time:</span>
                    <span>{selectedRecipe.preparationTime || selectedRecipe.prepTime || 0} min</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Cook Time:</span>
                    <span>{selectedRecipe.cookingTime || 0} min</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Servings:</span>
                    <span>{selectedRecipe.servings || 1}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Difficulty:</span>
                    <span>{selectedRecipe.difficulty || 'medium'}</span>
                  </div>
                </div>
              </div>

              <div className="ingredients-section">
                <h3>Ingredients</h3>
                <ul className="ingredients-list">
                  {selectedRecipe.ingredients?.map((ingredient, index) => (
                    <li key={index}>
                      <strong>
                        {ingredient.amount && `${ingredient.amount} `}
                        {ingredient.unit && `${ingredient.unit} `}
                      </strong>
                      {ingredient.name || ingredient.original}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="instructions-section">
                <h3>Instructions</h3>
                <ol className="instructions-list">
                  {Array.isArray(selectedRecipe.instructions) 
                    ? selectedRecipe.instructions.map((instruction, index) => (
                        <li key={index}>
                          <p>{typeof instruction === 'string' ? instruction : instruction.instruction}</p>
                          {instruction.time > 0 && (
                            <span className="instruction-time">⏱️ {instruction.time} min</span>
                          )}
                        </li>
                      ))
                    : selectedRecipe.instructions?.split('\n').map((instruction, index) => (
                        <li key={index}>
                          <p>{instruction}</p>
                        </li>
                      ))
                  }
                </ol>
              </div>

              {selectedRecipe.tips && (
                <div className="tips-section">
                  <h3>Tips</h3>
                  <p>{selectedRecipe.tips}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`enhanced-recipe-list ${darkMode ? 'dark' : ''}`}>
      {/* Modern Header with Gradient Background */}
      <div className="recipe-list-header">
        <div className="header-background">
          <div className="gradient-overlay"></div>
        </div>
        
        <div className="header-content">
          <div className="title-section">
            <h1 className="main-title">My Saved Recipes</h1>
            <p className="subtitle">Your personal collection of delicious recipes</p>
          </div>
          
          <div className="stats-card">
            <div className="stat-item">
              <span className="stat-number">{recipes.length}</span>
              <span className="stat-label">Recipes</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">{Math.ceil(recipes.length / pagination.limit)}</span>
              <span className="stat-label">Pages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area with Glass Effect */}
      <div className="recipe-list-content">
        <div className="content-container">
          <div ref={containerRef} className="recipes-grid">
            {loading ? (
              <div className="loading-state">
                <div className="loading-card">
                  <div className="loading-spinner"></div>
                  <h3>Loading your recipes...</h3>
                  <p>Preparing your delicious collection</p>
                </div>
              </div>
            ) : recipes.length > 0 ? (
              recipes.map(renderRecipeCard)
            ) : (
              <div className="empty-state">
                <div className="empty-card">
                  <div className="empty-icon">🍽️</div>
                  <h3>No saved recipes yet</h3>
                  <p>Start exploring and save recipes you love!</p>
                  <div className="empty-actions">
                    <button className="explore-btn">
                      <span>🔍</span>
                      Explore Recipes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {renderRecipeModal()}
    </div>
  );
};

export default EnhancedRecipeList;
