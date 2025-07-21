# Image Search Configuration

This application uses Google Custom Search API for accurate recipe image matching. Here's how to set it up:

## Google Custom Search API Setup

### 1. Create a Google Custom Search Engine

1. Go to [Google Custom Search Engine](https://cse.google.com/cse/)
2. Click "Add" to create a new search engine
3. In "Sites to search", enter: `*.food.com, *.allrecipes.com, *.foodnetwork.com, *.epicurious.com, *.bonappetit.com, *.seriouseats.com, *.tasteofhome.com`
4. Name your search engine (e.g., "Recipe Image Search")
5. Click "Create"
6. Go to "Setup" > "Basics" and note your **Search engine ID**
7. Enable "Image search" in the setup
8. Under "Sites to search", click "Add" and add more food websites if needed

### 2. Get Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Custom Search API"
4. Go to "Credentials" and create an API key
5. Restrict the API key to "Custom Search API" for security

### 3. Configure Environment Variables

Add these to your `.env` file:

```env
# Google Custom Search API (for accurate recipe images)
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here

# Optional: Unsplash API (backup for food images)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

### 4. Alternative: Using Unsplash Only

If you prefer not to use Google Custom Search:

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create an application
3. Get your Access Key
4. Add to `.env`: `UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here`

### 5. No API Keys (Free Mode)

The app will work without any API keys by:
- Using random food images from Foodish API
- Falling back to curated default images based on cuisine
- Still providing images for all recipes

## Current Priority Order:
1. **Google Custom Search** (most accurate recipe matching)
2. **Unsplash API** (high-quality food photography)  
3. **Foodish API** (free random food images)
4. **Default Images** (curated cuisine-specific images)

## Usage Examples:

```javascript
// The image service will automatically:
// 1. Search Google for "chicken tikka masala recipe food"
// 2. If not found, search Unsplash for "chicken tikka masala food"
// 3. If not found, use Foodish API random image
// 4. If all fail, use Indian cuisine default image

const imageUrl = await imageService.searchRecipeImage("Chicken Tikka Masala", "Indian");
```
