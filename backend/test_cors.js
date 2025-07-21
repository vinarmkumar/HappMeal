// A standalone Express server to test CORS settings
// This helps verify CORS is correctly configured before deployment

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Custom middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.headers.origin || 'unknown'}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

// Define CORS options
const corsOptions = {
  origin: 'https://meal-cart-phi.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Additional CORS handling
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://meal-cart-phi.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request in middleware');
    return res.status(200).end();
  }
  next();
});

// Test route for auth
app.post('/api/auth/login', (req, res) => {
  console.log('Login route accessed');
  res.json({ message: 'This is a test login response' });
});

// Test route for GET
app.get('/api/test', (req, res) => {
  res.json({ message: 'CORS test successful - GET' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Test CORS server running on http://localhost:${PORT}`);
  console.log('Test your CORS setup with:');
  console.log(`curl -X OPTIONS -H "Origin: https://meal-cart-phi.vercel.app" -H "Access-Control-Request-Method: POST" -v http://localhost:${PORT}/api/auth/login`);
});
