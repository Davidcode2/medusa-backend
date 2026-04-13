#!/usr/bin/env node

/**
 * Pre-compiled migration runner
 * 
 * This script runs database migrations using the Medusa framework directly
 * without requiring TypeScript compilation at runtime.
 * 
 * Usage: node scripts/run-migrations.js
 */

const path = require('path');

// Set up environment
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

console.log('='.repeat(60));
console.log('Running Medusa Database Migrations');
console.log('='.repeat(60));
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('CWD:', process.cwd());

// Check for required environment variables
const requiredEnvVars = ['DATABASE_URL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('ERROR: Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`  - ${varName}`));
  process.exit(1);
}

// Load the compiled config
const configPath = path.join(process.cwd(), 'medusa-config.js');
console.log('\nLoading config from:', configPath);

let config;
try {
  config = require(configPath);
  console.log('✓ Config loaded successfully');
} catch (error) {
  console.error('✗ Failed to load config:', error.message);
  console.error('\nTroubleshooting:');
  console.error('1. Ensure medusa-config.js exists in the working directory');
  console.error('2. Check that the config file is valid JavaScript');
  console.error('3. Verify all environment variables are set correctly');
  process.exit(1);
}

// Import and run the migration command
const runMigrations = async () => {
  try {
    console.log('\nImporting Medusa migration module...');
    
    // Import the migrate command from @medusajs/medusa
    const migrateModule = require('@medusajs/medusa/commands/db/migrate');
    const migrateCommand = migrateModule.default || migrateModule;
    
    if (!migrateCommand) {
      throw new Error('Could not find migrate command in @medusajs/medusa/commands/db/migrate');
    }
    
    console.log('✓ Migration module loaded');
    console.log('\nExecuting migrations...');
    console.log('-'.repeat(60));
    
    // Run the migration command with the same options as the CLI
    await migrateCommand({
      directory: process.cwd(),
      skipScripts: process.argv.includes('--skip-scripts'),
      skipLinks: process.argv.includes('--skip-links'),
      executeSafeLinks: true,
      concurrency: 1,
      allOrNothing: false,
      useYarn: true
    });
    
    console.log('-'.repeat(60));
    console.log('✓ Migrations completed successfully!');
    console.log('='.repeat(60));
    process.exit(0);
  } catch (error) {
    console.log('-'.repeat(60));
    console.error('✗ Migration failed:', error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    console.log('='.repeat(60));
    process.exit(1);
  }
};

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Run migrations
runMigrations();
