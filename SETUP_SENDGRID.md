# Setup SendGrid for Email (Works on Render Free Tier!)

## 🎯 Why SendGrid?

Render's **free tier blocks SMTP connections**, so Gmail SMTP won't work. SendGrid uses HTTP API (not SMTP), so it works perfectly on Render free tier!

**SendGrid Free Tier:**
- ✅ 100 emails/day forever
- ✅ Works on Render free tier
- ✅ No SMTP blocking issues
- ✅ Easy setup

---

## 📋 Step 1: Create SendGrid Account

1. Go to: https://signup.sendgrid.com/
2. Sign up for free account
3. Verify your email address

---

## 🔑 Step 2: Get API Key

1. **Go to SendGrid Dashboard**
   - https://app.sendgrid.com/

2. **Navigate to API Keys**
   - Settings → API Keys (left sidebar)
   - Or: https://app.sendgrid.com/settings/api_keys

3. **Create API Key**
   - Click **"Create API Key"**
   - Name: `UniDeals Backend`
   - Permissions: **"Full Access"** (or "Restricted Access" → Mail Send)
   - Click **"Create & View"**

4. **Copy the API Key**
   - ⚠️ **IMPORTANT**: You can only see this once!
   - Copy the key (starts with `SG.`)
   - Save it securely

---

## 📧 Step 3: Verify Sender Email (Required!)

SendGrid requires you to verify your sender email:

1. **Go to Sender Authentication**
   - Settings → Sender Authentication
   - Or: https://app.sendgrid.com/settings/sender_auth

2. **Verify Single Sender**
   - Click **"Verify a Single Sender"**
   - Fill in your details:
     - **From Email**: `simomohamessi@gmail.com` (or your email)
     - **From Name**: `UniDeals`
     - **Reply To**: Same as from email
   - Click **"Create"**

3. **Check Your Email**
   - SendGrid will send a verification email
   - Click the verification link
   - ✅ Email verified!

---

## 🚀 Step 4: Add to Render

1. **Go to Render Dashboard**
   - Your Web Service → **Environment** tab

2. **Add Environment Variable**
   ```
   SENDGRID_API_KEY=SG.your-api-key-here
   ```

3. **Optional: Set From Email**
   ```
   SENDGRID_FROM_EMAIL=simomohamessi@gmail.com
   ```
   (If not set, uses EMAIL_USER or defaults to noreply@unideals.com)

4. **Save** - Render will auto-redeploy

---

## ✅ Step 5: Test

After deployment, check Render logs:

**Should see:**
```
✅ SendGrid API configured (bypasses SMTP blocking)
📧 Email Configuration Check:
   Method: SendGrid API (works on Render free tier)
   SENDGRID_API_KEY: ✅ Set
```

**When registering, should see:**
```
📤 Sending email via SendGrid API...
✅ Verification email sent via SendGrid!
   Status Code: 202
```

---

## 🎉 Done!

Now emails will work on Render free tier! No more connection timeouts!

---

## 🔄 Switching from SMTP to SendGrid

If you were using SMTP before:

1. **Remove or keep** these variables (SendGrid doesn't need them):
   - `EMAIL_HOST` (not needed)
   - `EMAIL_PORT` (not needed)
   - `EMAIL_USER` (optional, for FROM email)
   - `EMAIL_PASS` (not needed)

2. **Add**:
   - `SENDGRID_API_KEY` (required)
   - `SENDGRID_FROM_EMAIL` (optional, uses EMAIL_USER if not set)

3. **Redeploy** and test!

---

## 📊 SendGrid Dashboard

Monitor your emails:
- Dashboard: https://app.sendgrid.com/
- Activity Feed: See all sent emails
- Stats: Track delivery rates

---

## 💡 Tips

- **Free Tier Limit**: 100 emails/day (plenty for testing!)
- **Upgrade**: If you need more, paid plans start at $19.95/month
- **Multiple Emails**: You can verify multiple sender emails
- **Templates**: SendGrid supports email templates (advanced)

---

**That's it! Your emails will now work on Render! 🎉**

