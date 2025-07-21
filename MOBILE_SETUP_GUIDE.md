# Mobile Authentication Troubleshooting Guide

## Quick Setup for Mobile Access

Your MealCart app is now configured for mobile access! Here's what you need to do:

### 🚀 Current Configuration
- **Your Local IP:** 192.168.29.216
- **Frontend URL (Mobile):** http://192.168.29.216:5174/
- **Backend URL (Mobile):** http://192.168.29.216:5001/api/
- **Frontend URL (Desktop):** http://localhost:5174/

### 📱 Mobile Connection Steps

1. **Ensure Same Network**: Make sure your phone and computer are on the same WiFi network
2. **Open Mobile Browser**: Use Chrome, Safari, or any modern browser
3. **Visit**: http://192.168.29.216:5174/
4. **Clear Cache**: If you've accessed the site before, clear browser data

### 🔧 If Sign-In Still Fails on Mobile

#### Problem 1: CORS Errors
**Symptoms**: Network errors, failed requests
**Solution**: 
- The CORS is already configured for your IP
- Try refreshing the page
- Check browser console for specific errors

#### Problem 2: Cookie/Token Issues  
**Symptoms**: "Not authenticated" errors, token validation fails
**Solution**:
- Clear all browser data for the site
- Use incognito/private browsing mode
- Disable any ad blockers or VPNs

#### Problem 3: Network/Firewall Issues
**Symptoms**: Can't connect to the site at all
**Solution**:
- Check if ports 5001 and 5174 are accessible:
  ```bash
  # Test backend
  curl http://192.168.29.216:5001/api/health
  
  # Test frontend (should show HTML)
  curl http://192.168.29.216:5174/
  ```
- Temporarily disable computer firewall
- Ensure no VPN is blocking local network access

#### Problem 4: JWT Token Storage
**Symptoms**: Can sign in but gets logged out immediately
**Solution**:
- Mobile browsers handle localStorage differently
- Try this in mobile browser console:
  ```javascript
  localStorage.clear();
  sessionStorage.clear();
  ```

### 🛠️ Advanced Debugging

#### Check Browser Console on Mobile
1. Open site on mobile
2. Access developer tools (varies by browser)
3. Look for error messages in Console tab

#### Test API Endpoints Directly
On your mobile browser, try visiting:
- http://192.168.29.216:5001/api/health (should show JSON response)

#### Network Tab Analysis
1. Open Network tab in mobile browser dev tools
2. Try to sign in
3. Look for failed requests (red entries)
4. Check request headers and response details

### 🔄 Reset Everything
If nothing works, try this complete reset:

1. **On Computer:**
   ```bash
   # Stop all servers
   pkill -f "npm run dev"
   
   # Restart with mobile setup
   ./mobile-setup.sh
   ```

2. **On Mobile:**
   - Clear all browser data
   - Restart browser app
   - Try incognito mode first

### 📞 Alternative Solutions

#### Option 1: Use ngrok for Secure Tunnel
```bash
# Install ngrok (if not installed)
brew install ngrok

# Tunnel frontend
ngrok http 5174

# Tunnel backend  
ngrok http 5001
```

#### Option 2: Use Different Authentication Method
If JWT tokens are problematic on mobile, we could switch to:
- Session-based authentication
- OAuth with external providers
- Magic link authentication

### 🎯 Most Common Issue: Mixed Content

If you see mixed content errors, it's because:
- Site is loaded over HTTP but trying to make HTTPS requests
- Solution: Ensure all API calls use HTTP (not HTTPS)
- Check that VITE_API_URL in .env.local is using HTTP

### 📊 Success Indicators

You'll know it's working when:
- ✅ Site loads on mobile at http://192.168.29.216:5174/
- ✅ Network tab shows successful API calls to 192.168.29.216:5001
- ✅ Sign in redirects properly and shows user dashboard
- ✅ Recipe generation and saving works

### 🚨 Emergency Fallback

If mobile access remains problematic:
1. Use desktop browser for development
2. Test mobile-specific features using Chrome DevTools device simulation
3. Deploy to a staging environment for real mobile testing

---

**Remember**: Local development on mobile can be tricky due to network restrictions, browser differences, and security policies. The configuration above should work for most scenarios!
