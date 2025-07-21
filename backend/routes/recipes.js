const express = require('express');
const Recipe = require('../models/Recipe');
const { auth } = require('../middleware/auth');
const { searchRecipes, getTrendingRecipes } = require('../controllers/recipeController');
const { logger } = require('../utils/logger');

const router = express.Router();

// Search recipes using external Food API (Spoonacular) - Updated to use controller
router.get('/search', searchRecipes);

// Search recipes by ingredients - also uses the same controller
router.get('/search-by-ingredients', searchRecipes);

// Get trending/popular recipes
router.get('/trending', getTrendingRecipes);

// Save a recipe to MongoDB
router.post('/save', auth, async (req, res) => {
  const startTime = Date.now();
  try {
    const { 
      externalId, 
      name, 
      image, 
      description, 
      ingredients, 
      instructions,
      cookingTime,
      preparationTime,
      servings,
      difficulty,
      dietaryTags,
      nutrition
    } = req.body;

    logger.logUserActivity('RECIPE_SAVE_ATTEMPT', req, req.user._id, {
      recipeName: name,
      externalId,
      ingredientsCount: ingredients?.length,
      difficulty,
      servings,
      hasNutrition: !!nutrition
    });

    // Validation
    if (!externalId || !name || !instructions) {
      logger.warn('Recipe save failed - missing required fields', {
        userId: req.user._id,
        hasExternalId: !!externalId,
        hasName: !!name,
        hasInstructions: !!instructions
      });
      return res.status(400).json({ 
        message: 'External ID, name, and instructions are required',
        error: 'MISSING_REQUIRED_FIELDS'
      });
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      logger.warn('Recipe save failed - missing ingredients', {
        userId: req.user._id,
        recipeName: name,
        isArray: Array.isArray(ingredients),
        ingredientsLength: ingredients?.length
      });
      return res.status(400).json({ 
        message: 'At least one ingredient is required',
        error: 'MISSING_INGREDIENTS'
      });
    }

    // Check if recipe already saved by this user
    const existingRecipe = await Recipe.findOne({ 
      externalId, 
      userId: req.user._id 
    });

    if (existingRecipe) {
      logger.warn('Recipe save failed - already saved', {
        userId: req.user._id,
        recipeName: name,
        externalId,
        existingRecipeId: existingRecipe._id
      });
      return res.status(400).json({ 
        message: 'Recipe already saved',
        error: 'RECIPE_ALREADY_SAVED',
        recipe: existingRecipe
      });
    }

    // Create new recipe
    const recipe = new Recipe({
      externalId,
      name,
      image: image || '',
      description: description || '',
      ingredients,
      instructions,
      userId: req.user._id,
      cookingTime: cookingTime || null,
      preparationTime: preparationTime || null,
      servings: servings || 1,
      difficulty: difficulty || 'medium',
      dietaryTags: dietaryTags || [],
      nutrition: nutrition || {}
    });

    await recipe.save();
    await recipe.populate('userId', 'username email');

    const processingTime = Date.now() - startTime;
    logger.logUserActivity('RECIPE_SAVE_SUCCESS', req, req.user._id, {
      recipeName: name,
      recipeId: recipe._id,
      externalId,
      ingredientsCount: ingredients.length,
      difficulty,
      servings,
      processingTime: `${processingTime}ms`
    });

    res.status(201).json({
      message: 'Recipe saved successfully',
      recipe
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    logger.logError(error, req, {
      action: 'RECIPE_SAVE',
      userId: req.user?._id,
      processingTime: `${processingTime}ms`,
      recipeName: req.body.name
    });
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error',
        errors,
        error: 'VALIDATION_ERROR'
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Recipe with this external ID already exists',
        error: 'DUPLICATE_RECIPE'
      });
    }

    res.status(500).json({ 
      message: 'Server error while saving recipe',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

// Get all saved recipes for a user
router.get('/saved/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Ensure user can only access their own recipes
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Access denied. You can only view your own recipes.',
        error: 'ACCESS_DENIED'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const recipes = await Recipe.find({ userId })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'username email');

    const totalRecipes = await Recipe.countDocuments({ userId });

    res.json({
      recipes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRecipes / parseInt(limit)),
        totalRecipes,
        hasNextPage: skip + recipes.length < totalRecipes,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get saved recipes error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching saved recipes',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

// Delete a saved recipe
router.delete('/delete/:userId/:recipeId', auth, async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    // Ensure user can only delete their own recipes
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Access denied. You can only delete your own recipes.',
        error: 'ACCESS_DENIED'
      });
    }

    const recipe = await Recipe.findOne({ 
      _id: recipeId, 
      userId: req.user._id 
    });

    if (!recipe) {
      return res.status(404).json({ 
        message: 'Recipe not found',
        error: 'RECIPE_NOT_FOUND'
      });
    }

    await Recipe.findByIdAndDelete(recipeId);

    res.json({
      message: 'Recipe deleted successfully',
      deletedRecipe: {
        id: recipe._id,
        name: recipe.name
      }
    });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ 
      message: 'Server error while deleting recipe',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

// Search saved recipes by name for a specific user
router.get('/saved/search/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, page = 1, limit = 10 } = req.query;

    // Ensure user can only search their own recipes
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Access denied. You can only search your own recipes.',
        error: 'ACCESS_DENIED'
      });
    }

    if (!name) {
      return res.status(400).json({ 
        message: 'Search query (name) is required',
        error: 'MISSING_SEARCH_QUERY'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const searchRegex = new RegExp(name, 'i');
    const recipes = await Recipe.find({
      userId,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { 'ingredients.name': searchRegex }
      ]
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'username email');

    const totalResults = await Recipe.countDocuments({
      userId,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { 'ingredients.name': searchRegex }
      ]
    });

    res.json({
      recipes,
      searchQuery: name,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalResults / parseInt(limit)),
        totalResults,
        hasNextPage: skip + recipes.length < totalResults,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Search saved recipes error:', error);
    res.status(500).json({ 
      message: 'Server error while searching saved recipes',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

// Update recipe (rating, notes, favorite status)
router.patch('/update/:recipeId', auth, async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { rating, notes, isFavorite } = req.body;

    const recipe = await Recipe.findOne({ 
      _id: recipeId, 
      userId: req.user._id 
    });

    if (!recipe) {
      return res.status(404).json({ 
        message: 'Recipe not found',
        error: 'RECIPE_NOT_FOUND'
      });
    }

    // Update fields if provided
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ 
          message: 'Rating must be between 1 and 5',
          error: 'INVALID_RATING'
        });
      }
      recipe.rating = rating;
    }

    if (notes !== undefined) {
      recipe.notes = notes;
    }

    if (isFavorite !== undefined) {
      recipe.isFavorite = isFavorite;
    }

    await recipe.save();

    res.json({
      message: 'Recipe updated successfully',
      recipe
    });
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ 
      message: 'Server error while updating recipe',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

// Mark recipe as cooked
router.post('/cooked/:recipeId', auth, async (req, res) => {
  try {
    const { recipeId } = req.params;

    const recipe = await Recipe.findOne({ 
      _id: recipeId, 
      userId: req.user._id 
    });

    if (!recipe) {
      return res.status(404).json({ 
        message: 'Recipe not found',
        error: 'RECIPE_NOT_FOUND'
      });
    }

    await recipe.markAsCooked();

    res.json({
      message: 'Recipe marked as cooked',
      recipe: {
        id: recipe._id,
        name: recipe.name,
        timesCooked: recipe.timesCooked,
        lastCooked: recipe.lastCooked
      }
    });
  } catch (error) {
    console.error('Mark recipe as cooked error:', error);
    res.status(500).json({ 
      message: 'Server error while marking recipe as cooked',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
});

// Generate a new recipe with AI and fetch matching image from Unsplash
router.post('/generate-with-image', auth, async (req, res) => {
  try {
    const { 
      cuisine = 'any', 
      difficulty = 'intermediate', 
      cookingTime = '30', 
      dietaryRestrictions = [],
      preferredIngredients = [],
      mealType = 'dinner'
    } = req.body;

    console.log(`Generating ${cuisine} ${mealType} recipe with difficulty: ${difficulty}`);

    // Check if Gemini AI is available
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        message: 'AI recipe generation not available',
        error: 'AI_NOT_CONFIGURED'
      });
    }

    // Import required modules
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const ImageService = require('../services/imageService');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create a detailed prompt for recipe generation
    const recipePrompt = createRecipeGenerationPrompt({
      cuisine,
      difficulty,
      cookingTime,
      dietaryRestrictions,
      preferredIngredients,
      mealType
    });

    console.log('Generating recipe with AI...');
    
    // Generate recipe with AI
    const result = await model.generateContent(recipePrompt);
    const response = await result.response;
    const aiResponse = response.text();

    // Parse the AI response to extract recipe data
    const parsedRecipe = parseAIRecipeResponse(aiResponse);
    
    if (!parsedRecipe.name) {
      throw new Error('Failed to parse recipe from AI response');
    }

    console.log(`Generated recipe: "${parsedRecipe.name}"`);
    console.log('Searching for matching image...');

    // Fetch matching image from Unsplash using our enhanced image service
    const imageUrl = await ImageService.searchRecipeImage(parsedRecipe.name, cuisine);

    // Create the complete recipe object
    const generatedRecipe = {
      ...parsedRecipe,
      image: imageUrl,
      externalId: `ai_generated_${Date.now()}`,
      source: 'ai_generated',
      cuisine: cuisine !== 'any' ? cuisine : parsedRecipe.cuisine || 'International',
      difficulty,
      aiGenerated: true,
      generatedAt: new Date().toISOString(),
      searchKeywords: `${parsedRecipe.name} ${cuisine} ${mealType}`.toLowerCase()
    };

    console.log(`Recipe generated successfully with image: ${imageUrl ? 'Found' : 'Fallback used'}`);

    res.json({
      message: 'Recipe generated successfully with matching image',
      recipe: generatedRecipe,
      imageSource: imageUrl?.includes('unsplash.com') ? 'unsplash' : 'fallback',
      generationDetails: {
        cuisine,
        difficulty,
        cookingTime,
        mealType,
        imageSearchTerm: `${parsedRecipe.name} ${cuisine}`
      }
    });

  } catch (error) {
    console.error('Recipe generation with image error:', error);
    
    if (error.message?.includes('API key')) {
      return res.status(401).json({ 
        message: 'Invalid AI API key',
        error: 'INVALID_API_KEY'
      });
    }

    if (error.message?.includes('quota')) {
      return res.status(429).json({ 
        message: 'AI API quota exceeded',
        error: 'QUOTA_EXCEEDED'
      });
    }

    res.status(500).json({ 
      message: 'Server error during recipe generation',
      error: 'INTERNAL_SERVER_ERROR',
      details: error.message
    });
  }
});

// Update recipe image with Unsplash search
router.patch('/update-image/:recipeId', auth, async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { recipeName, cuisine = 'International', forceRefresh = false } = req.body;

    const recipe = await Recipe.findOne({ 
      _id: recipeId, 
      userId: req.user._id 
    });

    if (!recipe) {
      return res.status(404).json({ 
        message: 'Recipe not found',
        error: 'RECIPE_NOT_FOUND'
      });
    }

    console.log(`Updating image for recipe: "${recipeName || recipe.name}"`);

    // Import ImageService
    const ImageService = require('../services/imageService');

    // Use provided recipe name or fallback to existing name
    const searchName = recipeName || recipe.name;
    
    // Search for new image using our enhanced Unsplash integration
    const newImageUrl = await ImageService.searchRecipeImage(searchName, cuisine);

    if (!newImageUrl) {
      return res.status(404).json({ 
        message: 'No suitable image found for this recipe',
        error: 'IMAGE_NOT_FOUND'
      });
    }

    // Update the recipe with new image
    const oldImageUrl = recipe.image;
    recipe.image = newImageUrl;
    recipe.imageUpdatedAt = new Date();
    recipe.imageSource = newImageUrl.includes('unsplash.com') ? 'unsplash' : 'fallback';

    await recipe.save();

    console.log(`✅ Image updated successfully: ${newImageUrl}`);

    res.json({
      message: 'Recipe image updated successfully',
      recipe: {
        id: recipe._id,
        name: recipe.name,
        oldImage: oldImageUrl,
        newImage: newImageUrl,
        imageSource: recipe.imageSource,
        updatedAt: recipe.imageUpdatedAt
      },
      imageDetails: {
        searchTerm: `${searchName} ${cuisine}`,
        imageSource: newImageUrl.includes('unsplash.com') ? 'unsplash' : 'fallback',
        relevanceScore: 'High quality match from curated collection'
      }
    });
  } catch (error) {
    console.error('Update recipe image error:', error);
    res.status(500).json({ 
      message: 'Server error while updating recipe image',
      error: 'INTERNAL_SERVER_ERROR',
      details: error.message
    });
  }
});

// Batch update images for multiple recipes
router.post('/batch-update-images', auth, async (req, res) => {
  try {
    const { recipes, cuisine = 'International' } = req.body;

    if (!Array.isArray(recipes) || recipes.length === 0) {
      return res.status(400).json({ 
        message: 'Recipes array is required',
        error: 'MISSING_RECIPES'
      });
    }

    console.log(`Batch updating images for ${recipes.length} recipes`);

    const ImageService = require('../services/imageService');
    const results = [];

    for (const recipeData of recipes) {
      try {
        const { recipeId, recipeName } = recipeData;

        const recipe = await Recipe.findOne({ 
          _id: recipeId, 
          userId: req.user._id 
        });

        if (!recipe) {
          results.push({
            recipeId,
            recipeName,
            status: 'error',
            error: 'Recipe not found'
          });
          continue;
        }

        const searchName = recipeName || recipe.name;
        const newImageUrl = await ImageService.searchRecipeImage(searchName, cuisine);

        if (newImageUrl) {
          const oldImageUrl = recipe.image;
          recipe.image = newImageUrl;
          recipe.imageUpdatedAt = new Date();
          recipe.imageSource = newImageUrl.includes('unsplash.com') ? 'unsplash' : 'fallback';
          
          await recipe.save();

          results.push({
            recipeId,
            recipeName: recipe.name,
            status: 'success',
            oldImage: oldImageUrl,
            newImage: newImageUrl,
            imageSource: recipe.imageSource
          });

          console.log(`✅ Updated: ${recipe.name}`);
        } else {
          results.push({
            recipeId,
            recipeName: recipe.name,
            status: 'no_image',
            error: 'No suitable image found'
          });
        }

        // Small delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (recipeError) {
        results.push({
          recipeId: recipeData.recipeId,
          recipeName: recipeData.recipeName,
          status: 'error',
          error: recipeError.message
        });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    const noImageCount = results.filter(r => r.status === 'no_image').length;

    res.json({
      message: 'Batch image update completed',
      summary: {
        total: recipes.length,
        successful: successCount,
        errors: errorCount,
        noImages: noImageCount
      },
      results
    });
  } catch (error) {
    console.error('Batch update images error:', error);
    res.status(500).json({ 
      message: 'Server error during batch image update',
      error: 'INTERNAL_SERVER_ERROR',
      details: error.message
    });
  }
});

// Helper function to create recipe generation prompt
function createRecipeGenerationPrompt(params) {
  const dietaryText = params.dietaryRestrictions.length > 0 ? 
    `Dietary restrictions: ${params.dietaryRestrictions.join(', ')}` : '';
  
  const ingredientsText = params.preferredIngredients.length > 0 ? 
    `Preferred ingredients to include: ${params.preferredIngredients.join(', ')}` : '';

  return `Generate a complete ${params.mealType} recipe with the following requirements:
- Cuisine: ${params.cuisine}
- Difficulty: ${params.difficulty}
- Cooking time: approximately ${params.cookingTime} minutes
- Meal type: ${params.mealType}
${dietaryText}
${ingredientsText}

Please provide the recipe in this exact JSON format:
{
  "name": "Recipe Name",
  "description": "Brief description of the dish",
  "servings": 4,
  "preparationTime": 15,
  "cookingTime": ${params.cookingTime},
  "ingredients": [
    {"name": "ingredient1", "amount": "1 cup", "original": "1 cup ingredient1"},
    {"name": "ingredient2", "amount": "2 tbsp", "original": "2 tbsp ingredient2"}
  ],
  "instructions": [
    "Step 1: Detailed instruction",
    "Step 2: Detailed instruction",
    "Step 3: Detailed instruction"
  ],
  "nutrition": {
    "calories": 350,
    "protein": "25g",
    "carbs": "30g",
    "fat": "15g"
  },
  "dietaryTags": ["tag1", "tag2"],
  "cuisine": "${params.cuisine !== 'any' ? params.cuisine : 'International'}"
}

Make sure the recipe name is specific and descriptive (like "Spicy Thai Basil Chicken Stir-Fry" instead of just "Chicken Stir-Fry") so we can find matching images. Return only the JSON, no additional text.`;
}

// Helper function to parse AI recipe response
function parseAIRecipeResponse(aiResponse) {
  try {
    // Clean the response - remove any markdown formatting or extra text
    let cleanResponse = aiResponse.trim();
    
    // Extract JSON from the response if it's wrapped in markdown
    const jsonMatch = cleanResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                     cleanResponse.match(/```\s*([\s\S]*?)\s*```/) ||
                     [null, cleanResponse];
    
    if (jsonMatch[1]) {
      cleanResponse = jsonMatch[1].trim();
    }

    // Parse the JSON
    const parsed = JSON.parse(cleanResponse);
    
    // Validate required fields
    if (!parsed.name || !parsed.ingredients || !parsed.instructions) {
      throw new Error('Missing required fields in AI response');
    }

    // Ensure arrays are arrays
    if (typeof parsed.ingredients === 'string') {
      parsed.ingredients = parsed.ingredients.split('\n').map(ing => ({
        name: ing,
        amount: '',
        original: ing
      }));
    }

    if (typeof parsed.instructions === 'string') {
      parsed.instructions = parsed.instructions.split('\n').filter(step => step.trim());
    }

    // Set defaults for missing fields
    return {
      name: parsed.name,
      description: parsed.description || `Delicious ${parsed.name}`,
      servings: parsed.servings || 4,
      preparationTime: parsed.preparationTime || 15,
      cookingTime: parsed.cookingTime || 30,
      ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
      instructions: Array.isArray(parsed.instructions) ? parsed.instructions : [],
      nutrition: parsed.nutrition || {
        calories: 300,
        protein: '20g',
        carbs: '25g',
        fat: '12g'
      },
      dietaryTags: Array.isArray(parsed.dietaryTags) ? parsed.dietaryTags : [],
      cuisine: parsed.cuisine || 'International'
    };

  } catch (error) {
    console.error('Error parsing AI recipe response:', error);
    console.error('AI Response was:', aiResponse);
    
    // Return a fallback recipe if parsing fails
    return {
      name: 'Generated Recipe',
      description: 'A delicious recipe generated by AI',
      servings: 4,
      preparationTime: 15,
      cookingTime: 30,
      ingredients: [
        { name: 'main ingredient', amount: '1 lb', original: '1 lb main ingredient' }
      ],
      instructions: [
        'Prepare ingredients according to your preferences',
        'Cook following standard techniques for this dish',
        'Season to taste and serve hot'
      ],
      nutrition: { calories: 300, protein: '20g', carbs: '25g', fat: '12g' },
      dietaryTags: [],
      cuisine: 'International'
    };
  }
}

module.exports = router;
