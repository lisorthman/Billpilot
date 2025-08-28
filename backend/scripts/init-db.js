#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: 'postgres', // Connect to default postgres database first
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'your_password',
  ssl: process.env.DB_SSL === 'true',
});

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Initializing BillPilot database...');
    
    // Check if database exists
    const dbExists = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'billpilot']
    );
    
    if (dbExists.rows.length === 0) {
      console.log('📊 Creating database...');
      await client.query(`CREATE DATABASE ${process.env.DB_NAME || 'billpilot'}`);
      console.log('✅ Database created successfully');
    } else {
      console.log('✅ Database already exists');
    }
    
    // Close connection to postgres database
    await client.end();
    
    // Connect to the billpilot database
    const billpilotPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'billpilot',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'your_password',
      ssl: process.env.DB_SSL === 'true',
    });
    
    const billpilotClient = await billpilotPool.connect();
    
    try {
      // Read and execute the schema file
      const schemaPath = path.join(__dirname, '../src/models/database.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      console.log('🔧 Setting up database schema...');
      await billpilotClient.query(schema);
      console.log('✅ Database schema created successfully');
      
      console.log('🎉 Database initialization complete!');
      console.log('\n📋 Next steps:');
      console.log('1. Start the backend server: npm run dev');
      console.log('2. Test the health endpoint: curl http://localhost:3001/health');
      console.log('3. Check the README.md for API documentation');
      
    } finally {
      await billpilotClient.end();
      await billpilotPool.end();
    }
    
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if this script is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
