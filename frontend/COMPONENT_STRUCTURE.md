# MealCart Component Structure

## Components & CSS Organization

### 📁 Components with Individual CSS Files

1. **Header Component**
   - File: `src/components/Header.jsx`
   - CSS: `src/components/Header.css`
   - Features: Logo, title, dark mode toggle

2. **SearchSection Component**
   - File: `src/components/SearchSection.jsx`
   - CSS: `src/components/SearchSection.css`
   - Features: Hero text, search input, search button

3. **WelcomeSection Component**
   - File: `src/components/WelcomeSection.jsx`
   - CSS: `src/components/WelcomeSection.css`
   - Features: Welcome message, feature cards

4. **Filters Component**
   - File: `src/components/Filters.jsx`
   - CSS: `src/components/Filters.css`
   - Features: Diet, type, time filters

5. **RecipeCard Component**
   - File: `src/components/RecipeCard.jsx`
   - CSS: `src/components/RecipeCard.css`
   - Features: Recipe display, favorite button, add to cart

6. **RecipeList Component**
   - File: `src/components/RecipeList.jsx`
   - CSS: `src/components/RecipeList.css`
   - Features: Recipe grid, loading state, no results

7. **Footer Component**
   - File: `src/components/Footer.jsx`
   - CSS: `src/components/Footer.css`
   - Features: Simple footer with message

### 📁 Global Styles

- **App.css**: Global app container and theme styles
- **index.css**: Base reset and font imports

### 🎨 CSS Benefits

- ✅ **Modular CSS**: Each component has its own stylesheet
- ✅ **Easy Maintenance**: Styles are isolated to specific components
- ✅ **No Tailwind**: Pure CSS with full control
- ✅ **Component Imports**: Each component imports its own CSS
- ✅ **Clean Separation**: Logic and styles are properly separated

### 🚀 Usage

Each component is self-contained with its own styles:

```jsx
import React from 'react';
import './ComponentName.css'; // Component-specific styles

const ComponentName = () => {
  return (
    <div className="component-specific-class">
      {/* Component content */}
    </div>
  );
};
```

This structure makes the codebase more maintainable and follows React best practices for component organization.
