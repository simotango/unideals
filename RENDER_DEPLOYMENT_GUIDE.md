# Render Deployment Guide - UniDeals Backend

Complete step-by-step guide to deploy the UniDeals backend API to Render.

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ A GitHub account
- ✅ Your code pushed to a GitHub repository
- ✅ A Render account (sign up at [render.com](https://render.com))
- ✅ Gmail account (for email verification - optional but recommended)

---

## 🗄️ Step 1: Create PostgreSQL Database on Render

1. **Log in to Render Dashboard**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Sign in or create an account

2. **Create New PostgreSQL Database**
   - Click **"New +"** button
   - Select **"PostgreSQL"**
   - Configure the database:
     - **Name**: `unideals-db` (or your preferred name)
     - **Database**: `unideals` (or leave default)
     - **User**: `unideals_user` (or leave default)
     - **Region**: Choose closest to your users
     - **PostgreSQL Version**: Latest (14 or 15)
     - **Plan**: Free tier is fine for development
   - Click **"Create Database"**

3. **Save Database Connection Details**
   - Wait for database to be provisioned (1-2 minutes)
   - Once ready, go to the database dashboard
   - **IMPORTANT**: Copy these values (you'll need them later):
     - **Internal Database URL** (for Render services)
     - **External Database URL** (for local access if needed)
     - **Host**
     - **Port**
     - **Database Name**
     - **User**
     - **Password**

   ⚠️ **Note**: The password is shown only once. Save it securely!

---

## 🚀 Step 2: Create Web Service on Render

### Option A: Manual Setup (Recommended for First Time)

1. **Create New Web Service**
   - In Render Dashboard, click **"New +"**
   - Select **"Web Service"**

2. **Connect GitHub Repository**
   - Click **"Connect account"** if not already connected
   - Authorize Render to access your GitHub
   - Select your repository containing the backend code
   - Click **"Connect"**

3. **Configure Web Service**
   - **Name**: `unideals-backend` (or your preferred name)
   - **Region**: Same as database (for better performance)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `BACKEND` (important!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free tier is fine for development

### Option B: Using render.yaml (Advanced)

If you want to automate setup, you can use the `render.yaml` file:

1. **Move render.yaml to Repository Root**
   - The `render.yaml` file should be in your repository root (not in BACKEND folder)
   - Or create it in root with proper paths

2. **Create from Blueprint**
   - In Render Dashboard, click **"New +"**
   - Select **"Blueprint"**
   - Connect your repository
   - Render will detect `render.yaml` and create services automatically

3. **Complete Environment Variables**
   - After blueprint creates services, add remaining environment variables manually
   - Database credentials, JWT_SECRET, email credentials, etc.

**Note**: Manual setup (Option A) is recommended for first-time deployment to understand the process.

4. **Add Environment Variables** (Click "Advanced" → "Add Environment Variable")
   
   Add these variables one by one:

   ```env
   # Database Configuration (from Step 1)
   DB_HOST=<your-database-host>
   DB_PORT=5432
   DB_NAME=<your-database-name>
   DB_USER=<your-database-user>
   DB_PASS=<your-database-password>
   
   # JWT Configuration
   JWT_SECRET=<generate-a-strong-random-string>
   JWT_EXPIRES_IN=7d
   
   # Email Configuration (Gmail example)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=<your-gmail-app-password>
   
   # Server Configuration
   PORT=10000
   NODE_ENV=production
   ```

   **Important Notes:**
   - Use the database credentials from Step 1
   - Generate a strong `JWT_SECRET` (use a random string generator)
   - For Gmail, you need an [App Password](https://support.google.com/accounts/answer/185833)
   - Render uses port `10000` by default (or check your service settings)

5. **Create Web Service**
   - Click **"Create Web Service"**
   - Render will start building and deploying your service

---

## 📊 Step 3: Run Database Migrations

After the web service is created, you need to set up the database schema:

### Option A: Using Render Shell (Recommended)

1. **Open Render Shell**
   - Go to your Web Service dashboard
   - Click **"Shell"** tab
   - This opens a terminal in your service environment

2. **Run Schema Migration**
   ```bash
   # Navigate to the database directory
   cd database
   
   # Run the schema (you'll need to use psql)
   # First, install psql if not available, or use the connection string
   ```

   **Alternative**: Use the PostgreSQL connection from Render dashboard:
   - Go to your PostgreSQL database dashboard
   - Click **"Connect"** or **"Info"**
   - Copy the **Internal Database URL**
   - Use it to connect and run the schema

### Option B: Using Render PostgreSQL Dashboard

1. **Access Database**
   - Go to your PostgreSQL database dashboard
   - Click **"Connect"** or find connection info

2. **Run Schema SQL**
   - Use a PostgreSQL client (pgAdmin, DBeaver, or Render's built-in SQL editor if available)
   - Connect using the External Database URL
   - Run the contents of `database/schema.sql`
   - Also run any migration files:
     - `migration_add_location_fields.sql`
     - `migration_add_supplier_to_orders.sql`
     - `fix_etage_size.sql`

### Option C: Using psql Command Line

If you have `psql` installed locally:

```bash
# Use the External Database URL from Render
psql "postgresql://user:password@host:port/database" -f database/schema.sql
```

---

## ✅ Step 4: Verify Deployment

1. **Check Build Logs**
   - In your Web Service dashboard, check **"Logs"** tab
   - Ensure build completed successfully
   - Look for: `✅ Connected to PostgreSQL database`

2. **Test Health Endpoint**
   - Your service URL will be: `https://your-service-name.onrender.com`
   - Test the health endpoint:
     ```bash
     curl https://your-service-name.onrender.com/health
     ```
   - Or visit in browser: `https://your-service-name.onrender.com/health`
   - Should return:
     ```json
     {
       "success": true,
       "message": "UniDeals Backend is running",
       "timestamp": "..."
     }
     ```

3. **Test API Endpoint**
   ```bash
   # Test client registration
   curl -X POST https://your-service-name.onrender.com/api/client/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

---

## 🔧 Step 5: Configure Custom Domain (Optional)

1. **Add Custom Domain**
   - In Web Service dashboard, go to **"Settings"**
   - Scroll to **"Custom Domains"**
   - Add your domain
   - Follow DNS configuration instructions

---

## 🔍 Troubleshooting

### Issue: Build Fails

**Symptoms**: Build logs show errors

**Solutions**:
- Check that `Root Directory` is set to `BACKEND`
- Verify `package.json` exists in the BACKEND folder
- Check build logs for specific error messages
- Ensure Node.js version is compatible (Render uses latest LTS)

### Issue: Database Connection Fails

**Symptoms**: Logs show database connection errors

**Solutions**:
- Verify all database environment variables are correct
- Check that database is in the same region as web service
- Ensure database is fully provisioned (wait 2-3 minutes)
- Verify `DB_HOST` uses the internal hostname (not external)
- Check that `DB_PASS` doesn't have special characters that need escaping

### Issue: Service Crashes on Start

**Symptoms**: Service starts then immediately crashes

**Solutions**:
- Check logs for error messages
- Verify `PORT` environment variable (Render uses `10000` or `PORT` env var)
- Ensure `NODE_ENV=production` is set
- Check that all required environment variables are present

### Issue: Email Not Sending

**Symptoms**: Verification codes not received

**Solutions**:
- Check email configuration in environment variables
- For Gmail, ensure you're using an App Password (not regular password)
- Check service logs for email errors
- Verify `EMAIL_USER` and `EMAIL_PASS` are correct
- Note: If email fails, codes are logged to console (check Render logs)

### Issue: Database Schema Not Applied

**Symptoms**: API returns database errors

**Solutions**:
- Verify schema was run successfully
- Check database connection from Render Shell
- Run schema manually using one of the methods in Step 3
- Verify all tables exist: `clients`, `suppliers`, `products`, etc.

---

## 📝 Environment Variables Checklist

Before deploying, ensure you have all these variables set:

- [ ] `DB_HOST` - Database hostname
- [ ] `DB_PORT` - Database port (usually 5432)
- [ ] `DB_NAME` - Database name
- [ ] `DB_USER` - Database username
- [ ] `DB_PASS` - Database password
- [ ] `JWT_SECRET` - Strong random string
- [ ] `JWT_EXPIRES_IN` - Token expiration (e.g., "7d")
- [ ] `EMAIL_HOST` - SMTP host (e.g., "smtp.gmail.com")
- [ ] `EMAIL_PORT` - SMTP port (usually 587)
- [ ] `EMAIL_USER` - Email username
- [ ] `EMAIL_PASS` - Email password/app password
- [ ] `PORT` - Server port (usually 10000 on Render)
- [ ] `NODE_ENV` - Set to "production"

---

## 🔐 Security Best Practices

1. **JWT Secret**
   - Use a strong, random string (at least 32 characters)
   - Never commit secrets to Git
   - Use different secrets for development and production

2. **Database Password**
   - Render generates secure passwords automatically
   - Never share or commit database credentials

3. **Email Credentials**
   - Use App Passwords for Gmail (not your regular password)
   - Store credentials only in Render environment variables

4. **Environment Variables**
   - Never commit `.env` file to Git
   - Use Render's environment variables for all secrets
   - Review variables regularly

---

## 📊 Monitoring

1. **View Logs**
   - Go to Web Service dashboard → **"Logs"** tab
   - Monitor for errors and warnings
   - Check database connection status

2. **Metrics**
   - Render provides basic metrics (CPU, Memory, Requests)
   - Monitor service health in dashboard

3. **Database Metrics**
   - Check PostgreSQL dashboard for connection count
   - Monitor database size and performance

---

## 🚀 Post-Deployment Checklist

After deployment, verify:

- [ ] Health endpoint returns success: `/health`
- [ ] Database connection successful (check logs)
- [ ] Client registration works: `POST /api/client/register`
- [ ] Email verification code received (or logged to console)
- [ ] Supplier registration works: `POST /api/supplier/register`
- [ ] Authentication works: `POST /api/client/login`
- [ ] Products endpoint works: `GET /api/client/products` (with auth)
- [ ] Database schema applied correctly

---

## 🔄 Updating Deployment

When you push changes to GitHub:

1. **Automatic Deployment**
   - Render automatically detects pushes to connected branch
   - Triggers new build and deployment
   - Usually takes 2-5 minutes

2. **Manual Deployment**
   - Go to Web Service dashboard
   - Click **"Manual Deploy"** → **"Deploy latest commit"**

3. **Rollback**
   - Go to **"Events"** tab
   - Find previous successful deployment
   - Click **"Redeploy"**

---

## 📞 Support Resources

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Render Status**: [status.render.com](https://status.render.com)
- **Render Community**: [community.render.com](https://community.render.com)

---

## 🎯 Quick Reference

### Service URL Format
```
https://your-service-name.onrender.com
```

### Health Check
```
GET https://your-service-name.onrender.com/health
```

### API Base URL
```
https://your-service-name.onrender.com/api
```

### Example: Client Registration
```bash
curl -X POST https://your-service-name.onrender.com/api/client/register \
  -H "Content-Type: application/json" \
  -d '{"email":"student@university.edu"}'
```

---

## 📝 Notes

- **Free Tier Limitations**:
  - Services spin down after 15 minutes of inactivity
  - First request after spin-down takes ~30 seconds
  - Database has connection limits
  - Consider upgrading for production use

- **Performance Tips**:
  - Use same region for database and web service
  - Enable connection pooling (already configured)
  - Monitor database query performance
  - Consider caching for frequently accessed data

- **Cost Considerations**:
  - Free tier is great for development/testing
  - Production should use paid plans for reliability
  - Database backups included in paid plans

---

*Last Updated: Based on current Render platform features*

