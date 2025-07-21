// Test JSON parsing function
const testResponse = `\`\`\`json
{
  "title": "Simple Egg Flour Pancakes",
  "description": "Quick and easy savory pancakes made with just eggs and flour.",
  "ingredients": [
    {
      "name": "Eggs",
      "amount": 4,
      "unit": "large",
      "notes": "Room temperature preferred"
    },
    {
      "name": "All-purpose flour",
      "amount": 1,
      "unit": "cup",
      "notes": ""
    }
  ],
  "instructions": [
    {
      "step": 1,
      "instruction": "Beat eggs in a large bowl until well combined.",
      "time": 2
    }
  ],
  "cookingTime": 15,
  "prepTime": 5,
  "difficulty": "easy",
  "cuisine": "International",
  "dietaryTags": ["vegetarian"],
  "category": "breakfast",
  "nutritionInfo": "Calories: 320, Protein: 18g, Carbs: 28g, Fat: 14g, Fiber: 1g",
  "tips": "Serve hot with your favorite toppings"
}
\`\`\``;

// Helper function for robust JSON parsing
const parseAIResponse = (text, expectedFields = []) => {
  let jsonString = text.trim();
  
  console.log('Raw AI response (first 100 chars):', jsonString.substring(0, 100));
  
  // Remove markdown code blocks if present
  if (jsonString.startsWith('```')) {
    const codeBlockMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      jsonString = codeBlockMatch[1].trim();
      console.log('Extracted from code block (first 100 chars):', jsonString.substring(0, 100));
    }
  }
  
  // If still no JSON, try to find JSON object
  if (!jsonString.startsWith('{') && !jsonString.startsWith('[')) {
    const jsonMatch = jsonString.match(/(\{[\s\S]*\})/);
    if (jsonMatch) {
      jsonString = jsonMatch[1];
      console.log('Extracted JSON object (first 100 chars):', jsonString.substring(0, 100));
    }
  }
  
  // Clean up common JSON formatting issues
  jsonString = jsonString
    .replace(/,\s*}/g, '}')  // Remove trailing commas in objects
    .replace(/,\s*]/g, ']')  // Remove trailing commas in arrays
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .trim();
  
  console.log('Cleaned JSON (first 100 chars):', jsonString.substring(0, 100));
  
  const parsed = JSON.parse(jsonString);
  
  // Validate expected fields if provided
  if (expectedFields.length > 0) {
    for (const field of expectedFields) {
      if (!(field in parsed)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }
  
  return parsed;
};

try {
  const result = parseAIResponse(testResponse, ['title', 'ingredients', 'instructions']);
  console.log('SUCCESS! Parsed result:', JSON.stringify(result, null, 2));
} catch (error) {
  console.error('FAILED to parse:', error.message);
}
