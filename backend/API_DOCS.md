# MealCart Backend API Documentation

## Base URL
```
http://localhost:5001/api
```

## Core Recipe Search Endpoints

### 1. Search Recipes by Ingredients

**Endpoint:** `GET /recipes/search`

**Description:** Search for recipes using ingredients you have available.

**Query Parameters:**
- `ingredients` (required): Comma-separated list of ingredients (e.g., "chicken,rice,onion")
- `diet` (optional): Diet type (vegetarian, vegan, gluten-free, etc.)
- `intolerances` (optional): Food intolerances (dairy, egg, gluten, etc.)
- `number` (optional): Number of recipes to return (default: 12, max: 100)
- `offset` (optional): Number of recipes to skip for pagination (default: 0)
- `type` (optional): Meal type (main course, side dish, dessert, etc.)
- `maxReadyTime` (optional): Maximum cooking time in minutes

**Example Request:**
```javascript
// Using fetch
const response = await fetch('/api/recipes/search?ingredients=chicken,rice&number=10');
const data = await response.json();

// Using axios
const response = await axios.get('/api/recipes/search', {
  params: {
    ingredients: 'chicken,rice,onion',
    diet: 'gluten-free',
    number: 15
  }
});
```

**Response Format:**
```json
{
  "success": true,
  "message": "Found 12 recipes",
  "data": [
    {
      "id": "715538",
      "externalId": "715538",
      "name": "What to make for dinner tonight?? Bruschetta Style Pork & Pasta",
      "image": "https://spoonacular.com/recipeImages/715538-312x231.jpg",
      "description": "The recipe What to make for dinner tonight?? Bruschetta Style Pork & Pasta could satisfy your Mediterranean craving in roughly 30 minutes...",
      "sourceUrl": "https://www.foodista.com/recipe/...",
      "servings": 5,
      "readyInMinutes": 30,
      "ingredients": [
        {
          "name": "pork chops",
          "amount": "2",
          "unit": "",
          "original": "2 pork chops, cut into bite sized pieces"
        }
      ],
      "instructions": "Heat olive oil in a large skillet over medium high heat...",
      "nutrition": {
        "calories": 584,
        "protein": 42,
        "carbs": 35,
        "fat": 30,
        "fiber": 3,
        "sugar": 12
      },
      "dietaryTags": ["gluten-free", "dairy-free"],
      "difficulty": "medium",
      "usedIngredients": [...],
      "missedIngredients": [...],
      "spoonacularScore": 91
    }
  ],
  "pagination": {
    "total": 47,
    "page": 1,
    "limit": 12,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "searchParams": {
    "ingredients": "chicken,rice",
    "number": "12"
  }
}
```

### 2. Get Trending Recipes

**Endpoint:** `GET /recipes/trending`

**Description:** Get popular and trending recipes.

**Query Parameters:**
- `number` (optional): Number of recipes to return (default: 12, max: 50)

**Example Request:**
```javascript
const response = await fetch('/api/recipes/trending?number=8');
const data = await response.json();
```

**Response Format:**
```json
{
  "success": true,
  "message": "Found 8 trending recipes",
  "data": [
    {
      "id": "663559",
      "name": "Tex-Mex Pasta Salad",
      "image": "https://spoonacular.com/recipeImages/663559-312x231.jpg",
      "description": "Tex-Mex Pasta Salad might be just the side dish you are searching for...",
      "servings": 12,
      "readyInMinutes": 45,
      "ingredients": [...],
      "instructions": "Bring a large pot of lightly salted water to a boil...",
      "dietaryTags": ["vegetarian"],
      "spoonacularScore": 83
    }
  ],
  "pagination": {
    "total": 8,
    "page": 1,
    "limit": 12,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

## Error Response Format

All endpoints return errors in a consistent format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "ERROR_CODE",
  "data": []
}
```

**Common Error Codes:**
- `MISSING_INGREDIENTS` - No ingredients provided in search
- `API_SERVICE_UNAVAILABLE` - External recipe API not configured
- `API_AUTH_ERROR` - API authentication failed
- `API_QUOTA_EXCEEDED` - Daily API limit reached
- `API_RATE_LIMIT` - Too many requests
- `SERVICE_TIMEOUT` - External service timeout
- `INTERNAL_SERVER_ERROR` - Server error

## Frontend Integration Examples

### React with Axios

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

// Search recipes function
export const searchRecipes = async (ingredients, options = {}) => {
  try {
    const response = await api.get('/recipes/search', {
      params: {
        ingredients: ingredients.join(','),
        ...options
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // API returned an error response
      throw new Error(error.response.data.message || 'Failed to search recipes');
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('Something went wrong. Please try again.');
    }
  }
};

// Get trending recipes function
export const getTrendingRecipes = async (limit = 12) => {
  try {
    const response = await api.get('/recipes/trending', {
      params: { number: limit }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch trending recipes');
  }
};
```

### React Component Example

```javascript
import React, { useState, useEffect } from 'react';
import { searchRecipes, getTrendingRecipes } from '../services/api';

const RecipeSearch = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ingredients, setIngredients] = useState('');

  // Load trending recipes on component mount
  useEffect(() => {
    loadTrendingRecipes();
  }, []);

  const loadTrendingRecipes = async () => {
    try {
      setLoading(true);
      const response = await getTrendingRecipes(8);
      setRecipes(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const ingredientList = ingredients.split(',').map(ing => ing.trim());
      const response = await searchRecipes(ingredientList);
      setRecipes(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Enter ingredients (e.g., chicken, rice, onion)"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Recipes'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      <div className="recipes-grid">
        {recipes.map(recipe => (
          <div key={recipe.id} className="recipe-card">
            <img src={recipe.image} alt={recipe.name} />
            <h3>{recipe.name}</h3>
            <p>{recipe.description}</p>
            <div className="recipe-meta">
              <span>⏱️ {recipe.readyInMinutes} min</span>
              <span>🍽️ {recipe.servings} servings</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeSearch;
```

## Environment Configuration

Make sure these environment variables are set in your `.env` file:

```env
# Spoonacular API Key (required for recipe search)
SPOONACULAR_API_KEY=your_spoonacular_api_key_here

# CORS Configuration (optional, defaults to localhost:3000)
FRONTEND_URL=http://localhost:3000
```

## Rate Limiting and Best Practices

1. **API Limits**: Spoonacular free tier allows 150 requests/day
2. **Caching**: Consider implementing frontend caching for search results
3. **Error Handling**: Always handle API errors gracefully
4. **Loading States**: Show loading indicators during API calls
5. **Pagination**: Use offset/limit for large result sets

## Testing the API

You can test the endpoints using curl:

```bash
# Search recipes
curl "http://localhost:5001/api/recipes/search?ingredients=chicken,rice"

# Get trending recipes
curl "http://localhost:5001/api/recipes/trending?number=5"
```

Or use tools like Postman or Insomnia for more advanced testing.
