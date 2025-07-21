import React from 'react';
import './Filters.css';

const Filters = ({ 
  showFilters, 
  filters, 
  setFilters, 
  onClearFilters, 
  darkMode 
}) => {
  if (!showFilters) return null;

  return (
    <div className={`filters-panel ${darkMode ? 'dark' : 'light'}`}>
      <div className="filters-header">
        <h3 className="filters-title">
          Filter Recipes
        </h3>
        <button
          onClick={onClearFilters}
          className="filters-clear"
        >
          Clear all
        </button>
      </div>
      
      <div className="filters-grid">
        <select
          value={filters.diet}
          onChange={(e) => setFilters({...filters, diet: e.target.value})}
          className={`filter-select ${darkMode ? 'dark' : 'light'}`}
        >
          <option value="">Any Diet</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="gluten-free">Gluten Free</option>
          <option value="keto">Keto</option>
        </select>
        
        <select
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
          className={`filter-select ${darkMode ? 'dark' : 'light'}`}
        >
          <option value="">Any Type</option>
          <option value="main course">Main Course</option>
          <option value="dessert">Dessert</option>
          <option value="appetizer">Appetizer</option>
          <option value="breakfast">Breakfast</option>
        </select>
        
        <select
          value={filters.maxReadyTime}
          onChange={(e) => setFilters({...filters, maxReadyTime: e.target.value})}
          className={`filter-select ${darkMode ? 'dark' : 'light'}`}
        >
          <option value="">Any Time</option>
          <option value="15">Under 15 min</option>
          <option value="30">Under 30 min</option>
          <option value="60">Under 1 hour</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
