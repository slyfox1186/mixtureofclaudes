import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface ConsultDesignerInput {
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

class ConsultDesignerTool extends MCPTool<ConsultDesignerInput> {
  name = "consult_designer";
  description = "Consult with a UX/UI design expert for user experience, interface design, and accessibility guidance";

  schema = {
    userQuery: {
      type: z.string(),
      description: "The user's original query or problem",
    },
    context: {
      type: z.string().optional(),
      description: "Additional context about the application or design requirements",
    },
  };

  async execute(input: ConsultDesignerInput): Promise<ExpertResponse> {
    const query = input.userQuery.toLowerCase();
    
    // UX/UI focus only - no technical implementation
    const type = query.match(/ugly|looks|visual|design/) ? 'visual' :
                 query.match(/user.*complain|confusing|hard to use/) ? 'usability' :
                 query.match(/mobile|responsive|device/) ? 'responsive' :
                 query.match(/access|disability|screen reader/) ? 'accessibility' : 'general';
    
    const responses = {
      visual: {
        priority: "MEDIUM" as const,
        confidence: "HIGH" as const,
        coreInsight: "Improve visual hierarchy, contrast, and spacing for better user comprehension",
        immediateActions: ["Audit color contrast ratios", "Establish consistent spacing scale", "Create clear visual hierarchy", "Simplify UI elements"],
        risks: ["Visual changes confuse existing users", "Brand inconsistency", "Development complexity"]
      },
      usability: {
        priority: "HIGH" as const,
        confidence: "HIGH" as const,
        coreInsight: "Simplify user flows and reduce cognitive load for task completion",
        immediateActions: ["Map current user journey", "Identify friction points", "Simplify navigation", "Add clear progress indicators"],
        risks: ["User behavior change resistance", "Feature discoverability issues", "Learning curve for new design"]
      },
      responsive: {
        priority: "HIGH" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "Design mobile-first with touch-friendly interactions and flexible layouts",
        immediateActions: ["Audit mobile experience", "Increase touch target sizes", "Optimize for thumb navigation", "Test on real devices"],
        risks: ["Performance impact on mobile", "Feature parity across devices", "Testing complexity"]
      },
      accessibility: {
        priority: "HIGH" as const,
        confidence: "HIGH" as const,
        coreInsight: "Ensure WCAG compliance with proper semantic markup and keyboard navigation",
        immediateActions: ["Add alt text to images", "Implement keyboard navigation", "Test with screen readers", "Check color contrast"],
        risks: ["Development time increase", "Complex interaction patterns", "Legal compliance requirements"]
      },
      general: {
        priority: "MEDIUM" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "Conduct user research to validate design decisions and improve experience",
        immediateActions: ["Define user personas", "Create user journey maps", "Design system audit", "Usability testing plan"],
        risks: ["Resource allocation for research", "Timeline impact", "Stakeholder buy-in needed"]
      }
    };

    const response = responses[type];
    
    return {
      priority: response.priority,
      confidence: response.confidence,
      coreInsight: response.coreInsight,
      immediateActions: response.immediateActions,
      risks: response.risks,
      questions: ["Who is the target user?", "What's the primary user goal?"]
    };
  }
}

export default ConsultDesignerTool;