import { MCPServer } from "mcp-framework";

const port = process.env.PORT || 9955;
const server = new MCPServer();

console.log(`🚀 Mixture of Claudes MCP Server starting on port ${port}...`);

server.start().then(() => {
  console.log(`✅ Mixture of Claudes MCP Server running on port ${port}`);
  console.log("📋 Available expert tools:");
  console.log("  - analyze_task");
  console.log("  - consult_software_engineer"); 
  console.log("  - consult_designer");
  console.log("  - consult_manager");
  console.log("  - consult_performance_expert");
  console.log("  - consult_security_expert");
  console.log("  - consult_devops_expert");
  console.log("  - consult_edge_cases_expert");
  console.log("  - synthesize_experts");
}).catch((error) => {
  console.error("❌ Failed to start server:", error);
});