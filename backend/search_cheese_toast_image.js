const dotenv = require('dotenv');
dotenv.config();

const ImageService = require('./services/imageService');

async function searchSpecificRecipeImage() {
  console.log('🔍 Searching for: "Savory Tomato and Onion Cheese Toast with Mayo"');
  console.log('================================================================\n');

  try {
    const recipeName = "Savory Tomato and Onion Cheese Toast with Mayo";
    const cuisine = "American"; // or could be "International"

    console.log(`Recipe: "${recipeName}"`);
    console.log(`Cuisine: ${cuisine}`);
    console.log('Searching with enhanced Unsplash integration...\n');

    const startTime = Date.now();
    const imageUrl = await ImageService.searchRecipeImage(recipeName, cuisine);
    const endTime = Date.now();

    const imageSource = imageUrl?.includes('unsplash.com') ? '🎯 UNSPLASH' : 
                       imageUrl?.includes('foodish') ? '🔄 FOODISH' : '🛡️ FALLBACK';

    console.log('🎉 SEARCH RESULTS:');
    console.log('==================');
    console.log(`✅ Image found: ${imageSource}`);
    console.log(`⏱️ Search time: ${endTime - startTime}ms`);
    console.log(`🔗 Image URL: ${imageUrl}`);
    console.log('');

    // Also try some variations for better results
    const variations = [
      "Cheese Toast with Tomato and Onion",
      "Open Faced Cheese Toast",
      "Grilled Cheese Toast",
      "Tomato Cheese Toast"
    ];

    console.log('🔄 Trying variations for even better matches:');
    console.log('=============================================');

    for (const variation of variations) {
      console.log(`\n🔍 Searching: "${variation}"`);
      const varImageUrl = await ImageService.searchRecipeImage(variation, cuisine);
      const varSource = varImageUrl?.includes('unsplash.com') ? '🎯 UNSPLASH' : 
                       varImageUrl?.includes('foodish') ? '🔄 FOODISH' : '🛡️ FALLBACK';
      
      console.log(`   Result: ${varSource}`);
      console.log(`   URL: ${varImageUrl?.substring(0, 80)}...`);
    }

    console.log('\n📋 RECOMMENDED IMAGE URL FOR DATABASE:');
    console.log('======================================');
    console.log(imageUrl);

    return imageUrl;

  } catch (error) {
    console.error('❌ Error searching for image:', error.message);
    return null;
  }
}

searchSpecificRecipeImage();
