import { MCPTool } from "mcp-framework";
import { z } from "zod";
import CodeLocatorExpertTool from "./CodeLocatorExpertTool";

interface SynthesizeInput {
  expertResponses: string;
  userQuery: string;
  includeCodeLocation?: boolean;
}

interface CodeLocation {
  filePath: string;
  lineNumber?: number;
  codeSnippet: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  relevance: string;
}

interface ExpertResponse {
  priority?: string;
  coreInsight?: string;
  immediateActions?: string[];
  risks?: string[];
  confidence?: string;
}

interface SynthesizedResponse {
  overallPriority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  conflictResolution: string;
  unifiedPlan: string[];
  criticalRisks: string[];
  nextSteps: string[];
  successCriteria: string[];
  codeLocations?: CodeLocation[];
}

class SynthesizeExpertsTool extends MCPTool<SynthesizeInput> {
  name = "synthesize_experts";
  description = "Combine expert responses into unified, actionable plan with conflict resolution";

  schema = {
    expertResponses: {
      type: z.string(),
      description: "JSON string containing all expert consultation responses",
    },
    userQuery: {
      type: z.string(),
      description: "Original user query for context",
    },
    includeCodeLocation: {
      type: z.boolean().optional(),
      description: "Whether to include code location analysis using CodeLocatorExpert",
    },
  };

  async execute(input: SynthesizeInput): Promise<SynthesizedResponse> {
    try {
      const expertData = JSON.parse(input.expertResponses);
      const query = input.userQuery.toLowerCase();
      
      // Handle both array format and object format
      let experts: ExpertResponse[];
      if (Array.isArray(expertData)) {
        experts = expertData as ExpertResponse[];
      } else {
        // Convert object format to array
        experts = Object.values(expertData) as ExpertResponse[];
      }
      
      // Determine overall priority from expert inputs
      const priorities = experts.map((e: ExpertResponse) => e.priority || "MEDIUM");
      const hasHigh = priorities.includes("HIGH");
      const hasCritical = priorities.length >= 3 && hasHigh;
      
      const overallPriority = hasCritical ? "CRITICAL" as const :
                             hasHigh ? "HIGH" as const :
                             priorities.includes("MEDIUM") ? "MEDIUM" as const : "LOW" as const;

      // Extract key insights and actions
      const coreInsights = experts.map((e: ExpertResponse) => e.coreInsight).filter(Boolean);
      const allActions = experts.flatMap((e: ExpertResponse) => e.immediateActions || []);
      const allRisks = experts.flatMap((e: ExpertResponse) => e.risks || []);
      
      // Resolve conflicts and create unified plan
      const conflictResolution = this.resolveConflicts(experts);
      const unifiedPlan = this.createUnifiedPlan(allActions, coreInsights);
      const criticalRisks = this.prioritizeRisks(allRisks);
      
      // Generate success criteria
      const successCriteria = this.generateSuccessCriteria(query, experts);
      
      // Optionally include code location analysis
      let codeLocations: CodeLocation[] | undefined;
      if (input.includeCodeLocation) {
        const codeLocator = new CodeLocatorExpertTool();
        const locationResult = await codeLocator.execute({ userQuery: input.userQuery });
        codeLocations = locationResult.locations;
      }
      
      return {
        overallPriority,
        conflictResolution,
        unifiedPlan,
        criticalRisks: criticalRisks.slice(0, 3), // Top 3 risks
        nextSteps: unifiedPlan.slice(0, 5), // Top 5 actions
        successCriteria,
        codeLocations
      };
      
    } catch (error) {
      // Enhanced fallback with error details
      return {
        overallPriority: "MEDIUM",
        conflictResolution: `Parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        unifiedPlan: ["Clarify requirements", "Implement step by step", "Test thoroughly"],
        criticalRisks: ["Unclear requirements", "Implementation complexity"],
        nextSteps: ["Review expert feedback", "Create implementation plan"],
        successCriteria: ["Requirements met", "No regressions", "Stakeholder approval"]
      };
    }
  }

  private resolveConflicts(experts: ExpertResponse[]): string {
    const priorities = experts.map(e => e.priority);
    const highPriorityCount = priorities.filter(p => p === "HIGH").length;
    
    if (highPriorityCount >= 2) {
      return "Multiple high-priority concerns identified - address security and performance first";
    } else if (experts.length >= 3) {
      return "Multi-expert consensus needed - prioritize by business impact and technical risk";
    } else {
      return "Expert opinions aligned - proceed with recommended approach";
    }
  }

  private createUnifiedPlan(actions: string[], insights: string[]): string[] {
    // Deduplicate and prioritize actions
    const uniqueActions = [...new Set(actions)];
    
    // Prioritize common action patterns
    const prioritized = uniqueActions.sort((a, b) => {
      const aScore = this.getActionPriority(a);
      const bScore = this.getActionPriority(b);
      return bScore - aScore;
    });
    
    return prioritized.slice(0, 6); // Top 6 actions
  }

  private getActionPriority(action: string): number {
    const actionLower = action.toLowerCase();
    
    // High priority patterns
    if (actionLower.match(/security|vulnerability|fix|patch/)) return 10;
    if (actionLower.match(/test|validation|verify/)) return 9;
    if (actionLower.match(/backup|monitor|log/)) return 8;
    if (actionLower.match(/implement|create|build/)) return 7;
    if (actionLower.match(/optimize|improve|enhance/)) return 6;
    if (actionLower.match(/document|plan|design/)) return 5;
    
    return 1; // Default priority
  }

  private prioritizeRisks(risks: string[]): string[] {
    const uniqueRisks = [...new Set(risks)];
    
    return uniqueRisks.sort((a, b) => {
      const aScore = this.getRiskScore(a);
      const bScore = this.getRiskScore(b);
      return bScore - aScore;
    });
  }

  private getRiskScore(risk: string): number {
    const riskLower = risk.toLowerCase();
    
    // Critical risks
    if (riskLower.match(/security|breach|vulnerability|attack/)) return 10;
    if (riskLower.match(/data loss|corruption|crash/)) return 9;
    if (riskLower.match(/production|downtime|failure/)) return 8;
    if (riskLower.match(/performance|slow|timeout/)) return 7;
    if (riskLower.match(/user|experience|usability/)) return 6;
    if (riskLower.match(/compliance|legal|regulation/)) return 8;
    
    return 1; // Default risk score
  }

  private generateSuccessCriteria(query: string, experts: ExpertResponse[]): string[] {
    const criteria = ["Implementation completed successfully"];
    
    // Add specific criteria based on query type
    if (query.match(/performance|slow|speed/)) {
      criteria.push("Performance targets met", "No performance regressions");
    }
    if (query.match(/security|auth|login/)) {
      criteria.push("Security vulnerabilities addressed", "Compliance requirements met");
    }
    if (query.match(/user|interface|design/)) {
      criteria.push("User experience improved", "Accessibility requirements met");
    }
    if (query.match(/bug|error|fix/)) {
      criteria.push("Bug resolved", "No new issues introduced");
    }
    
    criteria.push("All tests passing", "Documentation updated");
    
    return criteria.slice(0, 4); // Top 4 criteria
  }
}

export default SynthesizeExpertsTool;