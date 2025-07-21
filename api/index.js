// api/index.js - Simple API for meal-cart-backend.vercel.app
const express = require('express');
const app = express();

// Simple CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

// Simple logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'MealCart Backend API is running',
    version: '1.1.0'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API test successful!',
    timestamp: new Date().toISOString(),
    endpoints: ['/api/health', '/api/test', '/api/recipes']
  });
});

// Simple recipes endpoint
app.get('/api/recipes', (req, res) => {
  res.json({
    message: 'Recipes endpoint working',
    recipes: [],
    timestamp: new Date().toISOString(),
    note: 'Database connection will be added in next update'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    availableEndpoints: ['/api/health', '/api/test', '/api/recipes'],
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
