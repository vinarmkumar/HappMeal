import React from 'react';
import './RecipeList.css';

const RecipeList = ({ 
  recipes, 
  loading, 
  searchQuery 
}) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!loading && recipes.length === 0 && searchQuery) {
    return (
      <div className="no-results">
        <div className="no-results-icon">🍳</div>
        <h3 className="no-results-title">No recipes found</h3>
        <p className="no-results-description">
          Try adjusting your search terms or filters
        </p>
      </div>
    );
  }

  if (recipes.length > 0) {
    return (
      <section className="recipes-section">
        <div className="fade-in">
          <h3 className="recipes-title">
            Found {recipes.length} delicious recipes
          </h3>
          
          <div className="recipes-list-container">
            <ul className="recipes-name-list">
              {recipes.map((recipe) => (
                <li key={recipe.id} className="recipe-name-item">
                  {recipe.name || recipe.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default RecipeList;
