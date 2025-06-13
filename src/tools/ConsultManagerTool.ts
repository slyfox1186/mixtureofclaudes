import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface ConsultManagerInput {
  userQuery: string;
  context?: string;
  timeline?: string;
}

interface ExpertResponse {
  priority: "HIGH" | "MEDIUM" | "LOW";
  confidence: "HIGH" | "MEDIUM" | "LOW";
  coreInsight: string;
  immediateActions: string[];
  risks: string[];
  questions: string[];
}

class ConsultManagerTool extends MCPTool<ConsultManagerInput> {
  name = "consult_manager";
  description = "Consult with a project management expert for planning, prioritization, and resource allocation guidance";

  schema = {
    userQuery: {
      type: z.string(),
      description: "The user's original query or problem",
    },
    context: {
      type: z.string().optional(),
      description: "Additional context about project constraints or requirements",
    },
    timeline: {
      type: z.string().optional(),
      description: "Timeline constraints or deadlines",
    },
  };

  async execute(input: ConsultManagerInput): Promise<ExpertResponse> {
    const query = input.userQuery.toLowerCase();
    
    // Project management focus only - no technical implementation
    const type = query.match(/urgent|deadline|asap|rush/) ? 'urgent' :
                 query.match(/plan|roadmap|strategy|timeline/) ? 'planning' :
                 query.match(/team|resource|people|capacity/) ? 'resources' :
                 query.match(/priority|important|first|order/) ? 'prioritization' : 'general';
    
    const responses = {
      urgent: {
        priority: "HIGH" as const,
        confidence: "HIGH" as const,
        coreInsight: "Deliver MVP first, defer non-critical features, manage stakeholder expectations",
        immediateActions: ["Define MVP scope", "Set up daily standups", "Identify blockers", "Communicate timeline risks"],
        risks: ["Quality compromised under pressure", "Team burnout", "Technical debt accumulation"]
      },
      planning: {
        priority: "MEDIUM" as const,
        confidence: "HIGH" as const,
        coreInsight: "Break work into phases, map dependencies, build in buffer time",
        immediateActions: ["Create project roadmap", "Define milestones", "Map dependencies", "Estimate effort"],
        risks: ["Scope creep", "Unrealistic timelines", "Resource availability"]
      },
      resources: {
        priority: "HIGH" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "Assess team capacity, identify skill gaps, plan knowledge transfer",
        immediateActions: ["Audit team skills", "Balance workload", "Plan knowledge sharing", "Identify training needs"],
        risks: ["Key person dependencies", "Skill bottlenecks", "Team capacity limits"]
      },
      prioritization: {
        priority: "MEDIUM" as const,
        confidence: "HIGH" as const,
        coreInsight: "Prioritize by business value, user impact, and technical dependencies",
        immediateActions: ["Score features by value", "Map technical dependencies", "Estimate effort", "Create priority matrix"],
        risks: ["Stakeholder disagreement", "Priority conflicts", "Changing requirements"]
      },
      general: {
        priority: "MEDIUM" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "Establish clear communication, regular checkpoints, and risk monitoring",
        immediateActions: ["Set up regular meetings", "Define success criteria", "Create risk register", "Plan communication"],
        risks: ["Poor communication", "Unclear expectations", "Missed dependencies"]
      }
    };

    const response = responses[type];
    
    return {
      priority: response.priority,
      confidence: response.confidence,
      coreInsight: response.coreInsight,
      immediateActions: response.immediateActions,
      risks: response.risks,
      questions: input.timeline ? ["Is this timeline realistic?"] : ["What's the deadline?", "Who are the key stakeholders?"]
    };
  }
}

export default ConsultManagerTool;