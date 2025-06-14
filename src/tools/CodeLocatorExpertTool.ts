import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface CodeLocatorInput {
  userQuery: string;
  keywords?: string[];
  fileExtensions?: string[];
  searchType?: string;
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
  description = "Strategic code location analysis. Maps dependencies, identifies patterns, and locates relevant implementations across codebases. Especially valuable for large-scale refactoring, legacy system analysis, or scenarios where multiple interconnected modules require comprehensive mapping.";

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
      type: z.string().optional(),
      description: "Type of code construct to search for (e.g., function, class, component, service, config, or any specific pattern)",
    },
  };

  async execute(input: CodeLocatorInput): Promise<CodeLocatorResponse> {
    const startTime = Date.now();
    console.log(`\n[CodeLocator] Starting code search...`);
    
    try {
      const analysis = this.analyzeSearchRequirements(input);
      const duration = Date.now() - startTime;
      
      console.log(`[CodeLocator] Search complete (${duration}ms) - Found ${analysis.locations.length} locations`);
      
      return analysis;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[CodeLocator] Search failed after ${duration}ms:`, error);
      throw error;
    }
  }

  private analyzeSearchRequirements(input: CodeLocatorInput): CodeLocatorResponse {
    const query = input.userQuery.toLowerCase();
    
    // Extract key terms and patterns from the query
    const searchTerms = this.extractSearchTerms(query);
    
    if (searchTerms.length > 0) {
      console.log(`  → Extracted ${searchTerms.length} search terms: ${searchTerms.slice(0, 3).join(', ')}...`);
    }
    
    const searchStrategy = this.determineSearchStrategy(query, input.searchType);
    console.log(`  → Strategy: ${searchStrategy}`);
    
    // Generate strategic search recommendations
    const locations = this.generateSearchLocations(query, searchTerms, searchStrategy);
    
    if (locations.length > 0) {
      console.log(`  → Top location: ${locations[0].filePath} (${locations[0].confidence} confidence)`);
    }
    
    const recommendations = this.generateSearchRecommendations(query, searchTerms);
    const nextSteps = this.generateNextSteps(query, searchStrategy);
    
    return {
      locations,
      searchStrategy,
      recommendations,
      nextSteps
    };
  }

  private extractSearchTerms(query: string): string[] {
    const terms: string[] = [];
    
    // Import/module analysis
    if (query.includes("import") || query.includes("from")) {
      terms.push("import", "from", "export", "module.exports", "require");
      
      if (query.includes("mealscheduling")) {
        terms.push("mealScheduling", "meal", "scheduling");
      }
      
      if (query.includes("assistant")) {
        terms.push("assistantOperations", "assistant", "operations");
      }
    }
    
    // Database/sorting related terms
    if (query.includes("sort") || query.includes("order")) {
      terms.push("sort", "order", "ORDER BY", "ASC", "DESC", "orderBy");
    }
    
    // Contact/user data terms
    if (query.includes("contact") || query.includes("name") || query.includes("display")) {
      terms.push("contact", "name", "display_name", "first_name", "last_name");
    }
    
    // Cross-module dependency detection
    if (query.includes("duplicate") || query.includes("same") || query.includes("intelligent")) {
      terms.push("executeCalendarOperation", "executePlacesOperation", "intelligent*handler");
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
    
    // For import/module organization issues
    if (searchTerms.includes("import") || searchTerms.includes("mealScheduling")) {
      locations.push({
        filePath: "src/backend/lib/assistantOperations/",
        codeSnippet: "grep -r 'from.*mealScheduling' .",
        confidence: "HIGH",
        relevance: "Find cross-module imports from mealScheduling"
      });
      
      locations.push({
        filePath: "src/backend/lib/assistantOperations/mealSchedulingAssistant.ts",
        codeSnippet: "Look for imports at top of file",
        confidence: "HIGH",
        relevance: "Main file with problematic imports"
      });
      
      locations.push({
        filePath: "src/backend/services/assistantManagerService.ts",
        codeSnippet: "Check how operations are imported and used",
        confidence: "HIGH",
        relevance: "Service layer using these operations"
      });
    }
    
    // For duplicate handler issues
    if (searchTerms.includes("executeCalendarOperation") || searchTerms.includes("intelligent*handler")) {
      locations.push({
        filePath: "**/*Handler.ts",
        codeSnippet: "grep -r 'intelligentHandler' --include='*.ts'",
        confidence: "HIGH",
        relevance: "Find all intelligent handler implementations"
      });
      
      locations.push({
        filePath: "src/backend/",
        codeSnippet: "grep -r 'executeCalendarOperation\\|executePlacesOperation' .",
        confidence: "HIGH",
        relevance: "Find duplicate operation executions"
      });
    }
    
    // For database/sorting issues
    if (strategy.includes("sorting")) {
      locations.push({
        filePath: "src/backend/services/",
        codeSnippet: "Search for ORDER BY clauses and sorting logic",
        confidence: "HIGH",
        relevance: "Database sorting implementation"
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