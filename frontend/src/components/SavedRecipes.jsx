import React from 'react';
import RecipeCard from './RecipeCard';
import './SavedRecipes.css';

const SavedRecipes = ({ darkMode }) => {
  const [savedRecipes, setSavedRecipes] = React.useState([
    {
      id: 1,
      title: 'Paneer',
      image: '/path/to/paneer-image.jpg',
      description: 'Delicious Indian cottage cheese curry'
    },
    // Add more mock recipes as needed
  ]);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredRecipes = savedRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`saved-recipes-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter Saved Recipe To Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button">
            Search
          </button>
        </div>
      </div>

      <div className="recipes-grid">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <div className="recipe-image">
                <img src={recipe.image} alt={recipe.title} />
              </div>
              <h3 className="recipe-title">{recipe.title}</h3>
              <div className="recipe-actions">
                <button className="action-btn ingridient">Ingridient</button>
                <button className="action-btn recipe">Recipe</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-recipes-message">
            <h3>No saved recipes found</h3>
            <p>Try saving some recipes first!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipes;
