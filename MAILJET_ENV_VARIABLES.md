# Mailjet Environment Variables for Render

## ✅ Required Variables

Add these **exact** variable names in Render Dashboard → Your Service → Environment:

### 1. MAILJET_API_KEY
```
MAILJET_API_KEY=c3d5b7ccbaf835a94eb8595eae3a1966
```
- **Your value**: `c3d5b7ccbaf835a94eb8595eae3a1966`
- **Required**: Yes
- **Where to get it**: Mailjet Dashboard → Account Settings → API Keys

### 2. MAILJET_API_SECRET
```
MAILJET_API_SECRET=272c24bf155f066e9290c87f9e23c912
```
- **Your value**: `272c24bf155f066e9290c87f9e23c912`
- **Required**: Yes
- **Where to get it**: Mailjet Dashboard → Account Settings → API Keys

## 🔧 Optional Variables

### 3. MAILJET_FROM_EMAIL (Optional)
```
MAILJET_FROM_EMAIL=simomohamessi@gmail.com
```
- **Required**: No (will use EMAIL_USER if set, or default to noreply@unideals.com)
- **Note**: This email MUST be verified in Mailjet first!

---

## 📋 Step-by-Step: Add to Render

1. **Go to Render Dashboard**
   - https://dashboard.render.com
   - Click on your Web Service

2. **Go to Environment Tab**
   - Click "Environment" in the left sidebar

3. **Add Variables** (one by one):
   
   **Variable 1:**
   - Key: `MAILJET_API_KEY`
   - Value: `c3d5b7ccbaf835a94eb8595eae3a1966`
   - Click "Save Changes"
   
   **Variable 2:**
   - Key: `MAILJET_API_SECRET`
   - Value: `272c24bf155f066e9290c87f9e23c912`
   - Click "Save Changes"
   
   **Variable 3 (Optional):**
   - Key: `MAILJET_FROM_EMAIL`
   - Value: `simomohamessi@gmail.com`
   - Click "Save Changes"

4. **Render will auto-redeploy** (wait 2-3 minutes)

---

## ⚠️ Important Notes

1. **Case Sensitive**: Variable names are case-sensitive!
   - ✅ Correct: `MAILJET_API_KEY`
   - ❌ Wrong: `mailjet_api_key` or `Mailjet_Api_Key`

2. **No Spaces**: 
   - ✅ Correct: `MAILJET_API_KEY=c3d5b7ccbaf835a94eb8595eae3a1966`
   - ❌ Wrong: `MAILJET_API_KEY = c3d5b7ccbaf835a94eb8595eae3a1966`

3. **No Quotes**: Don't add quotes around values
   - ✅ Correct: `MAILJET_API_KEY=c3d5b7ccbaf835a94eb8595eae3a1966`
   - ❌ Wrong: `MAILJET_API_KEY="c3d5b7ccbaf835a94eb8595eae3a1966"`

4. **Verify Sender Email**: Before emails work, verify your sender email in Mailjet:
   - Go to: https://app.mailjet.com/account/sender
   - Add and verify: `simomohamessi@gmail.com`

---

## ✅ Checklist

- [ ] `MAILJET_API_KEY` added to Render
- [ ] `MAILJET_API_SECRET` added to Render
- [ ] `MAILJET_FROM_EMAIL` added (optional but recommended)
- [ ] Sender email verified in Mailjet
- [ ] Service redeployed
- [ ] Checked logs for "✅ Mailjet API configured"

---

## 🔍 Verify It's Working

After deployment, check Render logs. You should see:

```
✅ Mailjet API configured (6,000 emails/month free!)
📧 Email Configuration Check:
   Method: Mailjet API (6,000 emails/month free!)
   MAILJET_API_KEY: ✅ Set
   MAILJET_API_SECRET: ✅ Set
```

If you see this, Mailjet is configured correctly! 🎉

