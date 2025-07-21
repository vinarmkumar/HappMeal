# MealCart Frontend - Phase 2 Setup

## Project Setup Instructions

### 1. Create React Project with Vite

```bash
# Navigate to the MealCart directory
cd /Users/sateeshsahu/Documents/MealCart

# Create React project with Vite
npm create vite@latest frontend -- --template react
cd frontend

# Install dependencies
npm install
```

### 2. Install and Configure Tailwind CSS

```bash
# Install Tailwind CSS and its dependencies
npm install -D tailwindcss postcss autoprefixer

# Generate Tailwind config files
npx tailwindcss init -p
```

### 3. Configure Tailwind CSS

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        }
      }
    },
  },
  plugins: [],
}
```

### 4. Add Tailwind Directives

Replace the content of `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    font-family: 'Inter', system-ui, sans-serif;
  }
}
```

### 5. Install Additional Dependencies

```bash
# Install axios for API calls (will be used later)
npm install axios

# Install lucide-react for icons
npm install lucide-react
```

### 6. Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── index.css
│   └── main.jsx
├── package.json
├── tailwind.config.js
└── vite.config.js
```
