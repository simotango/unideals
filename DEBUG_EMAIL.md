# Debug Email Issues

If you've already configured email but it's still not working, check these:

## 🔍 Check Render Logs

1. **On Server Startup:**
   Look for one of these messages:
   
   ✅ **Working:**
   ```
   ✅ Email server is ready to send messages
   ```
   
   ❌ **Not Working:**
   ```
   ⚠️  Email transporter error: [error message]
   📧 Email sending disabled. Verification codes will be logged to console.
   ```
   
   OR
   
   ```
   📧 Email not configured. Verification codes will be logged to console.
   ```

2. **When Registering a User:**
   Look for one of these:
   
   ✅ **Email Sent:**
   ```
   ✅ Verification email sent: <message-id>
   ```
   
   ❌ **Email Failed:**
   ```
   ❌ Error sending verification email: [error details]
   📧 VERIFICATION CODE (Email sending failed)
   Email: user@example.com
   Verification Code: 123456
   ```

## 🐛 Common Issues

### Issue 1: "Invalid login" or "Authentication failed"
**Cause:** Wrong App Password or email address

**Fix:**
- Verify EMAIL_USER matches your Gmail exactly
- Generate a new App Password
- Make sure no extra spaces in EMAIL_PASS

### Issue 2: "Connection timeout"
**Cause:** Firewall or network issue

**Fix:**
- Verify EMAIL_HOST=smtp.gmail.com
- Verify EMAIL_PORT=587
- Check if Render allows outbound SMTP connections

### Issue 3: "Rate limit exceeded"
**Cause:** Too many emails sent

**Fix:**
- Wait a few minutes
- Gmail has daily sending limits

### Issue 4: Environment variables not loaded
**Cause:** Variables not saved or service not restarted

**Fix:**
- Verify variables are saved in Render
- Manually redeploy the service
- Check variable names match exactly (case-sensitive)

## 🧪 Test Email Configuration

Add this to check if email is properly configured:

1. **Check Environment Variables in Render:**
   - Go to Environment tab
   - Verify all 4 email variables are present:
     - EMAIL_HOST
     - EMAIL_PORT
     - EMAIL_USER
     - EMAIL_PASS

2. **Check Server Logs:**
   - Look for email configuration messages on startup
   - Check for any error messages

3. **Test Registration:**
   - Register a new user
   - Check logs immediately after
   - See if email was sent or logged to console

## 📋 What to Check

- [ ] EMAIL_USER is set correctly
- [ ] EMAIL_PASS is the App Password (not regular password)
- [ ] EMAIL_HOST=smtp.gmail.com
- [ ] EMAIL_PORT=587
- [ ] Service was redeployed after adding variables
- [ ] Check Render logs for error messages
- [ ] 2-Step Verification is enabled on Gmail
- [ ] App Password was generated correctly

## 🔧 Quick Fix Steps

1. **Verify Variables:**
   - Render Dashboard → Your Service → Environment
   - Check all email variables exist

2. **Check Logs:**
   - Render Dashboard → Your Service → Logs
   - Look for email-related messages

3. **Test Again:**
   - Register a new user
   - Check logs for verification code

4. **If Still Not Working:**
   - Generate a new App Password
   - Update EMAIL_PASS in Render
   - Redeploy service

---

**Share the error message from Render logs and I can help fix it!**

