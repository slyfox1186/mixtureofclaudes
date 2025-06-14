import { MCPServer } from "mcp-framework";

// Enable verbose logging
const VERBOSE = process.env.VERBOSE === 'true' || process.env.DEBUG === 'true';
const port = process.env.PORT || 9955;

// Enhanced logging utility
const log = {
  info: (message: string, data?: unknown) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
    if (VERBOSE && data) console.log(`  → Details:`, JSON.stringify(data, null, 2));
  },
  debug: (message: string, data?: unknown) => {
    if (VERBOSE) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [DEBUG] ${message}`);
      if (data) console.log(`  → Details:`, JSON.stringify(data, null, 2));
    }
  },
  warn: (message: string, data?: unknown) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] ⚠️  ${message}`);
    if (data) console.warn(`  → Details:`, JSON.stringify(data, null, 2));
  },
  error: (message: string, error?: unknown) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ ${message}`);
    if (error) console.error(`  → Error:`, error);
  }
};

log.info(`Starting Mixture of Claudes MCP Server on port ${port}...`);
if (VERBOSE) {
  log.debug("Environment:", {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: port,
    VERBOSE: VERBOSE
  });
}

const server = new MCPServer();

// Override console methods to add timestamps and levels
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = (...args) => {
  const timestamp = new Date().toISOString();
  originalLog(`[${timestamp}]`, ...args);
};

console.error = (...args) => {
  const timestamp = new Date().toISOString();
  originalError(`[${timestamp}] ❌`, ...args);
};

console.warn = (...args) => {
  const timestamp = new Date().toISOString();
  originalWarn(`[${timestamp}] ⚠️ `, ...args);
};

// Note: Tool execution logging is handled within individual tools
// The MCP framework doesn't expose direct access to tools property

server.start().then(() => {
  log.info(`Server started successfully on port ${port}`);
  
  if (VERBOSE) {
    const tools = [
      "analyze_task",
      "code_locator_expert", 
      "consult_software_engineer", 
      "consult_designer",
      "consult_manager",
      "consult_performance_expert",
      "consult_security_expert",
      "consult_devops_expert",
      "consult_edge_cases_expert",
      "synthesize_experts"
    ];
    
    log.debug(`Available tools: ${tools.length}`);
    tools.forEach(tool => {
      log.debug(`  - ${tool}`);
    });
  }
  
  log.info("Ready to accept connections");
  
}).catch((error) => {
  log.error("❌ Failed to start server", error);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  log.info("Shutting down...");
  server.stop().then(() => {
    log.info("Server stopped");
    process.exit(0);
  }).catch((error) => {
    log.error("Error during shutdown", error);
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  log.info("Shutting down...");
  server.stop().then(() => {
    log.info("Server stopped");
    process.exit(0);
  }).catch((error) => {
    log.error("Error during shutdown", error);
    process.exit(1);
  });
});