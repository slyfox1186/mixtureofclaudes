import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface CodeLocatorInput {
  userQuery: string;
  keywords?: string[];
  fileExtensions?: string[];
  searchType?: "function" | "class" | "component" | "service" | "config" | "general";
}

interface CodeLocation {
  filePath: string;
  lineNumber?: number;
  codeSnippet: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  relevance: string;
}

interface CodeLocatorResponse {
  locations: CodeLocation[];
  searchStrategy: string;
  recommendations: string[];
  nextSteps: string[];
}

class CodeLocatorExpertTool extends MCPTool<CodeLocatorInput> {
  name = "code_locator_expert";
  description = "Expert tool that scans codebases to locate relevant code before other experts provide analysis";

  schema = {
    userQuery: {
      type: z.string(),
      description: "The user's query or problem to locate code for",
    },
    keywords: {
      type: z.array(z.string()).optional(),
      description: "Specific keywords to search for in the code",
    },
    fileExtensions: {
      type: z.array(z.string()).optional(),
      description: "File extensions to focus on (e.g., ['.ts', '.js', '.tsx'])",
    },
    searchType: {
      type: z.enum(["function", "class", "component", "service", "config", "general"]).optional(),
      description: "Type of code construct to search for",
    },
  };

  async execute(input: CodeLocatorInput): Promise<CodeLocatorResponse> {
    const analysis = this.analyzeSearchRequirements(input);
    return analysis;
  }

  private analyzeSearchRequirements(input: CodeLocatorInput): CodeLocatorResponse {
    const query = input.userQuery.toLowerCase();
    
    // Extract key terms and patterns from the query
    const searchTerms = this.extractSearchTerms(query);
    const searchStrategy = this.determineSearchStrategy(query, input.searchType);
    
    // Generate strategic search recommendations
    const locations = this.generateSearchLocations(query, searchTerms, searchStrategy);
    
    return {
      locations,
      searchStrategy,
      recommendations: this.generateSearchRecommendations(query, searchTerms),
      nextSteps: this.generateNextSteps(query, searchStrategy)
    };
  }

  private extractSearchTerms(query: string): string[] {
    const terms: string[] = [];
    
    // Database/sorting related terms
    if (query.includes("sort") || query.includes("order")) {
      terms.push("sort", "order", "ORDER BY", "ASC", "DESC", "orderBy");
    }
    
    // Database terms
    if (query.includes("database") || query.includes("query") || query.includes("sql")) {
      terms.push("query", "sql", "database", "db", "select", "where");
    }
    
    // Contact/user data terms
    if (query.includes("contact") || query.includes("name") || query.includes("display")) {
      terms.push("contact", "name", "display_name", "first_name", "last_name");
    }
    
    // API/service terms
    if (query.includes("api") || query.includes("service") || query.includes("endpoint")) {
      terms.push("api", "service", "endpoint", "controller", "route");
    }
    
    // Frontend terms
    if (query.includes("frontend") || query.includes("component") || query.includes("ui")) {
      terms.push("component", "tsx", "jsx", "react", "vue", "angular");
    }
    
    return terms;
  }

  private determineSearchStrategy(query: string, searchType?: string): string {
    if (searchType) return `Focused search for ${searchType} constructs`;
    
    if (query.includes("sort") || query.includes("order")) {
      return "Database query analysis - focus on sorting implementation";
    }
    
    if (query.includes("api") || query.includes("endpoint")) {
      return "API layer analysis - focus on service endpoints";
    }
    
    if (query.includes("component") || query.includes("ui")) {
      return "Frontend component analysis - focus on UI components";
    }
    
    return "General codebase analysis - broad search pattern";
  }

  private generateSearchLocations(query: string, searchTerms: string[], strategy: string): CodeLocation[] {
    const locations: CodeLocation[] = [];
    
    // For database/sorting issues
    if (strategy.includes("sorting")) {
      locations.push({
        filePath: "src/backend/services/",
        codeSnippet: "Search for ORDER BY clauses and sorting logic",
        confidence: "HIGH",
        relevance: "Database sorting implementation"
      });
      
      locations.push({
        filePath: "src/backend/types/",
        codeSnippet: "Look for interface definitions with sorting fields",
        confidence: "MEDIUM",
        relevance: "Data model definitions"
      });
      
      locations.push({
        filePath: "src/components/",
        codeSnippet: "Search for frontend sorting components",
        confidence: "MEDIUM",
        relevance: "UI sorting controls"
      });
    }
    
    // For API/service issues
    if (strategy.includes("API") || strategy.includes("service")) {
      locations.push({
        filePath: "src/api/",
        codeSnippet: "Search for API route definitions",
        confidence: "HIGH",
        relevance: "API endpoint implementations"
      });
      
      locations.push({
        filePath: "src/services/",
        codeSnippet: "Look for service layer implementations",
        confidence: "HIGH",
        relevance: "Business logic services"
      });
    }
    
    // For frontend/component issues
    if (strategy.includes("component") || strategy.includes("Frontend")) {
      locations.push({
        filePath: "src/components/",
        codeSnippet: "Search for React/Vue components",
        confidence: "HIGH",
        relevance: "UI component implementations"
      });
      
      locations.push({
        filePath: "src/pages/",
        codeSnippet: "Look for page-level components",
        confidence: "MEDIUM",
        relevance: "Page implementations"
      });
    }
    
    return locations;
  }

  private generateSearchRecommendations(query: string, searchTerms: string[]): string[] {
    const recommendations: string[] = [];
    
    // Always recommend starting with grep/search
    recommendations.push("Use grep/ripgrep to search for key terms: " + searchTerms.join(", "));
    
    // Database-specific recommendations
    if (searchTerms.includes("sort") || searchTerms.includes("order")) {
      recommendations.push("Search for 'ORDER BY' in SQL queries and database files");
      recommendations.push("Look for sorting parameters in API endpoints");
      recommendations.push("Check frontend components for sort controls");
    }
    
    // API-specific recommendations
    if (searchTerms.includes("api") || searchTerms.includes("service")) {
      recommendations.push("Examine API route definitions and handlers");
      recommendations.push("Check service layer for business logic");
      recommendations.push("Look for data transformation logic");
    }
    
    // General recommendations
    recommendations.push("Read complete files to understand context");
    recommendations.push("Trace data flow from frontend to backend");
    recommendations.push("Check for related test files");
    
    return recommendations;
  }

  private generateNextSteps(query: string, strategy: string): string[] {
    const steps: string[] = [];
    
    steps.push("Execute targeted searches using the recommended terms");
    steps.push("Read and analyze the most relevant files completely");
    steps.push("Trace the data flow and identify the specific issue");
    steps.push("Provide concrete, code-specific recommendations");
    
    if (strategy.includes("sorting")) {
      steps.push("Examine the exact ORDER BY clause causing issues");
      steps.push("Verify field names match database schema");
      steps.push("Check for proper SQL escaping and validation");
    }
    
    return steps;
  }
}

export default CodeLocatorExpertTool;