import React from 'react';
import { MagneticElement } from './ScrollEffects';
import './RecipeCard.css';

const RecipeCard = ({ recipe, darkMode, isFavorited, onToggleFavorite }) => {
  return (
    <MagneticElement strength={0.15} className="magnetic-hover">
      <div className={`recipe-card ${darkMode ? 'dark' : 'light'} pulse-glow`}>
        {/* Favorite button positioned absolutely */}
        <button
          onClick={() => onToggleFavorite(recipe.id)}
          className={`recipe-favorite ${isFavorited ? 'favorited' : ''}`}
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          ❤️
        </button>
        
        <div className="recipe-tags">
          {recipe.vegetarian && <span className="recipe-tag">VEGETARIAN</span>}
          {recipe.vegan && <span className="recipe-tag">VEGAN</span>}
          {recipe.veryHealthy && <span className="recipe-tag">HEALTHY</span>}
          {recipe.veryPopular && <span className="recipe-tag">POPULAR</span>}
          {recipe.cheap && <span className="recipe-tag">BUDGET</span>}
          {recipe.readyInMinutes <= 30 && <span className="recipe-tag">EASY</span>}
        </div>
        
        <div className="wave-divider"></div>
        
        <h4 className="recipe-title">
          {recipe.title}
        </h4>
        
        <div className="wave-divider"></div>
        
        <div className="recipe-meta">
          <div className="recipe-meta-item">
            <span className="meta-icon">⏰</span>
            <span>{recipe.readyInMinutes} MIN</span>
          </div>
          <div className="recipe-meta-item">
            <span className="meta-icon">👥</span>
            <span>{recipe.servings} SERVING</span>
          </div>
          <div className="recipe-meta-item">
            <span className="meta-icon">🔥</span>
            <span>{recipe.healthScore || 'N/A'}</span>
          </div>
        </div>
      </div>
    </MagneticElement>
  );
};

export default RecipeCard;
