import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface ConsultEdgeCasesInput {
  userQuery: string;
  context?: string;
}

interface ExpertResponse {
  priority: "HIGH" | "MEDIUM" | "LOW";
  confidence: "HIGH" | "MEDIUM" | "LOW";
  coreInsight: string;
  immediateActions: string[];
  risks: string[];
  questions: string[];
}

class ConsultEdgeCasesExpertTool extends MCPTool<ConsultEdgeCasesInput> {
  name = "consult_edge_cases_expert";
  description = "Edge cases expert - identifies overlooked failure modes and boundary conditions";

  schema = {
    userQuery: {
      type: z.string(),
      description: "The user's original query or problem",
    },
    context: {
      type: z.string().optional(),
      description: "Additional context about the system or requirements",
    },
  };

  async execute(input: ConsultEdgeCasesInput): Promise<ExpertResponse> {
    const query = input.userQuery.toLowerCase();
    
    // Identify common oversight patterns
    const type = query.match(/performance|slow/) ? 'performance' :
                 query.match(/user|interface|ui/) ? 'user_interface' :
                 query.match(/data|database/) ? 'data' :
                 query.match(/security|auth/) ? 'security' :
                 query.match(/api|integration/) ? 'api' : 'general';
    
    const responses = {
      performance: {
        priority: "HIGH" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "Test under realistic load conditions, monitor for memory leaks and cascade failures",
        immediateActions: ["Load test with realistic data", "Monitor memory usage over time", "Add circuit breakers", "Test mobile performance"],
        risks: ["System crashes under peak load", "Memory exhaustion", "Cascade failures from timeouts"]
      },
      user_interface: {
        priority: "MEDIUM" as const,
        confidence: "HIGH" as const,
        coreInsight: "Test with assistive technologies, extremely long content, and degraded network conditions",
        immediateActions: ["Test with screen readers", "Handle long content gracefully", "Test keyboard navigation", "Add progressive enhancement"],
        risks: ["Legal compliance issues", "Layout breaks", "Inaccessible to disabled users"]
      },
      data: {
        priority: "HIGH" as const,
        confidence: "HIGH" as const,
        coreInsight: "Test concurrent operations, timezone edge cases, and special character handling",
        immediateActions: ["Test concurrent database writes", "Handle timezone conversions properly", "Test with Unicode characters", "Monitor connection pools"],
        risks: ["Data corruption", "Application crashes", "Character encoding issues"]
      },
      security: {
        priority: "HIGH" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "Test race conditions, error handling paths, and timing attack vectors",
        immediateActions: ["Test concurrent authentication", "Sanitize error messages", "Use constant-time operations", "Add rate limiting"],
        risks: ["Privilege escalation", "Information disclosure", "Session hijacking"]
      },
      api: {
        priority: "MEDIUM" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "Handle API failures gracefully with proper retry logic and fallback mechanisms",
        immediateActions: ["Implement exponential backoff", "Validate API responses", "Design idempotent operations", "Plan for API versioning"],
        risks: ["Service degradation", "Data inconsistency", "Lost events"]
      },
      general: {
        priority: "MEDIUM" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "Plan for deployment failures, configuration drift, and third-party dependencies",
        immediateActions: ["Implement safe deployment strategy", "Use infrastructure as code", "Monitor disk usage", "Add dependency circuit breakers"],
        risks: ["Deployment failures", "Environment inconsistencies", "System resource exhaustion"]
      }
    };

    const response = responses[type];
    
    return {
      priority: response.priority,
      confidence: response.confidence,
      coreInsight: response.coreInsight,
      immediateActions: response.immediateActions,
      risks: response.risks,
      questions: ["What happens when this fails at 3 AM?", "How does this behave with 10x expected load?", "What failure modes are we missing?"]
    };
  }
}

export default ConsultEdgeCasesExpertTool;