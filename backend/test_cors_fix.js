const express = require('express');
const cors = require('cors');
const app = express();

// CORS options to test the fix
const corsOptions = {
  origin: function (origin, callback) {
    // List of allowed origins
    const allowedOrigins = [
      'https://meal-cart-phi.vercel.app',
      'http://localhost:5173', // Vite development server
      'http://localhost:3000'  // React default development server
    ];
    
    // For testing, log the origin
    console.log('Request from origin:', origin);
    
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation: Origin not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

app.use(cors(corsOptions));

// Apply custom CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log('Custom middleware - Request origin:', origin);
  
  const allowedOrigins = [
    'https://meal-cart-phi.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://meal-cart-phi.vercel.app');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'CORS test successful!' });
});

// Test endpoint that simulates the AI generation endpoint
app.post('/api/ai/generate', (req, res) => {
  res.json({
    success: true,
    recipe: {
      id: '123456789',
      name: 'Test Recipe',
      description: 'This is a test recipe to verify CORS is working.',
      ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'],
      instructions: ['Step 1', 'Step 2', 'Step 3'],
      cookingTime: 30,
      prepTime: 15,
      difficulty: 'medium',
      cuisine: 'Test',
      servings: 4
    },
    groceryList: ['Item 1', 'Item 2', 'Item 3'],
    message: 'Recipe and grocery list generated successfully'
  });
});

const PORT = 5005;
app.listen(PORT, () => {
  console.log(`CORS test server running on port ${PORT}`);
  console.log(`To test CORS, run: curl -H "Origin: http://localhost:5173" -v http://localhost:${PORT}/test`);
});
