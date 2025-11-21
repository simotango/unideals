# Email Verification Not Working - Fix Guide

## 🔍 Why Verification Emails Don't Work

The system has a **fallback mechanism** - if email is not configured or fails, it logs the verification code to the **server console/logs** instead of sending an email.

## ✅ Quick Fix: Check Render Logs

**The verification code is always generated and logged!**

1. Go to **Render Dashboard** → Your Web Service → **Logs** tab
2. Register a new user
3. Look for this in the logs:
   ```
   ═══════════════════════════════════════════════════════
   📧 VERIFICATION CODE (Email not configured)
   ═══════════════════════════════════════════════════════
   Email: user@example.com
   Verification Code: 123456
   ═══════════════════════════════════════════════════════
   ```
4. **Use that code** to verify the email!

---

## 🔧 How to Enable Real Email Sending

### Step 1: Set Up Gmail App Password

1. **Enable 2-Step Verification** on your Google Account
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it: "UniDeals Backend"
   - Click "Generate"
   - **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 2: Add Email Variables to Render

1. Go to **Render Dashboard** → Your Web Service → **Environment** tab
2. Add these environment variables:

   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=abcd efgh ijkl mnop
   ```

   **Important:**
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: The 16-character App Password (spaces optional)

3. Click **"Save Changes"**

### Step 3: Redeploy Service

- Render will automatically redeploy when you save environment variables
- Or manually: Click **"Manual Deploy"** → **"Deploy latest commit"**

### Step 4: Verify Email is Working

1. Check Render logs on startup - you should see:
   ```
   ✅ Email server is ready to send messages
   ```

2. If you see this instead, email is not configured:
   ```
   📧 Email not configured. Verification codes will be logged to console.
   ```

3. Test registration - check logs for:
   ```
   ✅ Verification email sent: <message-id>
   ```

---

## 🔍 Troubleshooting

### Issue: "Email transporter error"

**Possible causes:**
1. Wrong App Password - Make sure you're using App Password, not regular password
2. 2-Step Verification not enabled - Must enable first
3. Wrong email address - Check EMAIL_USER matches your Gmail

**Solution:**
- Verify 2-Step Verification is enabled
- Generate a new App Password
- Update EMAIL_PASS in Render

### Issue: "Email sending failed"

**Check Render logs for error details:**
- Authentication failed → Wrong App Password
- Connection timeout → Check EMAIL_HOST and EMAIL_PORT
- Rate limit → Gmail has sending limits

### Issue: Emails go to spam

**Solution:**
- Check spam/junk folder
- Add sender to contacts
- Use a custom domain email (more advanced)

---

## 📋 Verification Code Location

### If Email is NOT Configured:
- ✅ Code is **always generated**
- ✅ Code is **logged to Render logs**
- ✅ Code is **saved in database**
- ❌ Email is **NOT sent**

**To get the code:**
1. Register a user
2. Check Render logs immediately
3. Find the code in the log output

### If Email IS Configured:
- ✅ Code is generated
- ✅ Code is sent via email
- ✅ Code is also logged (for debugging)
- ✅ User receives email

---

## 🧪 Test Email Configuration

### Method 1: Check Server Startup Logs

When server starts, look for:
```
✅ Email server is ready to send messages
```

If you see:
```
📧 Email not configured. Verification codes will be logged to console.
```

Then email is **not configured** - add environment variables.

### Method 2: Test Registration

1. Register a new user
2. Check Render logs
3. Look for one of these:

   **Email working:**
   ```
   ✅ Verification email sent: <message-id>
   ```

   **Email not working:**
   ```
   📧 VERIFICATION CODE (Email not configured)
   Email: user@example.com
   Verification Code: 123456
   ```

---

## 📝 Environment Variables Checklist

Make sure these are set in Render:

- [ ] `EMAIL_HOST=smtp.gmail.com`
- [ ] `EMAIL_PORT=587`
- [ ] `EMAIL_USER=your-email@gmail.com`
- [ ] `EMAIL_PASS=your-16-char-app-password`

**Note:** For Gmail, you **MUST** use an App Password, not your regular password!

---

## 🚀 Quick Setup Summary

1. **Enable 2-Step Verification** on Gmail
2. **Generate App Password** from Google Account
3. **Add to Render** environment variables:
   - `EMAIL_USER` = your Gmail
   - `EMAIL_PASS` = App Password
4. **Redeploy** service
5. **Check logs** to verify it's working

---

## 💡 Alternative: Use Console Logs (For Development)

If you don't want to set up email right now:

1. Register a user
2. Immediately check **Render logs**
3. Copy the verification code from logs
4. Use it to verify the email

**The system always generates and logs the code, even if email fails!**

---

*The verification system is designed to always work - either via email or console logs.*

