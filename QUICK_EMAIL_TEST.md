# Quick Email Test - No Deployment Needed!

Instead of waiting for Render to deploy, test email locally first!

## 🚀 Quick Test (2 minutes)

### Step 1: Make sure you have .env file

In your `BACKEND` folder, create or edit `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### Step 2: Run the test script

```bash
cd BACKEND
node test-email-local.js
```

### Step 3: Check results

**If it works:**
```
✅ Email sent successfully!
   Message ID: <message-id>
   Check your inbox: your-email@gmail.com
```

**If it fails:**
- Check the error message
- Verify EMAIL_USER and EMAIL_PASS are correct
- Make sure you're using Gmail App Password

## ✅ Once Local Test Works

After the local test works, your Render deployment will work too!

Just make sure the same environment variables are set in Render:
- Render Dashboard → Your Service → Environment
- Add the same 4 variables

## 🎯 Benefits

- ✅ Test instantly (no 5-minute wait)
- ✅ See errors immediately
- ✅ Fix issues before deploying
- ✅ Save deployment time

---

**Test locally first, then deploy to Render!**

