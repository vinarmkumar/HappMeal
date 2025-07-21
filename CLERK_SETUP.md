# Clerk Authentication Setup Guide

## 🚀 Quick Setup Instructions

### 1. Create Clerk Account
1. Go to [https://clerk.com/](https://clerk.com/)
2. Sign up for a free account
3. Create a new application

### 2. Get Your API Keys
1. In your Clerk dashboard, go to **API Keys**
2. Copy the **Publishable Key** and **Secret Key**

### 3. Configure Environment Variables

#### Frontend (.env)
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

#### Backend (.env)
```bash
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

### 4. Configure Social Providers

#### Enable Google Authentication:
1. In Clerk Dashboard → **User & Authentication** → **Social Connections**
2. Enable **Google**
3. Add your Google OAuth credentials (optional - Clerk provides development keys)

#### Enable Email/Password (Optional):
1. Go to **User & Authentication** → **Email, Phone, Username**
2. Configure as needed

### 5. Customize Authentication UI

#### Configure Sign-in/Sign-up Flow:
1. Go to **User & Authentication** → **Settings**
2. Configure your preferred authentication methods
3. Set up redirect URLs if needed

### 6. Test Your Setup

1. Start your frontend: `npm run dev`
2. Click "Enter Kitchen" or "Become Chef" buttons
3. You should see Clerk's authentication modal

## 🎨 Current Integration Features

✅ **Google OAuth** - One-click sign-in with Google
✅ **Email/Password** - Traditional authentication
✅ **Glassmorphism UI** - Beautiful glass-effect buttons
✅ **Cooking Theme** - Chef-themed welcome messages
✅ **Dark/Light Mode** - Responsive to your app theme
✅ **User Profile** - Automatic user management
✅ **Secure Sessions** - JWT-based authentication

## 🔧 Customization Options

### Authentication Methods Available:
- 🔐 Email/Password
- 📱 Phone/SMS
- 🌐 Google OAuth
- 👥 GitHub, Discord, Twitter, and more
- 🔗 Magic Links
- 📧 Email Codes

### UI Customization:
- Colors match your brand (`#ff6b35`)
- Glassmorphism effects
- Dark/Light theme support
- Custom styling applied

## 🚨 Important Notes

1. **Development vs Production**: 
   - Clerk provides development keys for testing
   - For production, add your own OAuth app credentials

2. **Security**: 
   - Never commit API keys to version control
   - Use different keys for development/production

3. **User Data**:
   - Clerk handles all user data securely
   - Access user info via `useUser()` hook
   - Automatic session management

## 🎯 Next Steps

1. Add your Clerk keys to environment files
2. Test the authentication flow
3. Customize the UI further if needed
4. Set up webhooks for user events (optional)
5. Configure additional social providers if desired

## 🆘 Need Help?

- [Clerk Documentation](https://clerk.com/docs)
- [React Integration Guide](https://clerk.com/docs/references/react/overview)
- [Authentication Methods](https://clerk.com/docs/authentication/overview)

Your MealCart app now has enterprise-grade authentication with a beautiful, cooking-themed UI! 🍳✨
