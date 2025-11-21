# Database Setup Instructions

## Current Status
- ✅ PostgreSQL is running (postgresql-x64-17)
- ✅ Port 5432 is accessible
- ⚠️  Need to set password and create database

## Step 1: Set PostgreSQL Password

You need to set the password for the `postgres` user to `postgres`.

### Option A: Using pgAdmin (Easiest)
1. Open **pgAdmin**
2. Connect to your PostgreSQL server
3. Expand **Login/Group Roles**
4. Right-click on **postgres** → **Properties**
5. Go to **Definition** tab
6. Set **Password** to: `postgres`
7. Click **Save**

### Option B: Using psql Command Line
1. Open PowerShell or Command Prompt
2. Navigate to PostgreSQL bin folder (usually `C:\Program Files\PostgreSQL\17\bin`)
3. Run:
   ```powershell
   .\psql -U postgres
   ```
4. If it connects, run:
   ```sql
   ALTER USER postgres WITH PASSWORD 'postgres';
   ```
5. Type `\q` to exit

### Option C: Using SQL File
1. Open pgAdmin
2. Right-click on your server → **Query Tool**
3. Copy and paste:
   ```sql
   ALTER USER postgres WITH PASSWORD 'postgres';
   ```
4. Click **Execute** (F5)

## Step 2: Create the Database

### Using pgAdmin:
1. Right-click on **Databases** → **Create** → **Database**
2. Name: `unideals`
3. Owner: `postgres`
4. Click **Save**

### Using psql:
```sql
CREATE DATABASE unideals;
```

## Step 3: Run the Schema

### Using pgAdmin:
1. Right-click on **unideals** database → **Query Tool**
2. Open `database/schema.sql` file
3. Copy all content and paste in Query Tool
4. Click **Execute** (F5)

### Using psql:
```powershell
psql -U postgres -d unideals -f database/schema.sql
```

## Step 4: Test Connection

Your `.env` file should have:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unideals
DB_USER=postgres
DB_PASSWORD=postgres
```

Then restart your server:
```powershell
npm start
```

## Troubleshooting

**If password doesn't work:**
- Try the password you set during PostgreSQL installation
- Or reset it using the methods above

**If database already exists:**
- You can skip Step 2, just run the schema

**If you get permission errors:**
- Make sure you're using the `postgres` superuser
- Or create a new user with proper permissions






