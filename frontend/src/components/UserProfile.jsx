import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const UserProfile = ({ onClose, darkMode }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    displayName: '',
    bio: '',
    location: '',
    dietaryPreferences: [],
    allergens: [],
    skillLevel: 'beginner',
    favoriteRecipes: [],
    mealPlans: [],
    shoppingLists: [],
    pantryItems: [],
    followers: [],
    following: []
  });
  const [mealPlan, setMealPlan] = useState({
    name: '',
    days: 7,
    meals: {}
  });
  const [shoppingList, setShoppingList] = useState({
    name: '',
    items: []
  });
  const [pantryItem, setPantryItem] = useState({
    name: '',
    quantity: '',
    unit: '',
    expiryDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const dietaryOptions = [
    'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 
    'paleo', 'low-carb', 'high-protein', 'nut-free', 'soy-free'
  ];

  const allergenOptions = [
    'peanuts', 'tree nuts', 'dairy', 'eggs', 'soy', 'wheat', 
    'fish', 'shellfish', 'sesame', 'mustard'
  ];

  const skillLevels = [
    { value: 'beginner', label: 'Beginner', icon: '🌱' },
    { value: 'intermediate', label: 'Intermediate', icon: '👨‍🍳' },
    { value: 'advanced', label: 'Advanced', icon: '⭐' },
    { value: 'expert', label: 'Expert', icon: '🏆' }
  ];

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Load user preferences on mount
  useEffect(() => {
    loadUserProfile();
  }, []);  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Profile updated successfully!');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createMealPlan = async () => {
    if (!mealPlan.name.trim()) {
      alert('Please enter a meal plan name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/users/meal-plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(mealPlan)
      });

      const data = await response.json();
      
      if (data.success) {
        setProfile(prev => ({
          ...prev,
          mealPlans: [...prev.mealPlans, data.data]
        }));
        setMealPlan({ name: '', days: 7, meals: {} });
        alert('Meal plan created successfully!');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error creating meal plan:', error);
      alert('Error creating meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createShoppingList = async () => {
    if (!shoppingList.name.trim()) {
      alert('Please enter a shopping list name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/users/shopping-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(shoppingList)
      });

      const data = await response.json();
      
      if (data.success) {
        setProfile(prev => ({
          ...prev,
          shoppingLists: [...prev.shoppingLists, data.data]
        }));
        setShoppingList({ name: '', items: [] });
        alert('Shopping list created successfully!');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error creating shopping list:', error);
      alert('Error creating shopping list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addPantryItem = async () => {
    if (!pantryItem.name.trim()) {
      alert('Please enter an item name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/users/pantry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(pantryItem)
      });

      const data = await response.json();
      
      if (data.success) {
        setProfile(prev => ({
          ...prev,
          pantryItems: [...prev.pantryItems, data.data]
        }));
        setPantryItem({ name: '', quantity: '', unit: '', expiryDate: '' });
        alert('Pantry item added successfully!');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error adding pantry item:', error);
      alert('Error adding pantry item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const followUser = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setProfile(prev => ({
          ...prev,
          following: [...prev.following, userId]
        }));
        alert('Successfully followed user!');
      }
    } catch (error) {
      console.error('Error following user:', error);
      alert('Error following user. Please try again.');
    }
  };

  const renderProfileTab = () => (
    <div className="profile-tab">
      <div className="profile-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
              placeholder="Your display name"
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Your location"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Cooking Preferences</h3>
          <div className="form-group">
            <label>Skill Level</label>
            <div className="skill-level-grid">
              {skillLevels.map(skill => (
                <button
                  key={skill.value}
                  className={`skill-btn ${profile.skillLevel === skill.value ? 'active' : ''}`}
                  onClick={() => setProfile(prev => ({ ...prev, skillLevel: skill.value }))}
                >
                  <span className="skill-icon">{skill.icon}</span>
                  <span>{skill.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Dietary Preferences</label>
            <div className="checkbox-grid">
              {dietaryOptions.map(option => (
                <label key={option} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={profile.dietaryPreferences.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProfile(prev => ({
                          ...prev,
                          dietaryPreferences: [...prev.dietaryPreferences, option]
                        }));
                      } else {
                        setProfile(prev => ({
                          ...prev,
                          dietaryPreferences: prev.dietaryPreferences.filter(d => d !== option)
                        }));
                      }
                    }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Allergens</label>
            <div className="checkbox-grid">
              {allergenOptions.map(option => (
                <label key={option} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={profile.allergens.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProfile(prev => ({
                          ...prev,
                          allergens: [...prev.allergens, option]
                        }));
                      } else {
                        setProfile(prev => ({
                          ...prev,
                          allergens: prev.allergens.filter(a => a !== option)
                        }));
                      }
                    }}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </div>

        <button onClick={updateProfile} className="update-btn" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
    </div>
  );

  const renderMealPlanTab = () => (
    <div className="meal-plan-tab">
      <div className="meal-plan-creator">
        <h3>Create New Meal Plan</h3>
        <div className="form-group">
          <label>Meal Plan Name</label>
          <input
            type="text"
            value={mealPlan.name}
            onChange={(e) => setMealPlan(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Weekly Meal Plan"
          />
        </div>
        <div className="form-group">
          <label>Number of Days</label>
          <select
            value={mealPlan.days}
            onChange={(e) => setMealPlan(prev => ({ ...prev, days: parseInt(e.target.value) }))}
          >
            <option value={1}>1 Day</option>
            <option value={3}>3 Days</option>
            <option value={7}>7 Days</option>
            <option value={14}>14 Days</option>
            <option value={30}>30 Days</option>
          </select>
        </div>

        <div className="meal-plan-grid">
          {days.slice(0, mealPlan.days).map(day => (
            <div key={day} className="day-column">
              <h4>{day}</h4>
              {mealTypes.map(mealType => (
                <div key={`${day}-${mealType}`} className="meal-slot">
                  <label>{mealType}</label>
                  <input
                    type="text"
                    placeholder="Recipe or meal"
                    value={mealPlan.meals[`${day}-${mealType}`] || ''}
                    onChange={(e) => setMealPlan(prev => ({
                      ...prev,
                      meals: {
                        ...prev.meals,
                        [`${day}-${mealType}`]: e.target.value
                      }
                    }))}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <button onClick={createMealPlan} className="create-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Meal Plan'}
        </button>
      </div>

      <div className="meal-plans-list">
        <h3>Your Meal Plans</h3>
        {profile.mealPlans && profile.mealPlans.length > 0 ? (
          <div className="meal-plans-grid">
            {profile.mealPlans.map((plan, index) => (
              <div key={index} className="meal-plan-card">
                <h4>{plan.name}</h4>
                <p>{plan.days} days</p>
                <div className="meal-plan-actions">
                  <button className="view-btn">View</button>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No meal plans yet. Create your first meal plan above!</p>
        )}
      </div>
    </div>
  );

  const renderShoppingTab = () => (
    <div className="shopping-tab">
      <div className="shopping-list-creator">
        <h3>Create Shopping List</h3>
        <div className="form-group">
          <label>List Name</label>
          <input
            type="text"
            value={shoppingList.name}
            onChange={(e) => setShoppingList(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Weekly Groceries"
          />
        </div>
        <button onClick={createShoppingList} className="create-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Shopping List'}
        </button>
      </div>

      <div className="shopping-lists">
        <h3>Your Shopping Lists</h3>
        {profile.shoppingLists && profile.shoppingLists.length > 0 ? (
          <div className="shopping-lists-grid">
            {profile.shoppingLists.map((list, index) => (
              <div key={index} className="shopping-list-card">
                <h4>{list.name}</h4>
                <p>{list.items ? list.items.length : 0} items</p>
                <div className="list-actions">
                  <button className="view-btn">View</button>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No shopping lists yet. Create your first list above!</p>
        )}
      </div>
    </div>
  );

  const renderPantryTab = () => (
    <div className="pantry-tab">
      <div className="pantry-item-creator">
        <h3>Add Pantry Item</h3>
        <div className="pantry-form">
          <div className="form-group">
            <label>Item Name</label>
            <input
              type="text"
              value={pantryItem.name}
              onChange={(e) => setPantryItem(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Rice, Tomatoes"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="text"
                value={pantryItem.quantity}
                onChange={(e) => setPantryItem(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="e.g., 2"
              />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <select
                value={pantryItem.unit}
                onChange={(e) => setPantryItem(prev => ({ ...prev, unit: e.target.value }))}
              >
                <option value="">Select unit</option>
                <option value="kg">Kilograms</option>
                <option value="g">Grams</option>
                <option value="lb">Pounds</option>
                <option value="oz">Ounces</option>
                <option value="cups">Cups</option>
                <option value="tbsp">Tablespoons</option>
                <option value="tsp">Teaspoons</option>
                <option value="pieces">Pieces</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Expiry Date (Optional)</label>
            <input
              type="date"
              value={pantryItem.expiryDate}
              onChange={(e) => setPantryItem(prev => ({ ...prev, expiryDate: e.target.value }))}
            />
          </div>
          <button onClick={addPantryItem} className="add-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </div>

      <div className="pantry-items">
        <h3>Your Pantry</h3>
        {profile.pantryItems && profile.pantryItems.length > 0 ? (
          <div className="pantry-grid">
            {profile.pantryItems.map((item, index) => (
              <div key={index} className="pantry-item-card">
                <h4>{item.name}</h4>
                <p>{item.quantity} {item.unit}</p>
                {item.expiryDate && (
                  <p className="expiry-date">
                    Expires: {new Date(item.expiryDate).toLocaleDateString()}
                  </p>
                )}
                <div className="item-actions">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Remove</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">Your pantry is empty. Add some items above!</p>
        )}
      </div>
    </div>
  );

  const renderSocialTab = () => (
    <div className="social-tab">
      <div className="user-search">
        <h3>Find Friends</h3>
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchUsers(e.target.value);
            }}
            placeholder="Search for users..."
          />
        </div>
        
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(user => (
              <div key={user._id} className="user-result">
                <div className="user-info">
                  <h4>{user.displayName || user.username}</h4>
                  <p>{user.bio}</p>
                  <div className="user-stats">
                    <span>{user.followerCount || 0} followers</span>
                    <span>{user.recipeCount || 0} recipes</span>
                  </div>
                </div>
                <button 
                  onClick={() => followUser(user._id)}
                  className="follow-btn"
                  disabled={profile.following.includes(user._id)}
                >
                  {profile.following.includes(user._id) ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="social-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Following</h4>
            <p className="stat-number">{profile.following ? profile.following.length : 0}</p>
          </div>
          <div className="stat-card">
            <h4>Followers</h4>
            <p className="stat-number">{profile.followers ? profile.followers.length : 0}</p>
          </div>
          <div className="stat-card">
            <h4>Recipes</h4>
            <p className="stat-number">{profile.favoriteRecipes ? profile.favoriteRecipes.length : 0}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`user-profile ${darkMode ? 'dark' : ''}`}>
      <div className="profile-overlay" onClick={onClose}></div>
      <div className="profile-content">
        <div className="profile-header">
          <h2>User Profile</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'meal-plan' ? 'active' : ''}`}
            onClick={() => setActiveTab('meal-plan')}
          >
            📅 Meal Plans
          </button>
          <button 
            className={`tab-btn ${activeTab === 'shopping' ? 'active' : ''}`}
            onClick={() => setActiveTab('shopping')}
          >
            🛒 Shopping
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pantry' ? 'active' : ''}`}
            onClick={() => setActiveTab('pantry')}
          >
            🏪 Pantry
          </button>
          <button 
            className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => setActiveTab('social')}
          >
            👥 Social
          </button>
        </div>

        <div className="profile-body">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'meal-plan' && renderMealPlanTab()}
          {activeTab === 'shopping' && renderShoppingTab()}
          {activeTab === 'pantry' && renderPantryTab()}
          {activeTab === 'social' && renderSocialTab()}
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
