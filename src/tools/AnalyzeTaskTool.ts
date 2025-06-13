import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface AnalyzeTaskInput {
  userQuery: string;
}

interface TaskAnalysis {
  selectedExperts: string[];
  complexity: "LOW" | "MEDIUM" | "HIGH";
  contextEfficiency: "OPTIMAL" | "MODERATE" | "HEAVY";
}

class AnalyzeTaskTool extends MCPTool<AnalyzeTaskInput> {
  name = "analyze_task";
  description = "Select minimal, non-overlapping expert set for maximum LLM effectiveness";

  schema = {
    userQuery: {
      type: z.string(),
      description: "User query to analyze for expert selection",
    },
  };

  async execute(input: AnalyzeTaskInput): Promise<TaskAnalysis> {
    const query = input.userQuery.toLowerCase();
    const experts: Set<string> = new Set();

    // PRECISION EXPERT SELECTION (max 3 experts, no overlap)
    
    // Technical: Code implementation only
    if (query.match(/code|function|class|variable|algorithm|bug|implement|refactor|debug|syntax/)) {
      experts.add("consult_software_engineer");
    }

    // Performance: Speed/optimization only  
    if (query.match(/slow|fast|optimize|performance|speed|lag|bottleneck|memory|cpu|cache/)) {
      experts.add("consult_performance_expert");
    }

    // Security: Vulnerabilities only
    if (query.match(/auth|login|password|vulnerability|secure|hack|encrypt|csrf|xss|sql|token/)) {
      experts.add("consult_security_expert");
    }

    // UX: User experience only
    if (query.match(/user|interface|design|layout|usability|experience|ui|ux|accessibility|looks/)) {
      experts.add("consult_designer");
    }

    // DevOps: Infrastructure only
    if (query.match(/deploy|infrastructure|server|scaling|monitoring|devops|ci|cd|docker|kubernetes/)) {
      experts.add("consult_devops_expert");
    }

    // Risk: Edge cases only (when complex or 2+ experts)
    if (experts.size >= 2 || query.match(/failure|edge case|problem|issue|concern|risk|crash|break/)) {
      experts.add("consult_edge_cases_expert");
    }

    const selectedExperts = Array.from(experts);

    // Default fallback
    if (selectedExperts.length === 0) {
      selectedExperts.push("consult_software_engineer");
    }

    // Limit to 3 experts max for context efficiency
    if (selectedExperts.length > 3) {
      selectedExperts.splice(3);
    }

    return {
      selectedExperts,
      complexity: selectedExperts.length === 1 ? "LOW" : 
                  selectedExperts.length === 2 ? "MEDIUM" : "HIGH",
      contextEfficiency: selectedExperts.length <= 2 ? "OPTIMAL" : 
                        selectedExperts.length === 3 ? "MODERATE" : "HEAVY"
    };
  }
}

export default AnalyzeTaskTool;