#!/usr/bin/env node

// Test script to demonstrate verbose logging
process.env.VERBOSE = 'true';
process.env.DEBUG = 'true';

console.log('🚀 Starting MCP Server with verbose logging...');
console.log('Environment variables set: VERBOSE=true, DEBUG=true');

// Import and start the server
import('./dist/index.js');