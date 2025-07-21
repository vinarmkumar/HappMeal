import React, { useState, useEffect } from "react";
import "./RecipeGeneratorAdvanced.css";

const RecipeGeneratorAdvanced = ({ onClose, darkMode, user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: [],
    cuisine: "",
    cookingTime: "",
    difficulty: "medium",
    servings: 4,
    mealType: "dinner",
    excludeIngredients: [],
  });
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [nutritionAnalysis, setNutritionAnalysis] = useState(null);

  const dietaryOptions = [
    "vegetarian",
    "vegan",
    "gluten-free",
    "dairy-free",
    "keto",
    "paleo",
    "low-carb",
    "high-protein",
    "nut-free",
    "soy-free",
  ];

  const cuisineOptions = [
    "Italian",
    "Mexican",
    "Asian",
    "American",
    "Indian",
    "Mediterranean",
    "French",
    "Thai",
    "Chinese",
    "Japanese",
  ];

  const difficultyOptions = [
    { value: "easy", label: "Easy (30 min or less)", icon: "🟢" },
    { value: "medium", label: "Medium (30-60 min)", icon: "🟡" },
    { value: "hard", label: "Hard (60+ min)", icon: "🔴" },
  ];

  const mealTypeOptions = [
    { value: "breakfast", label: "Breakfast", icon: "🌅" },
    { value: "lunch", label: "Lunch", icon: "☀️" },
    { value: "dinner", label: "Dinner", icon: "🌙" },
    { value: "snack", label: "Snack", icon: "🍪" },
    { value: "dessert", label: "Dessert", icon: "🍰" },
  ];

  // Load user preferences on mount
  useEffect(() => {
    if (user && user.dietaryPreferences) {
      setPreferences((prev) => ({
        ...prev,
        dietaryRestrictions: user.dietaryPreferences,
      }));
    }
  }, [user]);

  // Camera cleanup
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter((ing) => ing !== ingredient));
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setCameraStream(stream);
      setShowCamera(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please add ingredients manually.");
    }
  };

  const captureImage = async () => {
    if (!cameraStream) return;

    const video = document.getElementById("camera-video");
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageBase64 = canvas.toDataURL("image/jpeg", 0.8);

    setLoading(true);
    try {
      const response = await fetch("/api/ai/recognize-ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ imageBase64 }),
      });

      const data = await response.json();

      if (data.success) {
        const recognizedIngredients = data.data
          .filter((ing) => ing.confidence > 0.7)
          .map((ing) => ing.name);

        setIngredients((prev) => [
          ...new Set([...prev, ...recognizedIngredients]),
        ]);
        setShowCamera(false);
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error recognizing ingredients:", error);
      alert("Error recognizing ingredients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateRecipe = async () => {
    if (ingredients.length === 0) {
      alert("Please add at least one ingredient");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ingredients,
          ...preferences,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedRecipe(data.data);
        setCurrentStep(3);

        // Get nutrition analysis
        analyzeNutrition(data.data.ingredients, data.data.servings);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error generating recipe:", error);
      alert("Error generating recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const analyzeNutrition = async (recipeIngredients, servings) => {
    try {
      const response = await fetch("/api/ai/analyze-nutrition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ingredients: recipeIngredients,
          servings,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNutritionAnalysis(data.data);
      }
    } catch (error) {
      console.error("Error analyzing nutrition:", error);
    }
  };

  const saveRecipe = async () => {
    if (!generatedRecipe) return;

    setLoading(true);
    try {
      const response = await fetch("/api/recipes-enhanced", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...generatedRecipe,
          nutritionInfo: nutritionAnalysis?.per_serving || {},
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Recipe saved successfully!");
        onClose();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("Error saving recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="step-content">
      <h3>Add Your Ingredients</h3>

      {/* Camera Section */}
      <div className="camera-section">
        <button
          onClick={startCamera}
          className="camera-btn"
          disabled={showCamera}
        >
          📷 Scan Ingredients with Camera
        </button>
      </div>

      {/* Camera View */}
      {showCamera && (
        <div className="camera-view">
          <video
            id="camera-video"
            autoPlay
            playsInline
            ref={(video) => {
              if (video && cameraStream) {
                video.srcObject = cameraStream;
              }
            }}
          />
          <div className="camera-controls">
            <button onClick={captureImage} className="capture-btn">
              📸 Capture & Recognize
            </button>
            <button
              onClick={() => {
                setShowCamera(false);
                if (cameraStream) {
                  cameraStream.getTracks().forEach((track) => track.stop());
                  setCameraStream(null);
                }
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Manual Input */}
      <div className="ingredient-input">
        <input
          type="text"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          placeholder="Type an ingredient..."
          onKeyPress={(e) => e.key === "Enter" && addIngredient()}
        />
        <button onClick={addIngredient} className="add-btn">
          Add
        </button>
      </div>

      {/* Ingredient List */}
      <div className="ingredient-list">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-tag">
            <span>{ingredient}</span>
            <button onClick={() => removeIngredient(ingredient)}>×</button>
          </div>
        ))}
      </div>

      {ingredients.length > 0 && (
        <button onClick={() => setCurrentStep(2)} className="next-btn">
          Next: Set Preferences
        </button>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="step-content">
      <h3>Customize Your Recipe</h3>

      <div className="preferences-grid">
        {/* Dietary Restrictions */}
        <div className="preference-group">
          <label>Dietary Restrictions</label>
          <div className="checkbox-grid">
            {dietaryOptions.map((option) => (
              <label key={option} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={preferences.dietaryRestrictions.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setPreferences((prev) => ({
                        ...prev,
                        dietaryRestrictions: [
                          ...prev.dietaryRestrictions,
                          option,
                        ],
                      }));
                    } else {
                      setPreferences((prev) => ({
                        ...prev,
                        dietaryRestrictions: prev.dietaryRestrictions.filter(
                          (d) => d !== option
                        ),
                      }));
                    }
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* Cuisine */}
        <div className="preference-group">
          <label>Cuisine Type</label>
          <select
            value={preferences.cuisine}
            onChange={(e) =>
              setPreferences((prev) => ({ ...prev, cuisine: e.target.value }))
            }
          >
            <option value="">Any Cuisine</option>
            {cuisineOptions.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>

        {/* Meal Type */}
        <div className="preference-group">
          <label>Meal Type</label>
          <div className="meal-type-grid">
            {mealTypeOptions.map((option) => (
              <button
                key={option.value}
                className={`meal-type-btn ${
                  preferences.mealType === option.value ? "active" : ""
                }`}
                onClick={() =>
                  setPreferences((prev) => ({
                    ...prev,
                    mealType: option.value,
                  }))
                }
              >
                <span className="meal-icon">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="preference-group">
          <label>Difficulty Level</label>
          <div className="difficulty-grid">
            {difficultyOptions.map((option) => (
              <button
                key={option.value}
                className={`difficulty-btn ${
                  preferences.difficulty === option.value ? "active" : ""
                }`}
                onClick={() =>
                  setPreferences((prev) => ({
                    ...prev,
                    difficulty: option.value,
                  }))
                }
              >
                <span className="difficulty-icon">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cooking Time */}
        <div className="preference-group">
          <label>Max Cooking Time (minutes)</label>
          <input
            type="number"
            value={preferences.cookingTime}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                cookingTime: e.target.value,
              }))
            }
            placeholder="Any time"
            min="10"
            max="300"
          />
        </div>

        {/* Servings */}
        <div className="preference-group">
          <label>Number of Servings</label>
          <input
            type="number"
            value={preferences.servings}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                servings: parseInt(e.target.value),
              }))
            }
            min="1"
            max="12"
          />
        </div>
      </div>

      <div className="step-actions">
        <button onClick={() => setCurrentStep(1)} className="back-btn">
          Back
        </button>
        <button
          onClick={generateRecipe}
          className="generate-btn"
          disabled={loading}
        >
          {loading ? "Generating Recipe..." : "Generate Recipe"}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="step-content">
      {generatedRecipe && (
        <div className="recipe-result">
          <div className="recipe-header">
            <h2>{generatedRecipe.title}</h2>
            <p className="recipe-description">{generatedRecipe.description}</p>

            <div className="recipe-meta">
              <span className="meta-item">
                ⏱️ {generatedRecipe.prepTime + generatedRecipe.cookingTime} min
              </span>
              <span className="meta-item">
                👥 {generatedRecipe.servings} servings
              </span>
              <span className="meta-item">📊 {generatedRecipe.difficulty}</span>
              <span className="meta-item">🍽️ {generatedRecipe.cuisine}</span>
            </div>

            {generatedRecipe.dietaryTags &&
              generatedRecipe.dietaryTags.length > 0 && (
                <div className="dietary-tags">
                  {generatedRecipe.dietaryTags.map((tag) => (
                    <span key={tag} className="dietary-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
          </div>

          <div className="recipe-content">
            {/* Ingredients */}
            <div className="recipe-section">
              <h3>Ingredients</h3>
              <ul className="ingredients-list">
                {generatedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    <strong>
                      {ingredient.amount} {ingredient.unit}
                    </strong>{" "}
                    {ingredient.name}
                    {ingredient.notes && <em> ({ingredient.notes})</em>}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="recipe-section">
              <h3>Instructions</h3>
              <ol className="instructions-list">
                {generatedRecipe.instructions.map((instruction, index) => (
                  <li key={index}>
                    <div className="instruction-content">
                      <p>{instruction.instruction}</p>
                      {instruction.time > 0 && (
                        <span className="instruction-time">
                          ⏱️ {instruction.time} min
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Nutrition Analysis */}
            {nutritionAnalysis && (
              <div className="recipe-section">
                <h3>Nutrition (per serving)</h3>
                <div className="nutrition-grid">
                  <div className="nutrition-item">
                    <span className="nutrition-label">Calories</span>
                    <span className="nutrition-value">
                      {nutritionAnalysis.per_serving.calories}
                    </span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">Protein</span>
                    <span className="nutrition-value">
                      {nutritionAnalysis.per_serving.protein}g
                    </span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">Carbs</span>
                    <span className="nutrition-value">
                      {nutritionAnalysis.per_serving.carbs}g
                    </span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">Fat</span>
                    <span className="nutrition-value">
                      {nutritionAnalysis.per_serving.fat}g
                    </span>
                  </div>
                </div>

                {nutritionAnalysis.health_notes && (
                  <div className="health-notes">
                    <h4>Health Notes:</h4>
                    <ul>
                      {nutritionAnalysis.health_notes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Tips */}
            {generatedRecipe.tips && (
              <div className="recipe-section">
                <h3>Cooking Tips</h3>
                <p className="cooking-tips">{generatedRecipe.tips}</p>
              </div>
            )}
          </div>

          <div className="recipe-actions">
            <button onClick={() => setCurrentStep(2)} className="back-btn">
              Modify Recipe
            </button>
            <button
              onClick={saveRecipe}
              className="save-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Recipe"}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`recipe-generator-advanced ${darkMode ? "dark" : ""}`}>
      <div className="generator-overlay" onClick={onClose}></div>
      <div className="generator-content">
        <div className="generator-header">
          <h2>PersonalizedCook</h2>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        <div className="progress-bar">
          <div className={`progress-step ${currentStep >= 1 ? "active" : ""}`}>
            <span>1</span>
            <label>Ingredients</label>
          </div>
          <div className={`progress-step ${currentStep >= 2 ? "active" : ""}`}>
            <span>2</span>
            <label>Preferences</label>
          </div>
          <div className={`progress-step ${currentStep >= 3 ? "active" : ""}`}>
            <span>3</span>
            <label>Recipe</label>
          </div>
        </div>

        <div className="generator-body">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Generating your perfect recipe...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeGeneratorAdvanced;
