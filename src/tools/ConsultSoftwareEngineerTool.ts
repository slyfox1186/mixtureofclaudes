import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface ConsultSoftwareEngineerInput {
  userQuery: string;
  context?: string;
  codeSnippet?: string;
  techStack?: string;
}

interface ExpertResponse {
  priority: "HIGH" | "MEDIUM" | "LOW";
  confidence: "HIGH" | "MEDIUM" | "LOW";
  coreInsight: string;
  immediateActions: string[];
  risks: string[];
  questions: string[];
}

class ConsultSoftwareEngineerTool extends MCPTool<ConsultSoftwareEngineerInput> {
  name = "consult_software_engineer";
  description = "Consult with a software engineering expert for technical implementation, architecture, and performance guidance specifically for Claude Code development tasks";

  schema = {
    userQuery: {
      type: z.string(),
      description: "The user's original query or problem",
    },
    context: {
      type: z.string().optional(),
      description: "Additional context about the codebase, tech stack, or constraints",
    },
    codeSnippet: {
      type: z.string().optional(),
      description: "Relevant code snippet if applicable",
    },
    techStack: {
      type: z.string().optional(),
      description: "Technology stack being used (e.g., 'React, TypeScript, Node.js')",
    },
  };

  async execute(input: ConsultSoftwareEngineerInput): Promise<ExpertResponse> {
    const analysis = this.generateEngineeringAnalysis(input);
    return analysis;
  }

  private generateEngineeringAnalysis(input: ConsultSoftwareEngineerInput): ExpertResponse {
    const query = input.userQuery.toLowerCase();
    
    // Ultra-precise pattern matching for technical implementation only
    const type = query.match(/bug|error|broken|fix|debug/) ? 'bug' :
                 query.match(/refactor|clean|messy|improve/) ? 'refactor' :
                 query.match(/implement|build|create|add/) ? 'implement' :
                 query.match(/architect|design|structure/) ? 'architecture' : 'general';
    
    const responses = {
      bug: {
        priority: "HIGH" as const,
        confidence: "HIGH" as const,
        coreInsight: "Reproduce bug consistently, then implement minimal fix with tests",
        immediateActions: ["Create reproduction steps", "Add debug logging", "Write failing test", "Implement targeted fix"],
        risks: ["Fix introduces new bugs", "Root cause not addressed", "Production deployment risk"]
      },
      refactor: {
        priority: "MEDIUM" as const,
        confidence: "HIGH" as const,
        coreInsight: "Break down large functions, add types, increase test coverage incrementally",
        immediateActions: ["Identify largest functions", "Add TypeScript types", "Extract smaller functions", "Write unit tests"],
        risks: ["Breaking existing functionality", "Time investment vs business value", "Incomplete refactoring"]
      },
      implement: {
        priority: "MEDIUM" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "Design API contracts first, then implement with error handling and tests",
        immediateActions: ["Define API interface", "Plan data models", "Implement core logic", "Add error boundaries"],
        risks: ["Scope creep", "Integration complexity", "Missing edge cases"]
      },
      architecture: {
        priority: "HIGH" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "Follow established patterns, design for maintainability over cleverness",
        immediateActions: ["Choose architectural pattern", "Define module boundaries", "Plan data flow", "Document decisions"],
        risks: ["Over-engineering", "Team learning curve", "Future maintainability"]
      },
      general: {
        priority: "MEDIUM" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "Focus on code quality, maintainability, and comprehensive testing",
        immediateActions: ["Clarify requirements", "Choose tech approach", "Implement incrementally", "Add tests"],
        risks: ["Unclear requirements", "Technical debt accumulation", "Poor documentation"]
      }
    };

    const response = responses[type];
    
    return {
      priority: response.priority,
      confidence: response.confidence,
      coreInsight: response.coreInsight,
      immediateActions: response.immediateActions,
      risks: response.risks,
      questions: input.codeSnippet ? ["What specific code needs review?"] : ["What are the exact technical requirements?"]
    };
  }
}

export default ConsultSoftwareEngineerTool;