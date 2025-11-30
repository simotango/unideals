# Setup Mailjet for Email (6,000 FREE Emails/Month!)

## 🎯 Why Mailjet?

**Mailjet Free Tier:**
- ✅ **6,000 emails/month** (200/day) - MOST FREE EMAILS!
- ✅ Works on Render free tier (HTTP API, not SMTP)
- ✅ No SMTP blocking issues
- ✅ Easy setup

**Best choice if you need more free emails!**

---

## 📋 Step 1: Create Mailjet Account

1. Go to: https://www.mailjet.com/signup
2. Sign up for free account
3. Verify your email address

---

## 🔑 Step 2: Get API Keys

1. **Go to Mailjet Dashboard**
   - https://app.mailjet.com/

2. **Navigate to API Keys**
   - Account Settings → API Keys (top right menu)
   - Or: https://app.mailjet.com/account/api_keys

3. **Copy Your Keys**
   - You'll see:
     - **API Key** (starts with letters/numbers)
     - **Secret Key** (longer string)
   - ⚠️ **IMPORTANT**: Keep these secret!

---

## 📧 Step 3: Verify Sender Email (Required!)

Mailjet requires you to verify your sender email:

1. **Go to Sender & Domains**
   - Senders & Domains → Senders
   - Or: https://app.mailjet.com/account/sender

2. **Add Sender**
   - Click **"Add a sender"**
   - Enter your email: `simomohamessi@gmail.com` (or your email)
   - Click **"Add"**

3. **Verify Email**
   - Mailjet will send a verification email
   - Click the verification link in your email
   - ✅ Email verified!

---

## 🚀 Step 4: Add to Render

1. **Go to Render Dashboard**
   - Your Web Service → **Environment** tab

2. **Add Environment Variables**
   ```
   MAILJET_API_KEY=your-api-key-here
   MAILJET_API_SECRET=your-secret-key-here
   ```

3. **Optional: Set From Email**
   ```
   MAILJET_FROM_EMAIL=simomohamessi@gmail.com
   ```
   (If not set, uses EMAIL_USER or defaults to noreply@unideals.com)

4. **Save** - Render will auto-redeploy

---

## ✅ Step 5: Test

After deployment, check Render logs:

**Should see:**
```
✅ Mailjet API configured (6,000 emails/month free!)
📧 Email Configuration Check:
   Method: Mailjet API (6,000 emails/month free!)
   MAILJET_API_KEY: ✅ Set
   MAILJET_API_SECRET: ✅ Set
```

**When registering, should see:**
```
📤 Sending email via Mailjet API...
✅ Verification email sent via Mailjet!
   Status: success
```

---

## 🎉 Done!

Now you have **6,000 free emails per month**! That's 200 emails per day - way more than SendGrid's 100/day!

---

## 📊 Mailjet Dashboard

Monitor your emails:
- Dashboard: https://app.mailjet.com/
- Statistics: Track sent/delivered emails
- Activity: See all email activity

---

## 💡 Comparison

| Service | Free Tier | Best For |
|---------|-----------|----------|
| **Mailjet** | 6,000/month (200/day) | Most free emails |
| SendGrid | 100/day | Simple setup |
| Mailgun | 100/day | Developer-friendly |

**Mailjet = Most free emails! 🏆**

---

## 🔄 Switching from SendGrid to Mailjet

If you were using SendGrid:

1. **Remove**:
   - `SENDGRID_API_KEY`

2. **Add**:
   - `MAILJET_API_KEY`
   - `MAILJET_API_SECRET`

3. **Redeploy** and test!

---

**That's it! Enjoy 6,000 free emails per month! 🎉**

