# How to Set PostgreSQL Password

Since your PostgreSQL uses SCRAM authentication, you need to set a password for the `postgres` user.

## Option 1: Set Password via SQL (Recommended)

1. **Open PostgreSQL command line or pgAdmin**

2. **Connect to PostgreSQL** (you might need to use Windows authentication or find another way to connect)

3. **Run this SQL command:**
   ```sql
   ALTER USER postgres WITH PASSWORD 'postgres';
   ```

4. **Update your `.env` file:**
   ```env
   DB_PASSWORD=postgres
   ```

## Option 2: Use pgAdmin (GUI)

1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Login/Group Roles" → "postgres"
4. Go to "Definition" tab
5. Set password to: `postgres`
6. Save

## Option 3: If you can't access PostgreSQL

If you can't access PostgreSQL to set a password, you might need to:
- Check if PostgreSQL service is running
- Try connecting with your Windows username instead of 'postgres'
- Reinstall PostgreSQL with a password you remember

## After Setting Password

1. Update `.env`:
   ```env
   DB_PASSWORD=postgres
   ```

2. Restart your server:
   ```powershell
   npm start
   ```






