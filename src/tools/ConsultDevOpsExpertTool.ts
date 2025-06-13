import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface ConsultDevOpsInput {
  userQuery: string;
  context?: string;
  infrastructure?: string;
}

interface ExpertResponse {
  priority: "HIGH" | "MEDIUM" | "LOW";
  confidence: "HIGH" | "MEDIUM" | "LOW";
  coreInsight: string;
  immediateActions: string[];
  risks: string[];
  questions: string[];
}

class ConsultDevOpsExpertTool extends MCPTool<ConsultDevOpsInput> {
  name = "consult_devops_expert";
  description = "DevOps expert - infrastructure, deployment, and monitoring only";

  schema = {
    userQuery: {
      type: z.string(),
      description: "The user's original query or problem",
    },
    context: {
      type: z.string().optional(),
      description: "Additional context about current infrastructure or deployment needs",
    },
    infrastructure: {
      type: z.string().optional(),
      description: "Current infrastructure setup (AWS, GCP, Azure, on-premise, etc.)",
    },
  };

  async execute(input: ConsultDevOpsInput): Promise<ExpertResponse> {
    const query = input.userQuery.toLowerCase();
    
    // DevOps focus only - infrastructure, deployment, monitoring
    const type = query.match(/deploy|deployment|release|rollback/) ? 'deployment' :
                 query.match(/monitor|logging|observability|metrics/) ? 'monitoring' :
                 query.match(/scale|scaling|load|capacity/) ? 'scaling' :
                 query.match(/ci\/cd|pipeline|automation|build/) ? 'automation' : 'general';
    
    const responses = {
      deployment: {
        priority: "HIGH" as const,
        confidence: "HIGH" as const,
        coreInsight: "Implement blue-green deployment with automated rollback and health checks",
        immediateActions: ["Set up blue-green deployment", "Add automated health checks", "Configure rollback triggers", "Implement canary releases"],
        risks: ["Deployment failures during peak traffic", "Database migration issues", "Service downtime"]
      },
      monitoring: {
        priority: "MEDIUM" as const,
        confidence: "HIGH" as const,
        coreInsight: "Monitor golden signals (latency, traffic, errors, saturation) with proper alerting",
        immediateActions: ["Set up centralized logging", "Implement metrics collection", "Configure alerting rules", "Create operational dashboards"],
        risks: ["Alert fatigue", "Monitoring overhead", "Missing critical issues"]
      },
      scaling: {
        priority: "HIGH" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "Implement auto-scaling with load balancing and database read replicas",
        immediateActions: ["Configure auto-scaling groups", "Set up load balancers", "Add database read replicas", "Implement CDN"],
        risks: ["Scaling costs", "Database bottlenecks", "Network latency"]
      },
      automation: {
        priority: "MEDIUM" as const,
        confidence: "HIGH" as const,
        coreInsight: "Automate CI/CD pipeline with testing, security scanning, and infrastructure as code",
        immediateActions: ["Set up GitOps workflow", "Automate testing pipeline", "Add security scanning", "Implement infrastructure as code"],
        risks: ["Pipeline complexity", "Build failures", "Security vulnerabilities in automation"]
      },
      general: {
        priority: "MEDIUM" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "Establish operational excellence with documentation, disaster recovery, and cost optimization",
        immediateActions: ["Create operational runbooks", "Set up disaster recovery", "Implement cost monitoring", "Document procedures"],
        risks: ["Operational complexity", "Cost overruns", "Poor disaster recovery"]
      }
    };

    const response = responses[type];
    
    return {
      priority: response.priority,
      confidence: response.confidence,
      coreInsight: response.coreInsight,
      immediateActions: response.immediateActions,
      risks: response.risks,
      questions: input.infrastructure ? ["What's the current infrastructure setup?"] : ["What infrastructure are you using?", "What are the scaling requirements?"]
    };
  }
}

export default ConsultDevOpsExpertTool;