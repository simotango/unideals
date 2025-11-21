# How to Reset/Set PostgreSQL Password

Since you don't know the PostgreSQL password, we'll use **Windows Authentication** to connect and set a new password.

## Method 1: Using pgAdmin (Easiest)

### Step 1: Connect with Windows Authentication
1. Open **pgAdmin**
2. When it asks for password, try:
   - Leave password **empty** and click OK
   - Or use your **Windows login password**
   - Or check "Save password" if you've connected before

3. If you can't connect, try:
   - Right-click on your server → **Properties**
   - Go to **Connection** tab
   - Change **Authentication** to use Windows authentication

### Step 2: Set New Password
Once connected:
1. Expand **Login/Group Roles**
2. Right-click on **postgres** → **Properties**
3. Go to **Definition** tab
4. Set **Password** to: `postgres`
5. Click **Save**

## Method 2: Using psql with Windows Authentication

1. Open **Command Prompt as Administrator**
2. Navigate to PostgreSQL bin folder:
   ```cmd
   cd "C:\Program Files\PostgreSQL\17\bin"
   ```
   (Adjust version number if different)

3. Connect using Windows authentication:
   ```cmd
   psql -U postgres -d postgres
   ```
   (It might not ask for password if Windows auth is enabled)

4. If connected, run:
   ```sql
   ALTER USER postgres WITH PASSWORD 'postgres';
   \q
   ```

## Method 3: Reset via pg_hba.conf (Advanced)

If nothing works, you can temporarily allow passwordless connections:

1. Find `pg_hba.conf` file (usually in `C:\Program Files\PostgreSQL\17\data\`)

2. Open it as Administrator

3. Find the line:
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```

4. Temporarily change to:
   ```
   host    all             all             127.0.0.1/32            trust
   ```

5. Restart PostgreSQL service:
   ```powershell
   Restart-Service postgresql-x64-17
   ```

6. Connect without password and set new password:
   ```sql
   ALTER USER postgres WITH PASSWORD 'postgres';
   ```

7. Change `pg_hba.conf` back to `scram-sha-256`

8. Restart PostgreSQL service again

## Method 4: Check Installation Notes

- Check if you wrote down the password during installation
- Check your password manager
- Check installation documentation/notes

## After Setting Password

1. Update `.env` (already done):
   ```env
   DB_PASSWORD=postgres
   ```

2. Test connection:
   ```powershell
   node test-db-connection.js
   ```

3. If successful, create database and run schema!






