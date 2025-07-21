import React from 'react';
import SearchSection from './SearchSection';
import Filters from './Filters';
import RecipeList from './RecipeList';
import WelcomeSection from './WelcomeSection';

const Home = ({ 
  darkMode, 
  searchQuery, 
  setSearchQuery, 
  searchRecipes, 
  showFilters, 
  setShowFilters, 
  filters, 
  setFilters, 
  clearFilters, 
  recipes, 
  loading, 
  favorites, 
  toggleFavorite, 
  generateGroceryList 
}) => {
  return (
    <>
      <SearchSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={searchRecipes}
        darkMode={darkMode}
      />

      <div className="search-section">
        <div className="search-container">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="search-button"
            style={{ marginBottom: '1rem' }}
          >
            🔧 {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>

        <Filters 
          showFilters={showFilters}
          filters={filters}
          setFilters={setFilters}
          onClearFilters={clearFilters}
          darkMode={darkMode}
        />
      </div>

      <RecipeList 
        recipes={recipes}
        loading={loading}
        darkMode={darkMode}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onAddToCart={generateGroceryList}
        searchQuery={searchQuery}
      />

      {!searchQuery && recipes.length === 0 && !loading && (
        <WelcomeSection darkMode={darkMode} />
      )}
    </>
  );
};

export default Home;
