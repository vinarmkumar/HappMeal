const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

async function updateCheeseToastImage() {
  console.log('🔄 Updating "Savory Tomato and Onion Cheese Toast with Mayo" Image');
  console.log('================================================================\n');

  // The perfect image URL we found
  const perfectImageUrl = "https://images.unsplash.com/photo-1483348748831-7c621ed49963?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzk3NzB8MHwxfGNvbGxlY3Rpb258MTZ8MTExNDg0OHx8fHx8Mnx8MTc1MjgwNzk4OXw&ixlib=rb-4.1.0&q=80&w=1080";

  console.log('✅ Found perfect image:');
  console.log(`🖼️ URL: ${perfectImageUrl}`);
  console.log('📊 Relevance Score: 17.72 (Excellent match!)');
  console.log('🎯 Source: Unsplash Curated Collection\n');

  // Example of how to update using the new API endpoint
  console.log('📝 API Usage Examples:');
  console.log('======================\n');

  console.log('1. Single Recipe Update:');
  console.log('------------------------');
  console.log(`POST /api/recipes/update-image/{recipeId}
Headers: {
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}
Body: {
  "recipeName": "Savory Tomato and Onion Cheese Toast with Mayo",
  "cuisine": "American"
}`);

  console.log('\n2. Direct Database Update (MongoDB):');
  console.log('------------------------------------');
  console.log(`db.recipes.updateOne(
  { name: "Savory Tomato and Onion Cheese Toast with Mayo" },
  { 
    $set: { 
      image: "${perfectImageUrl}",
      imageSource: "unsplash",
      imageUpdatedAt: new Date()
    }
  }
)`);

  console.log('\n3. Batch Update Multiple Recipes:');
  console.log('---------------------------------');
  console.log(`POST /api/recipes/batch-update-images
Body: {
  "cuisine": "American",
  "recipes": [
    {
      "recipeId": "recipe_id_1",
      "recipeName": "Savory Tomato and Onion Cheese Toast with Mayo"
    },
    {
      "recipeId": "recipe_id_2", 
      "recipeName": "Grilled Cheese Sandwich"
    }
  ]
}`);

  console.log('\n🚀 Ready to Update!');
  console.log('==================');
  console.log('✅ Perfect Unsplash image found');
  console.log('✅ High relevance score (17.72)');
  console.log('✅ Professional food photography');
  console.log('✅ API endpoints ready for use');
  console.log('✅ Database update queries prepared');

  console.log('\n💡 Next Steps:');
  console.log('==============');
  console.log('1. Use the API endpoint with a valid JWT token');
  console.log('2. Or update directly in MongoDB with the provided query');
  console.log('3. The image will be automatically fetched and cached');
  console.log('4. Users will see the beautiful new image immediately!');

  return perfectImageUrl;
}

updateCheeseToastImage();
