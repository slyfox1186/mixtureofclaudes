import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface ConsultPerformanceInput {
  userQuery: string;
  context?: string;
  currentMetrics?: string;
}

interface ExpertResponse {
  priority: "HIGH" | "MEDIUM" | "LOW";
  confidence: "HIGH" | "MEDIUM" | "LOW";
  coreInsight: string;
  immediateActions: string[];
  risks: string[];
  questions: string[];
}

class ConsultPerformanceExpertTool extends MCPTool<ConsultPerformanceInput> {
  name = "consult_performance_expert";
  description = "Performance optimization expert - speed, bottlenecks, and scalability only";

  schema = {
    userQuery: {
      type: z.string(),
      description: "The user's original query or problem",
    },
    context: {
      type: z.string().optional(),
      description: "Additional context about the system or current performance issues",
    },
    currentMetrics: {
      type: z.string().optional(),
      description: "Current performance metrics if available",
    },
  };

  async execute(input: ConsultPerformanceInput): Promise<ExpertResponse> {
    const query = input.userQuery.toLowerCase();
    
    // Performance optimization focus only - speed and bottlenecks
    const type = query.match(/slow|lag|speed|fast/) ? 'speed' :
                 query.match(/memory|cpu|resource/) ? 'resources' :
                 query.match(/database|query|db/) ? 'database' :
                 query.match(/cache|caching/) ? 'caching' : 'general';
    
    const responses = {
      speed: {
        priority: "HIGH" as const,
        confidence: "HIGH" as const,
        coreInsight: "Profile bottlenecks first, then optimize critical path with lazy loading and caching",
        immediateActions: ["Profile performance with dev tools", "Implement code splitting", "Add lazy loading", "Optimize bundle size"],
        risks: ["Premature optimization", "Breaking existing functionality", "Complexity increase"]
      },
      resources: {
        priority: "HIGH" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "Monitor memory/CPU usage patterns, fix leaks, optimize resource allocation",
        immediateActions: ["Add memory monitoring", "Profile CPU usage", "Fix memory leaks", "Optimize algorithms"],
        risks: ["System instability during optimization", "Monitoring overhead", "Resource constraints"]
      },
      database: {
        priority: "HIGH" as const,
        confidence: "HIGH" as const,
        coreInsight: "Add indexes for frequent queries, use connection pooling, implement caching",
        immediateActions: ["Analyze slow queries", "Add missing indexes", "Implement connection pooling", "Add query caching"],
        risks: ["Index overhead on writes", "Cache invalidation complexity", "Connection pool exhaustion"]
      },
      caching: {
        priority: "MEDIUM" as const,
        confidence: "HIGH" as const,
        coreInsight: "Cache expensive operations, use appropriate TTL, implement cache invalidation strategy",
        immediateActions: ["Identify cacheable operations", "Implement Redis caching", "Set appropriate TTL", "Add cache monitoring"],
        risks: ["Cache invalidation bugs", "Memory usage increase", "Stale data issues"]
      },
      general: {
        priority: "MEDIUM" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "Establish performance baselines, implement monitoring, create performance budgets",
        immediateActions: ["Set up performance monitoring", "Create performance baselines", "Implement load testing", "Define SLA targets"],
        risks: ["Monitoring overhead", "Performance budget constraints", "Tool complexity"]
      }
    };

    const response = responses[type];
    
    return {
      priority: response.priority,
      confidence: response.confidence,
      coreInsight: response.coreInsight,
      immediateActions: response.immediateActions,
      risks: response.risks,
      questions: input.currentMetrics ? ["What are acceptable performance targets?"] : ["Do you have current performance metrics?", "What's the performance goal?"]
    };
  }
}

export default ConsultPerformanceExpertTool;