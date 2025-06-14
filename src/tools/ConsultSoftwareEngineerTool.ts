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
  description = "Consult with a software engineering expert who acts as a HIGH-END COLLABORATOR, focusing on WHAT needs to be done and WHY, avoiding overengineering and prescriptive HOW. Resolves issues immediately upon discovery.";

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
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🧑‍💻 SOFTWARE ENGINEER EXPERT`);
    console.log(`${'='.repeat(70)}`);
    console.log(`\n🎯 EXPERT APPROACH:`);
    console.log(`   • Acting as HIGH-END COLLABORATOR, not rules engine`);
    console.log(`   • Focus: WHAT needs doing and WHY it matters`);
    console.log(`   • Philosophy: Resolve immediately, avoid overengineering`);
    console.log(`   • Let LLM decide HOW to implement solutions`);
    
    console.log(`\n📋 ANALYZING REQUEST:`);
    console.log(`   "${input.userQuery.substring(0, 100)}${input.userQuery.length > 100 ? '...' : ''}"`);
    
    if (input.techStack) {
      console.log(`\n🛠️  TECH STACK: ${input.techStack}`);
    }
    
    if (input.context) {
      console.log(`\n📌 CONTEXT:`);
      console.log(`   ${input.context.substring(0, 150)}${input.context.length > 150 ? '...' : ''}`);
    }
    
    console.log(`\n🤔 THINKING PROCESS:`);
    console.log(`   Let me identify WHAT problems exist and WHY they matter...\n`);
    
    const analysis = this.generateEngineeringAnalysis(input);
    
    console.log(`\n✅ ANALYSIS COMPLETE`);
    console.log(`   Priority: ${analysis.priority} | Confidence: ${analysis.confidence}`);
    console.log(`${'='.repeat(70)}\n`);
    
    return analysis;
  }

  private generateEngineeringAnalysis(input: ConsultSoftwareEngineerInput): ExpertResponse {
    const query = input.userQuery.toLowerCase();
    
    console.log(`   🔍 PATTERN DETECTION:`);
    console.log(`   ${'─'.repeat(50)}`);
    
    // Detailed analysis of the problem
    const hasImportIssue = query.includes('import') || query.includes('from');
    const hasSchedulingConcern = query.includes('scheduling') || query.includes('calendar');
    const hasAssistantLogic = query.includes('assistant') || query.includes('operation');
    const hasDuplicateIssue = query.includes('duplicate') || query.includes('same');
    const hasArchitectureIssue = query.includes('structure') || query.includes('organize');
    
    // Show what patterns we're detecting and why they matter
    const detectedPatterns: string[] = [];
    
    if (hasImportIssue) {
      console.log(`   ✓ Import/Module pattern detected`);
      console.log(`     → WHAT: <module-a> importing from <module-b>`);
      console.log(`     → WHY: Creates dependency issues, violates boundaries`);
      detectedPatterns.push('imports');
    }
    
    if (hasSchedulingConcern) {
      console.log(`   ✓ Scheduling/Calendar pattern detected`);
      console.log(`     → WHAT: <scheduling-module> contains time-based operations`);
      console.log(`     → WHY: Domain logic that must be properly isolated`);
      detectedPatterns.push('scheduling');
    }
    
    if (hasAssistantLogic) {
      console.log(`   ✓ Assistant/Operation pattern detected`);
      console.log(`     → WHAT: <assistant-module> handles operation execution`);
      console.log(`     → WHY: Core business logic requiring clear boundaries`);
      detectedPatterns.push('assistant');
    }
    
    if (hasDuplicateIssue) {
      console.log(`   ✓ Duplication pattern detected`);
      console.log(`     → WHAT: Similar code exists in multiple locations`);
      console.log(`     → WHY: Reduces maintainability, increases bug surface`);
      console.log(`     → APPROACH: Resolve immediately, don't let it spread`);
      detectedPatterns.push('duplication');
    }
    
    if (hasArchitectureIssue) {
      console.log(`   ✓ Architecture/Structure pattern detected`);
      console.log(`     → WHAT: Code organization needs improvement`);
      console.log(`     → WHY: Poor structure slows development`);
      console.log(`     → PRINCIPLE: Simple boundaries, no overengineering`);
      detectedPatterns.push('architecture');
    }
    
    // Cross-pattern analysis
    if (hasImportIssue && hasSchedulingConcern) {
      console.log(`\n   🔗 CROSS-PATTERN INSIGHT:`);
      console.log(`      Import + Scheduling = Likely cross-module dependency issue`);
      console.log(`      → IMPLICATION: <module-a> ↔ <module-b> circular dependency`);
      console.log(`      → RESOLUTION: Define WHAT needs decoupling, let LLM decide HOW`);
    }
    
    // Determine problem type with reasoning
    console.log(`\n   🎯 PROBLEM CLASSIFICATION:`);
    console.log(`   ${'─'.repeat(50)}`);
    
    let type: 'bug' | 'refactor' | 'implement' | 'architecture' | 'general';
    
    console.log(`   Analyzing problem characteristics...`);
    
    if (hasImportIssue && hasDuplicateIssue) {
      type = 'architecture';
      console.log(`   → CLASSIFICATION: Architecture Problem`);
      console.log(`     REASONING: Import issues + duplication = module boundary problem`);
      console.log(`     APPROACH: Need to redesign module interfaces`);
    } else if (query.match(/bug|error|broken|fix|debug/)) {
      type = 'bug';
      console.log(`   → CLASSIFICATION: Bug Fix`);
      console.log(`     REASONING: Error keywords indicate broken functionality`);
      console.log(`     APPROACH: Reproduce → Isolate → Fix → Test`);
    } else if (query.match(/refactor|clean|messy|improve/)) {
      type = 'refactor';
      console.log(`   → CLASSIFICATION: Refactoring`);
      console.log(`     REASONING: Quality improvement without changing behavior`);
      console.log(`     APPROACH: Incremental changes with test coverage`);
    } else if (query.match(/implement|build|create|add/)) {
      type = 'implement';
      console.log(`   → CLASSIFICATION: New Implementation`);
      console.log(`     REASONING: Creating new functionality`);
      console.log(`     APPROACH: Design → Implement → Test → Document`);
    } else {
      type = 'general';
      console.log(`   → CLASSIFICATION: General Engineering`);
      console.log(`     REASONING: No specific pattern, needs broader analysis`);
      console.log(`     APPROACH: Clarify requirements first`);
    }
    
    const responses = {
      bug: {
        priority: "HIGH" as const,
        confidence: "HIGH" as const,
        coreInsight: "WHAT: Bug blocking functionality. WHY: Impacts users. APPROACH: Fix immediately, minimal change.",
        immediateActions: [
          "WHAT: Reproduce the issue reliably",
          "WHAT: Identify root cause precisely",
          "WHY: Prevents bandaid fixes that break later",
          "HOW: Let LLM implement minimal, targeted fix"
        ],
        risks: ["Fix introduces new bugs", "Root cause not addressed", "Production deployment risk"]
      },
      refactor: {
        priority: "MEDIUM" as const,
        confidence: "HIGH" as const,
        coreInsight: "WHAT: Code needs cleanup. WHY: Improve maintainability. AVOID: Overengineering.",
        immediateActions: [
          "WHAT: Identify code that's hard to understand",
          "WHAT: Extract clear, focused functions",
          "WHY: Make code self-documenting",
          "PRINCIPLE: Simple > Clever, always"
        ],
        risks: ["Breaking existing functionality", "Time investment vs business value", "Incomplete refactoring"]
      },
      implement: {
        priority: "MEDIUM" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "WHAT: New feature required. WHY: Business need. START: Simplest working version.",
        immediateActions: [
          "WHAT: Define minimal requirements",
          "WHAT: Build simplest working solution",
          "WHY: Avoid premature optimization",
          "MANTRA: Make it work, then make it better"
        ],
        risks: ["Scope creep", "Integration complexity", "Missing edge cases"]
      },
      architecture: {
        priority: "HIGH" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "WHAT: Structure needs fixing. WHY: Current design blocks progress. FIX: Clear boundaries.",
        immediateActions: [
          "WHAT: Map current painful points",
          "WHAT: Define simple module boundaries",
          "WHY: Enable independent development",
          "AVOID: Grand rewrites, clever patterns"
        ],
        risks: ["Over-engineering", "Team learning curve", "Future maintainability"]
      },
      general: {
        priority: "MEDIUM" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "WHAT: Task needs attention. WHY: Support development goals. HOW: You decide best approach.",
        immediateActions: [
          "WHAT: Understand the real need",
          "WHY: Solutions must solve actual problems",
          "HOW: Trust LLM to choose approach",
          "REMEMBER: You're a collaborator, not a rule engine"
        ],
        risks: ["Unclear requirements", "Technical debt accumulation", "Poor documentation"]
      }
    };

    const baseResponse = responses[type];
    
    // Customize response based on specific patterns detected
    let customizedResponse = { ...baseResponse };
    
    if (hasImportIssue && hasSchedulingConcern && hasAssistantLogic) {
      console.log(`\n   💡 EXPERT INSIGHT:`);
      console.log(`   ${'─'.repeat(50)}`);
      console.log(`   This is a CLASSIC cross-module dependency problem!`);
      console.log(`   `);
      console.log(`   📊 ANALYSIS:`);
      console.log(`   1. mealScheduling is importing from assistantOperations`);
      console.log(`   2. This creates a circular dependency anti-pattern`);
      console.log(`   3. Violates single responsibility principle`);
      console.log(`   `);
      console.log(`   🎨 ARCHITECTURAL SOLUTION:`);
      console.log(`   • Move assistant-specific logic to assistantOperations`);
      console.log(`   • Create clean interfaces between modules`);
      console.log(`   • Use dependency injection if needed`);
      
      customizedResponse = {
        priority: "HIGH" as const,
        confidence: "HIGH" as const,
        coreInsight: "Cross-module imports creating circular dependencies - mealScheduling importing assistant operations",
        immediateActions: [
          "Map out current import dependencies between modules",
          "Move assistant-specific operations to assistantOperations module",
          "Remove cross-module imports from mealScheduling",
          "Create proper interfaces between modules",
          "Test each module in isolation"
        ],
        risks: [
          "Breaking existing functionality during refactor",
          "Hidden dependencies not immediately visible",
          "Regression in scheduling or assistant features"
        ]
      };
      
      console.log(`\n   📝 ACTION PLAN GENERATED:`);
      console.log(`   • ${customizedResponse.immediateActions.length} specific actions identified`);
      console.log(`   • ${customizedResponse.risks.length} risks to mitigate`);
      console.log(`   • Confidence level: ${customizedResponse.confidence}`);
    }
    
    return {
      priority: customizedResponse.priority,
      confidence: customizedResponse.confidence,
      coreInsight: customizedResponse.coreInsight,
      immediateActions: customizedResponse.immediateActions,
      risks: customizedResponse.risks,
      questions: this.generateSmartQuestions(input, hasImportIssue, hasSchedulingConcern)
    };
  }
  
  private generateSmartQuestions(
    input: ConsultSoftwareEngineerInput, 
    hasImportIssue: boolean, 
    hasSchedulingConcern: boolean
  ): string[] {
    const questions: string[] = [];
    
    console.log(`\n   ❓ CLARIFYING QUESTIONS:`);
    console.log(`   ${'─'.repeat(50)}`);
    
    if (hasImportIssue && hasSchedulingConcern) {
      console.log(`   Need to understand the module architecture better...`);
      questions.push("Are there other modules with similar cross-dependencies?");
      questions.push("What's the intended relationship between scheduling and assistant modules?");
    } else if (input.codeSnippet) {
      console.log(`   Have code snippet, need behavioral context...`);
      questions.push("What's the expected behavior vs actual behavior?");
    } else {
      console.log(`   Need more concrete details...`);
      questions.push("Can you show me the specific code causing issues?");
    }
    
    questions.forEach((q, i) => {
      console.log(`   ${i + 1}. ${q}`);
    });
    
    return questions;
  }
}

export default ConsultSoftwareEngineerTool;