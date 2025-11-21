# Quick Setup Guide

## Issues Fixed ✅

1. **Email Configuration** - Now optional! If not configured, verification codes will be displayed in the console
2. **University Email Restriction** - Removed! You can now use any email address for testing
3. **Database Authentication** - You need to configure your PostgreSQL credentials

## Database Setup

### Step 1: Create your `.env` file

Copy the example file:
```powershell
Copy-Item env.example .env
```

### Step 2: Update Database Credentials in `.env`

Open `.env` and update these lines with YOUR PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unideals
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
```

**Common PostgreSQL setups:**

**If you installed PostgreSQL with default settings:**
- `DB_USER=postgres`
- `DB_PASSWORD=postgres` (or the password you set during installation)

**If you're using a different user:**
- `DB_USER=your_username`
- `DB_PASSWORD=your_password`

### Step 3: Create the Database

**Option A: Using psql command line**
```powershell
psql -U postgres
CREATE DATABASE unideals;
\q
```

**Option B: Using createdb**
```powershell
createdb -U postgres unideals
```

### Step 4: Run the Database Schema

```powershell
psql -U postgres -d unideals -f database/schema.sql
```

Or if you need to specify password:
```powershell
$env:PGPASSWORD="your_password"; psql -U postgres -d unideals -f database/schema.sql
```

## Email Configuration (Optional)

If you want to send real emails, update these in `.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**For Gmail:**
1. Enable 2-Step Verification
2. Generate App Password: https://support.google.com/accounts/answer/185833
3. Use the App Password in `EMAIL_PASS`

**If you don't configure email:**
- Verification codes will be displayed in the server console
- Check your terminal/command prompt when you register

## Testing

1. Start the server:
   ```powershell
   npm start
   ```

2. Open browser: `http://localhost:3000`

3. Register a client with ANY email (no restrictions!)

4. Check the server console for the verification code

5. Use that code to verify and set password

## Troubleshooting

### "Password authentication failed"
- Check your `.env` file has correct `DB_USER` and `DB_PASSWORD`
- Make sure PostgreSQL is running
- Try connecting manually: `psql -U postgres`

### "Database does not exist"
- Create the database: `CREATE DATABASE unideals;`

### "Relation does not exist"
- Run the schema: `psql -U postgres -d unideals -f database/schema.sql`






