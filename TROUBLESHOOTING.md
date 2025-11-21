# Troubleshooting Guide

## ERR_BLOCKED_BY_CLIENT Error

This error typically means a browser extension is blocking your API requests.

### Quick Fixes:

#### 1. **Disable Browser Extensions** (Most Common Fix)
- **Chrome/Edge**: 
  - Go to `chrome://extensions/` or `edge://extensions/`
  - Disable ad blockers (uBlock Origin, AdBlock Plus, etc.)
  - Disable privacy extensions
  - Refresh the page

- **Firefox**:
  - Go to `about:addons`
  - Disable ad blockers and privacy extensions
  - Refresh the page

#### 2. **Use Incognito/Private Mode**
- Open browser in Incognito/Private mode
- Extensions are usually disabled in private mode
- Test your API calls

#### 3. **Check Server is Running**
```bash
# Make sure server is running
cd BACKEND
npm start

# Should see:
# UniDeals Backend server is running on port 3000
```

#### 4. **Test API Directly**
Open browser console and test:
```javascript
fetch('http://localhost:3000/health')
  .then(r => r.json())
  .then(console.log)
```

#### 5. **Check Browser Console**
- Open Developer Tools (F12)
- Go to Console tab
- Look for detailed error messages
- Check Network tab to see if request is being sent

#### 6. **Whitelist localhost in Extensions**
- If you use uBlock Origin: Click extension → Settings → My filters → Add: `@@||localhost^`
- If you use AdBlock: Settings → Allowlist → Add: `localhost`

### Alternative: Test with cURL or Postman

If browser is blocking, test API directly:

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test registration
curl -X POST http://localhost:3000/api/client/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## Other Common Issues

### Server Won't Start

**Error**: `Port 3000 already in use`

**Solution**:
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change PORT in .env file
PORT=3001
```

### Database Connection Fails

**Error**: `Database connection error`

**Solutions**:
1. Check PostgreSQL is running
2. Verify `.env` file has correct database credentials
3. Test connection:
   ```bash
   node test-db-connection.js
   ```

### CORS Errors

**Error**: `Access to fetch at 'http://localhost:3000' from origin '...' has been blocked by CORS policy`

**Solution**: CORS is already enabled in `server.js`. If you still get errors:
- Make sure server is running
- Check that `cors` package is installed: `npm install cors`
- Verify requests are going to correct URL

### 404 Not Found

**Error**: `Route not found`

**Solutions**:
- Check API URL in frontend code matches server
- Verify route exists in `routes/client.js` or `routes/supplier.js`
- Check server logs for route registration

---

## Debugging Steps

1. **Check Server Logs**
   ```bash
   # Start server and watch logs
   npm start
   ```

2. **Check Browser Network Tab**
   - Open Developer Tools (F12)
   - Go to Network tab
   - Try making a request
   - Check request/response details

3. **Test API Endpoints Directly**
   ```bash
   # Health check
   curl http://localhost:3000/health
   
   # Client registration
   curl -X POST http://localhost:3000/api/client/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

4. **Verify Environment Variables**
   ```bash
   # Check .env file exists
   ls .env
   
   # Verify variables are loaded (check server startup logs)
   ```

---

## Still Having Issues?

1. **Clear Browser Cache**: Ctrl+Shift+Delete
2. **Try Different Browser**: Chrome, Firefox, Edge
3. **Check Firewall**: Windows Firewall might block Node.js
4. **Restart Server**: Stop (Ctrl+C) and start again
5. **Check Node.js Version**: `node --version` (should be v14+)

---

*For more help, check server logs and browser console for detailed error messages.*

