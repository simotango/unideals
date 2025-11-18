const { Pool } = require('pg');
require('dotenv').config();

// Handle password - Using IPv4 (127.0.0.1) with 'trust' auth doesn't require password
// But pg library still needs a string value
const dbPassword = (process.env.DB_PASSWORD && process.env.DB_PASSWORD.trim() !== '') 
  ? String(process.env.DB_PASSWORD).trim()
  : ''; // Empty string for trust authentication

const poolConfig = {
  host: process.env.DB_HOST || '127.0.0.1', // Use IPv4 to match 'trust' in pg_hba.conf
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'unideals',
  user: process.env.DB_USER || 'postgres',
  password: dbPassword, // Always set as string
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

const pool = new Pool(poolConfig);

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err.message);
  if (err.code === '28P01') {
    console.error('💡 Tip: Check your DB_USER and DB_PASSWORD in .env file');
  } else if (err.code === '3D000') {
    console.error('💡 Tip: Database does not exist. Create it with: CREATE DATABASE unideals;');
  }
  // Don't exit in development - let the app try to connect on first query
  if (process.env.NODE_ENV === 'production') {
    process.exit(-1);
  }
});

module.exports = pool;

