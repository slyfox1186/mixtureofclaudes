import { MCPTool } from "mcp-framework";
import { z } from "zod";
import CodeLocatorExpertTool from "./CodeLocatorExpertTool.js";

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
  description = "Expert consensus synthesis for complex technical decisions. Reconciles conflicting specialist recommendations, prioritizes by technical risk and business impact. Most valuable when dealing with multi-faceted problems where domain expertise spans security, performance, architecture, and operational concerns.";

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
    const startTime = Date.now();
    console.log(`\n[Synthesizer] Starting expert synthesis...`);
    console.log(`  → Acting as: Executive Assistant (strategic synthesis)`);
    console.log(`  → Focus: WHAT needs doing and WHY it matters`);
    console.log(`  → Philosophy: Trust LLM to determine HOW`);
    
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
      
      console.log(`  → Processing ${experts.length} expert responses`);
      
      // Determine overall priority from expert inputs
      const priorities = experts.map((e: ExpertResponse) => e.priority || "MEDIUM");
      const hasHigh = priorities.includes("HIGH");
      const hasCritical = priorities.length >= 3 && hasHigh;
      
      const overallPriority = hasCritical ? "CRITICAL" as const :
                             hasHigh ? "HIGH" as const :
                             priorities.includes("MEDIUM") ? "MEDIUM" as const : "LOW" as const;

      // Extract key insights and actions
      const coreInsights = experts.map((e: ExpertResponse) => e.coreInsight).filter((insight): insight is string => Boolean(insight));
      const allActions = experts.flatMap((e: ExpertResponse) => e.immediateActions || []);
      const allRisks = experts.flatMap((e: ExpertResponse) => e.risks || []);
      
      // Resolve conflicts and create unified plan
      const conflictResolution = this.resolveConflicts(experts);
      const unifiedPlan = this.createUnifiedPlan(allActions, coreInsights);
      const criticalRisks = this.prioritizeRisks(allRisks);
      
      console.log(`  → Priority: ${overallPriority} (${this.calculateConfidenceLevel(experts)} confidence)`);
      console.log(`  → Actions: ${allActions.length} | Risks: ${allRisks.length} | Insights: ${coreInsights.length}`);
      
      // Generate success criteria
      const successCriteria = this.generateSuccessCriteria(query, experts);
      
      // Optionally include code location analysis
      let codeLocations: CodeLocation[] | undefined;
      if (input.includeCodeLocation) {
        console.log(`  → Running CodeLocatorExpert...`);
        const codeLocator = new CodeLocatorExpertTool();
        const locationResult = await codeLocator.execute({ userQuery: input.userQuery });
        codeLocations = locationResult.locations;
      }
      
      const duration = Date.now() - startTime;
      const result = {
        overallPriority,
        conflictResolution,
        unifiedPlan,
        criticalRisks: criticalRisks.slice(0, 3), // Top 3 risks
        nextSteps: unifiedPlan.slice(0, 5), // Top 5 actions
        successCriteria,
        codeLocations
      };
      
      console.log(`[Synthesizer] Synthesis complete (${duration}ms)`);
      
      return result;
      
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
      return "WHAT: Multiple critical issues identified. WHY: Risk compounds. APPROACH: Address highest impact first, let LLM sequence implementation.";
    } else if (experts.length >= 3) {
      return "WHAT: Complex situation requiring synthesis. WHY: Multiple perspectives matter. APPROACH: Define clear goals, trust LLM execution.";
    } else {
      return "WHAT: Clear path forward. WHY: Expert consensus achieved. APPROACH: Execute recommendations, avoid overcomplication.";
    }
  }

  private createUnifiedPlan(actions: string[], insights: string[]): string[] {
    // Executive Assistant approach: Focus on WHAT and WHY, not HOW
    const uniqueActions = [...new Set(actions)];
    
    // Transform actions to executive-level directives
    const executiveActions = uniqueActions.map(action => {
      if (action.includes("WHAT:") || action.includes("WHY:")) {
        return action; // Already in correct format
      }
      // Transform prescriptive actions to strategic ones
      return this.transformToExecutiveAction(action);
    });
    
    // Prioritize by strategic impact
    const prioritized = executiveActions.sort((a, b) => {
      const aScore = this.getActionPriority(a);
      const bScore = this.getActionPriority(b);
      return bScore - aScore;
    });
    
    return prioritized.slice(0, 6); // Top 6 strategic actions
  }

  private getActionPriority(action: string): number {
    const actionLower = action.toLowerCase();
    
    // Executive priority: Impact and urgency over implementation details
    if (actionLower.includes("what:") && actionLower.match(/block|critical|immediate/)) return 10;
    if (actionLower.match(/security|vulnerability|risk/)) return 9;
    if (actionLower.includes("why:") && actionLower.match(/impact|consequence/)) return 8;
    if (actionLower.match(/resolve|fix|address/)) return 7;
    if (actionLower.match(/improve|enhance|optimize/)) return 6;
    if (actionLower.match(/plan|design|structure/)) return 5;
    
    return 1; // Default priority
  }
  
  private transformToExecutiveAction(action: string): string {
    const actionLower = action.toLowerCase();
    
    // Transform common prescriptive actions to strategic ones
    if (actionLower.includes("implement")) {
      return `WHAT: ${action}. WHY: Addresses identified need. HOW: LLM determines best approach.`;
    }
    if (actionLower.includes("create") || actionLower.includes("build")) {
      return `WHAT: ${action}. WHY: Required functionality. APPROACH: Start simple, iterate.`;
    }
    if (actionLower.includes("refactor") || actionLower.includes("clean")) {
      return `WHAT: ${action}. WHY: Improve maintainability. CAUTION: Avoid overengineering.`;
    }
    if (actionLower.includes("test") || actionLower.includes("verify")) {
      return `WHAT: ${action}. WHY: Ensure reliability. FOCUS: Critical paths first.`;
    }
    
    // Default transformation
    return `WHAT: ${action}. HOW: Trust LLM to implement effectively.`;
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
    // Executive success criteria: Focus on outcomes, not tasks
    const criteria = ["WHAT: Core objective achieved. MEASURE: User value delivered."];
    
    // Add outcome-based criteria
    if (query.match(/performance|slow|speed/)) {
      criteria.push("WHAT: Performance acceptable to users. WHY: User satisfaction matters most.");
    }
    if (query.match(/security|auth|login/)) {
      criteria.push("WHAT: System secure. WHY: User trust is paramount.");
    }
    if (query.match(/user|interface|design/)) {
      criteria.push("WHAT: Users can accomplish goals. WHY: Usability drives adoption.");
    }
    if (query.match(/bug|error|fix/)) {
      criteria.push("WHAT: Issue resolved. WHY: Restore functionality. HOW: LLM's discretion.");
    }
    
    criteria.push("All tests passing", "Documentation updated");
    
    return criteria.slice(0, 4); // Top 4 criteria
  }
  
  private calculateConfidenceLevel(experts: ExpertResponse[]): string {
    const confidences = experts.map(e => e.confidence).filter(Boolean);
    const highCount = confidences.filter(c => c === "HIGH").length;
    const totalCount = confidences.length;
    
    if (totalCount === 0) return "UNKNOWN";
    
    const ratio = highCount / totalCount;
    if (ratio >= 0.7) return "HIGH";
    if (ratio >= 0.4) return "MEDIUM";
    return "LOW";
  }
}

export default SynthesizeExpertsTool;