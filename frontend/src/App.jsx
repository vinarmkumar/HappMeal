import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import RecipeGeneratorAdvanced from './components/RecipeGeneratorAdvanced';
import UserProfile from './components/UserProfile';
import EnhancedRecipeList from './components/EnhancedRecipeList';
import { useLenis } from './hooks/useLenis';
import './styles/App.css';
import './styles/mobile.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function App() {
  // Initialize Lenis smooth scrolling with advanced configuration
  useLenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    touchMultiplier: 2,
    mouseMultiplier: 1,
    smoothTouch: false,
    autoResize: true,
  });

  // Ensure page starts at top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  
  // Authentication state
  const [user, setUser] = useState(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  // Enhanced state management
  const [currentView, setCurrentView] = useState('home'); // 'home', 'recipes', 'profile'
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showRecipeGenerator, setShowRecipeGenerator] = useState(false);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  }, []);

  const validateToken = useCallback(async (token) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      console.log('Token validation successful:', response.data);
    } catch (error) {
      console.error('Token validation failed:', error.response?.status, error.response?.data);
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Clearing invalid auth data due to 401/403 error');
        clearAuthData();
      } else {
        console.log('Network or other error during token validation, keeping token');
      }
    }
  }, [clearAuthData]);

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('App startup - checking auth:', { 
      hasToken: !!token, 
      hasUserData: !!userData,
      tokenPreview: token ? `${token.substring(0, 20)}...` : null
    });
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Setting user from localStorage:', parsedUser);
        setUser(parsedUser);
        validateToken(token);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        clearAuthData();
      }
    } else {
      console.log('No auth data found in localStorage');
    }

    // Ensure we start from the top and home view
    setCurrentView('home');
    window.scrollTo(0, 0);
  }, [validateToken, clearAuthData]);

  // Dark mode persistence
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Handle view changes and scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setRecipes([]); // Clear recipes if no search query
      return;
    }
    
    try {
      setLoading(true);
      
      // Use AI to search for recipes
      const response = await axios.post(`${API_BASE_URL}/ai/search-recipes`, {
        query: searchQuery
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setRecipes(response.data.data || []);
        console.log(`Found ${response.data.count} AI-generated recipe suggestions`);
      } else {
        console.error('AI search failed:', response.data.message);
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error searching recipes with AI:', error);
      if (error.response?.status === 401) {
        console.log('Authentication error during search - clearing invalid token');
        clearAuthData();
      }
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (recipeId, recipeData = null) => {
    if (!user) {
      alert('Please sign in to save favorites');
      return;
    }
    
    if (!recipeId) {
      console.error('No recipe ID provided to toggleFavorite');
      alert('Cannot update favorites: Missing recipe ID');
      return;
    }
    
    console.log('Toggling favorite for recipe ID:', recipeId);

    try {
      const newFavorites = new Set(favorites);
      if (favorites.has(recipeId)) {
        newFavorites.delete(recipeId);
        await axios.delete(`${API_BASE_URL}/users/favorites/${recipeId}`);
      } else {
        newFavorites.add(recipeId);
        
        // If it's a temporary ID (starts with temp_) and we have recipe data,
        // send the full recipe data to the server
        if (recipeId.toString().startsWith('temp_') && recipeData) {
          console.log('Saving temporary recipe with data:', recipeData);
          await axios.post(`${API_BASE_URL}/users/favorites/${recipeId}`, { recipeData });
        } else {
          // Regular recipe ID
          await axios.post(`${API_BASE_URL}/users/favorites/${recipeId}`);
        }
      }
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites');
    }
  };

  const handleSignIn = (userData, token) => {
    console.log('Successful sign in:', { userData, hasToken: !!token });
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(userData);
    setShowSignIn(false);
  };

  const handleSignUp = (userData, token) => {
    console.log('Successful sign up:', { userData, hasToken: !!token });
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(userData);
    setShowSignUp(false);
  };

  const handleLogout = () => {
    clearAuthData();
    setFavorites(new Set());
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  console.log('App rendering with:', { user, darkMode, recipes: recipes.length });

  const renderContent = () => {
    switch (currentView) {
      case 'recipes':
        return <EnhancedRecipeList 
          darkMode={darkMode} 
          user={user} 
        />;
      case 'profile':
        return user ? (
          <UserProfile 
            user={user} 
            onClose={() => setCurrentView('home')} 
            darkMode={darkMode} 
          />
        ) : (
          <div>Please sign in to view your profile</div>
        );
      default:
        return (
          <Home 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            recipes={recipes}
            loading={loading}
            handleSearch={handleSearch}
            darkMode={darkMode}
            onToggleFavorite={toggleFavorite}
          />
        );
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`} style={{ minHeight: '100vh' }}>
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        user={user}
        onSignIn={() => setShowSignIn(true)}
        onSignUp={() => setShowSignUp(true)}
        onLogout={handleLogout}
        onOpenRecipeGenerator={() => setShowRecipeGenerator(true)}
        onOpenProfile={() => setShowUserProfile(true)}
        onNavigate={setCurrentView}
        currentView={currentView}
      />
      
      {renderContent()}
      
      <Footer darkMode={darkMode} />

      {/* Authentication Modals */}
      {showSignIn && (
        <SignIn 
          onClose={() => setShowSignIn(false)}
          onSuccess={handleSignIn}
          onSwitchToSignUp={() => {
            setShowSignIn(false);
            setShowSignUp(true);
          }}
          darkMode={darkMode}
        />
      )}
      
      {showSignUp && (
        <SignUp 
          onClose={() => setShowSignUp(false)}
          onSuccess={handleSignUp}
          onSwitchToSignIn={() => {
            setShowSignUp(false);
            setShowSignIn(true);
          }}
          darkMode={darkMode}
        />
      )}

      {/* Advanced Recipe Generator Modal */}
      {showRecipeGenerator && (
        <RecipeGeneratorAdvanced 
          onClose={() => setShowRecipeGenerator(false)}
          darkMode={darkMode}
          user={user}
        />
      )}

      {/* User Profile Modal */}
      {showUserProfile && user && (
        <UserProfile 
          user={user} 
          onClose={() => setShowUserProfile(false)} 
          darkMode={darkMode} 
        />
      )}
    </div>
  );
}

export default App;
