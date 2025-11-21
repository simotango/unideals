const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const pool = require('./config/database');
require('dotenv').config();

const clientRoutes = require('./routes/client');
const supplierRoutes = require('./routes/supplier');

const app = express();
const PORT = process.env.PORT || 3000;

// Auto-setup database on server start
async function setupDatabase() {
  try {
    console.log('📊 Checking database setup...');
    
    // Check if suppliers table exists
    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'suppliers'
      );
    `);
    
    if (checkTable.rows[0].exists) {
      console.log('✅ Database tables already exist');
      return;
    }
    
    console.log('🔧 Setting up database schema...');
    
    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('✅ Schema.sql executed successfully');
    
    // Read and execute migrations
    const migrations = [
      'migration_add_location_fields.sql',
      'migration_add_supplier_to_orders.sql',
      'fix_etage_size.sql'
    ];
    
    for (const migration of migrations) {
      const migrationPath = path.join(__dirname, 'database', migration);
      if (fs.existsSync(migrationPath)) {
        console.log(`📝 Running migration: ${migration}...`);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        await pool.query(migrationSQL);
        console.log(`✅ ${migration} executed successfully`);
      }
    }
    
    // Verify tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('✅ Database setup completed! Tables created:');
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    // Don't exit - let server start anyway (might be permission issue)
    console.log('⚠️  Server will continue, but database operations may fail');
  }
}

// Middleware
// CORS configuration - allow all origins (for development and production)
app.use(cors({
  origin: '*', // Allow all origins - adjust for production if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static('public'));

// Serve index.html as default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'UniDeals Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/client', clientRoutes);
app.use('/api/supplier', supplierRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Internal server error' 
  });
});

// Start server with database setup
async function startServer() {
  // Setup database first
  await setupDatabase();
  
  // Then start the server
  app.listen(PORT, () => {
    console.log(`🚀 UniDeals Backend server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Start the server
startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

module.exports = app;

