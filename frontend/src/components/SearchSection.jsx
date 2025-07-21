import React, { useState } from "react";
import { AnimatedText, BackgroundParallax } from "./ScrollEffects";
import "./SearchSection.css";

const SearchSection = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  darkMode,
  saveRecipe,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [groceryList, setGroceryList] = useState([]);
  const [showGroceryList, setShowGroceryList] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Add ref for scrolling

  // Handle form submission (better for accessibility)
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  const generateRecipe = async () => {
    if (!searchQuery.trim()) return;

    setIsGenerating(true);
    setSaveSuccess(false);
    try {
      // Get the API base URL from environment variable or default to localhost
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5001/api";

      console.log(`Connecting to API at: ${API_BASE_URL}/ai/generate`);

      // Call to backend API to generate recipe based on search query
      const response = await fetch(`${API_BASE_URL}/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
        credentials: "include",
        mode: "cors", // Explicitly request CORS mode
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.success) {
        setGeneratedRecipe(data.recipe);
        setGroceryList(data.groceryList || []);
      } else {
        throw new Error(data.message || "Failed to generate recipe");
      }
    } catch (error) {
      console.error("Error generating recipe:", error);
      // Show error to user
      alert(`Failed to generate recipe: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (generatedRecipe) {
      // First try to get the id property, then try _id as a fallback
      const recipeId = generatedRecipe.id || generatedRecipe._id;

      try {
        setIsSaving(true);

        if (recipeId) {
          console.log("Saving recipe with ID:", recipeId);

          // If it's a temporary ID or we explicitly want to save the recipe properly
          if (recipeId.toString().startsWith("temp_") || !saveSuccess) {
            // First try to save the recipe directly to the database
            const API_BASE_URL =
              import.meta.env.VITE_API_URL || "http://localhost:5001/api";

            try {
              const saveResponse = await fetch(`${API_BASE_URL}/ai/save`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
                body: JSON.stringify({
                  recipeData: {
                    ...generatedRecipe,
                    groceryList,
                  },
                }),
                credentials: "include",
                mode: "cors",
              });

              if (saveResponse.ok) {
                const saveData = await saveResponse.json();
                console.log("Recipe saved successfully:", saveData);

                // Update the recipe ID with the permanent one from the database
                if (saveData.recipe && saveData.recipe.id) {
                  setGeneratedRecipe({
                    ...generatedRecipe,
                    id: saveData.recipe.id,
                    _id: saveData.recipe.id,
                  });
                }

                // Save to user's favorites if that function is available
                if (saveRecipe) {
                  saveRecipe(saveData.recipeId || recipeId, null);
                }

                setSaveSuccess(true);
              } else {
                // Fallback to the old method if the direct save fails
                console.log("Direct save failed, using fallback method");
                if (saveRecipe) {
                  saveRecipe(recipeId, generatedRecipe);
                }
              }
            } catch (error) {
              console.error("Error saving recipe directly:", error);
              // Fallback to the old method
              if (saveRecipe) {
                saveRecipe(recipeId, generatedRecipe);
              }
            }
          } else {
            // For already saved recipes, just toggle favorite status
            if (saveRecipe) {
              saveRecipe(recipeId);
            }
          }
        } else {
          console.error(
            "Cannot save recipe: Missing recipe ID",
            generatedRecipe
          );
          alert("This recipe cannot be saved yet. Please try regenerating it.");
        }
      } catch (error) {
        console.error("Error in handleSaveRecipe:", error);
        alert(`Failed to save recipe: ${error.message}`);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <section id="search-section" className="search-section">
      <div className="search-hero">
        <h2 style={{ color: 'var(--orange)', fontFamily: 'sans-serif', fontSize: '2rem' }}>
  LET HIM COOK
</h2>
<p style={{ color: 'var(--dark-orange)', fontSize: '1.1rem', lineHeight: '1.5' }}>
  Search thousands of recipes, create grocery lists, and discover your
  next favorite meal
</p>
      </div>

      <div className="search-container">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-wrapper">
            <span className="search-icon">🧭</span>
            <input
              type="text"
              placeholder="Search for recipes, ingredients, or cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`search-input ${darkMode ? "dark" : "light"}`}
              aria-label="Search recipes"
              autoComplete="off"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="search-buttons">
            <button type="submit" className="search-button">
              ✨ Search Recipes
            </button>

            <button
              type="button"
              onClick={generateRecipe}
              className={`generate-button ${isGenerating ? "generating" : ""}`}
              disabled={isGenerating}
            >
              {isGenerating ? "⏳ Generating..." : "🧙‍♂️ Generate Recipe"}
            </button>
          </div>
        </form>
      </div>

      {generatedRecipe && (
        <div className="generated-recipe-container">
          <div className="generated-recipe-header">
            <h3>{generatedRecipe.name || generatedRecipe.title}</h3>
            <div className="recipe-actions">
              <button
                className="grocery-list-toggle"
                onClick={() => setShowGroceryList(!showGroceryList)}
              >
                {showGroceryList ? "Hide Grocery List" : "Show Grocery List"}
              </button>
              <button
                className={`save-recipe-button ${saveSuccess ? "saved" : ""}`}
                onClick={handleSaveRecipe}
                disabled={isSaving}
              >
                {isSaving
                  ? "⏳ Saving..."
                  : saveSuccess
                  ? "✅ Saved"
                  : "❤️ Save Recipe"}
              </button>
            </div>
          </div>

          <div className="generated-recipe-content">
            <div className="recipe-details">
              <div className="recipe-description">
                <p>{generatedRecipe.description}</p>
              </div>

              <div className="recipe-instructions">
                <h4>Instructions</h4>
                <ol>
                  {generatedRecipe.instructions?.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            {showGroceryList && (
              <div className="grocery-list">
                <h4>Grocery List</h4>
                <ul>
                  {groceryList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default SearchSection;
