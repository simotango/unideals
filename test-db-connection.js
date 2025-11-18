// Test database connection
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1', // Use IPv4 to match 'trust' in pg_hba.conf
  port: parseInt(process.env.DB_PORT) || 5432,
  database: 'postgres', // Connect to default postgres database first
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

console.log('Testing database connection...');
console.log('Host:', process.env.DB_HOST || 'localhost');
console.log('Port:', process.env.DB_PORT || 5432);
console.log('User:', process.env.DB_USER || 'postgres');
console.log('Password:', process.env.DB_PASSWORD ? '***set***' : 'not set');

pool.query('SELECT version()', (err, res) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
    console.error('Error code:', err.code);
    
    if (err.code === '28P01') {
      console.log('\n💡 Password authentication failed.');
      console.log('   Try setting password in PostgreSQL:');
      console.log('   ALTER USER postgres WITH PASSWORD \'postgres\';');
    } else if (err.code === '3D000') {
      console.log('\n💡 Database does not exist.');
    }
    process.exit(1);
  } else {
    console.log('✅ Connected successfully!');
    console.log('PostgreSQL version:', res.rows[0].version);
    
    // Check if unideals database exists
    pool.query("SELECT 1 FROM pg_database WHERE datname = 'unideals'", (err, res) => {
      if (err) {
        console.error('Error checking database:', err.message);
      } else if (res.rows.length === 0) {
        console.log('\n⚠️  Database "unideals" does not exist.');
        console.log('   Create it with: CREATE DATABASE unideals;');
      } else {
        console.log('\n✅ Database "unideals" exists!');
      }
      pool.end();
    });
  }
});

