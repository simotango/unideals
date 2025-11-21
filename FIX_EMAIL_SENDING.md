# Fix Email Sending - Step by Step

## 🔍 First: Check What's Wrong

Go to **Render Dashboard → Your Service → Logs** and look for one of these:

### If you see this on startup:
```
📧 Email not configured. Verification codes will be logged to console.
```
**Problem:** Environment variables not set

### If you see this:
```
⚠️  Email transporter verification failed:
   Error: Invalid login
```
**Problem:** Wrong App Password or email

### If you see this:
```
✅ Email server is ready to send messages
```
**Good!** Email is configured, but might fail when sending.

---

## ✅ Fix: Set Environment Variables in Render

1. **Go to Render Dashboard**
   - Your Web Service → **Environment** tab

2. **Add these 4 variables:**

   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```

3. **Important:**
   - `EMAIL_USER` = Your Gmail address (exactly as it appears)
   - `EMAIL_PASS` = Gmail App Password (16 characters, NOT your regular password)
   - No spaces around the `=` sign
   - No quotes needed

4. **Save Changes** - Render will auto-redeploy

---

## 🔑 Get Gmail App Password

If you don't have one:

1. **Enable 2-Step Verification:**
   - https://myaccount.google.com/security
   - Turn on "2-Step Verification"

2. **Generate App Password:**
   - https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" → "Other (Custom name)" → Name: "UniDeals"
   - Click "Generate"
   - **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

3. **Use that password** in `EMAIL_PASS` (spaces are optional)

---

## ✅ Verify It's Working

After redeploy, check Render logs:

### On Startup - Should see:
```
✅ Email server is ready to send messages
   Host: smtp.gmail.com
   Port: 587
   User: your-email@gmail.com
```

### When Registering - Should see:
```
✅ Verification email sent successfully!
   Message ID: <message-id>
   To: user@example.com
```

---

## 🐛 Common Issues

### Issue: "Invalid login" or "Authentication failed"
- ❌ Using regular Gmail password instead of App Password
- ✅ Fix: Generate App Password and use that

### Issue: "Connection timeout"
- ❌ Network/firewall blocking SMTP
- ✅ Fix: Verify EMAIL_HOST and EMAIL_PORT are correct

### Issue: "Email not configured"
- ❌ Environment variables not set or not saved
- ✅ Fix: Add variables in Render, save, redeploy

### Issue: Variables set but still not working
- ❌ Service not restarted after adding variables
- ✅ Fix: Manually redeploy service

---

## 🧪 Test Email Configuration

After setting variables, test:

1. **Check startup logs** - Should see "Email server is ready"
2. **Register a test user** - Should see "Verification email sent"
3. **Check your email** - Should receive the verification code

---

## 📋 Checklist

- [ ] 2-Step Verification enabled on Gmail
- [ ] App Password generated
- [ ] EMAIL_HOST=smtp.gmail.com (in Render)
- [ ] EMAIL_PORT=587 (in Render)
- [ ] EMAIL_USER=your-email@gmail.com (in Render)
- [ ] EMAIL_PASS=app-password (in Render)
- [ ] Service redeployed after adding variables
- [ ] Checked Render logs for "Email server is ready"
- [ ] Tested registration and received email

---

**Once you see "✅ Email server is ready to send messages" in logs, emails will be sent!**

