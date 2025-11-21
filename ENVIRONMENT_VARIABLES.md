# Environment Variables Reference

Complete list of all environment variables needed for the UniDeals Backend.

---

## 📋 Required Environment Variables

### Database Configuration

```env
DB_HOST=localhost              # Database hostname (127.0.0.1 for local, Render hostname for production)
DB_PORT=5432                   # PostgreSQL port (usually 5432)
DB_NAME=unideals               # Database name
DB_USER=postgres               # Database username
DB_PASSWORD=postgres           # Database password (can be empty for trust auth)
```

**For Local Development:**
```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=unideals
DB_USER=postgres
DB_PASSWORD=                    # Can be empty if using trust authentication
```

**For Render (Production):**
```env
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com    # From Render database dashboard
DB_PORT=5432
DB_NAME=unideals_xxxxx                            # From Render database dashboard
DB_USER=unideals_user_xxxxx                       # From Render database dashboard
DB_PASSWORD=your-render-database-password          # From Render database dashboard
```

---

### JWT Configuration

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

**Details:**
- `JWT_SECRET`: **REQUIRED** - Strong random string (minimum 32 characters recommended)
  - Generate one: Use a password generator or: `openssl rand -base64 32`
  - **NEVER** commit this to Git
  - Use different secrets for development and production
  
- `JWT_EXPIRES_IN`: Optional - Token expiration time
  - Default: `7d` (7 days)
  - Examples: `1h`, `24h`, `7d`, `30d`

**Example:**
```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_EXPIRES_IN=7d
```

---

### Email Configuration (Optional but Recommended)

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Details:**
- `EMAIL_HOST`: SMTP server hostname
  - Gmail: `smtp.gmail.com`
  - Outlook: `smtp-mail.outlook.com`
  - Custom: Your SMTP server hostname

- `EMAIL_PORT`: SMTP port
  - Gmail: `587` (TLS) or `465` (SSL)
  - Outlook: `587`
  - Default: `587`

- `EMAIL_USER`: Your email address
  - Gmail: `your-email@gmail.com`
  - Must match the email used for App Password

- `EMAIL_PASS`: Email password or App Password
  - **For Gmail**: Use [App Password](https://support.google.com/accounts/answer/185833)
    - Enable 2-Step Verification first
    - Generate App Password: Google Account → Security → 2-Step Verification → App passwords
  - **NOT** your regular Gmail password

**Note:** If email is not configured, verification codes will be logged to console instead.

**Gmail Example:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=myapp@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop    # Gmail App Password (16 characters, spaces optional)
```

---

### Server Configuration

```env
PORT=3000
NODE_ENV=development
```

**Details:**
- `PORT`: Server port number
  - Local: `3000` (or any available port)
  - Render: `10000` (Render's default, or use `PORT` env var)
  - Default: `3000`

- `NODE_ENV`: Environment mode
  - `development` - Local development
  - `production` - Production deployment
  - Affects SSL settings for database connection

**For Local Development:**
```env
PORT=3000
NODE_ENV=development
```

**For Render (Production):**
```env
PORT=10000
NODE_ENV=production
```

---

## 📝 Complete .env File Template

### Local Development (.env)

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=unideals
DB_USER=postgres
DB_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Production (Render)

```env
# Database Configuration (from Render dashboard)
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=unideals_xxxxx
DB_USER=unideals_user_xxxxx
DB_PASSWORD=your-render-database-password

# JWT Configuration
JWT_SECRET=generate-a-strong-random-string-here-minimum-32-characters
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Server Configuration
PORT=10000
NODE_ENV=production
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` file to Git**
   - Already in `.gitignore` ✅
   - Use `env.example` as template

2. **Use strong JWT_SECRET**
   - Minimum 32 characters
   - Random and unpredictable
   - Different for each environment

3. **Use App Passwords for Gmail**
   - Don't use your regular Gmail password
   - Generate App Password from Google Account settings

4. **Rotate secrets regularly**
   - Change JWT_SECRET periodically
   - Update database passwords

5. **Use environment-specific values**
   - Different values for development and production
   - Never use production secrets in development

---

## 🚀 Quick Setup

### 1. Copy Template
```bash
# In BACKEND folder
cp env.example .env
```

### 2. Edit .env File
Open `.env` and fill in your values:
- Database credentials
- Generate JWT_SECRET
- Add email credentials (optional)

### 3. Generate JWT Secret (Optional)
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -base64 32
```

---

## ✅ Verification

After setting up environment variables, verify they're loaded:

```bash
# Check if .env file exists
ls -la .env

# Test database connection
node test-db-connection.js

# Start server (will show if email is configured)
npm start
```

---

## 📊 Environment Variables Summary

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DB_HOST` | ✅ | `127.0.0.1` | Database hostname |
| `DB_PORT` | ✅ | `5432` | Database port |
| `DB_NAME` | ✅ | `unideals` | Database name |
| `DB_USER` | ✅ | `postgres` | Database user |
| `DB_PASSWORD` | ⚠️ | `` | Database password (can be empty) |
| `JWT_SECRET` | ✅ | - | JWT signing secret |
| `JWT_EXPIRES_IN` | ❌ | `7d` | Token expiration |
| `EMAIL_HOST` | ❌ | `smtp.gmail.com` | SMTP host |
| `EMAIL_PORT` | ❌ | `587` | SMTP port |
| `EMAIL_USER` | ❌ | - | Email username |
| `EMAIL_PASS` | ❌ | - | Email password/app password |
| `PORT` | ❌ | `3000` | Server port |
| `NODE_ENV` | ❌ | `development` | Environment mode |

**Legend:**
- ✅ Required
- ⚠️ Optional but recommended
- ❌ Optional

---

## 🔍 Troubleshooting

### Issue: Database connection fails
- Check `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- Verify database is running
- Check firewall/network settings

### Issue: JWT tokens invalid
- Verify `JWT_SECRET` is set
- Ensure same secret used for signing and verification
- Check token expiration

### Issue: Email not sending
- Verify `EMAIL_USER` and `EMAIL_PASS` are set
- For Gmail, use App Password (not regular password)
- Check `EMAIL_HOST` and `EMAIL_PORT`
- Check service logs for email errors

### Issue: Server won't start
- Check `PORT` is not already in use
- Verify all required variables are set
- Check `.env` file syntax (no spaces around `=`)

---

*Last Updated: Based on current codebase*




