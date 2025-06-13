import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface ConsultSecurityInput {
  userQuery: string;
  context?: string;
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

class ConsultSecurityExpertTool extends MCPTool<ConsultSecurityInput> {
  name = "consult_security_expert";
  description = "Security expert - vulnerabilities, authentication, and data protection only";

  schema = {
    userQuery: {
      type: z.string(),
      description: "The user's original query or problem",
    },
    context: {
      type: z.string().optional(),
      description: "Additional context about the system or requirements",
    },
    techStack: {
      type: z.string().optional(),
      description: "Technology stack being used",
    },
  };

  async execute(input: ConsultSecurityInput): Promise<ExpertResponse> {
    const query = input.userQuery.toLowerCase();
    
    // Security focus only - vulnerabilities and data protection
    const type = query.match(/auth|login|password|token/) ? 'auth' :
                 query.match(/sql|injection|xss|csrf/) ? 'injection' :
                 query.match(/data|encrypt|privacy/) ? 'data' :
                 query.match(/upload|file/) ? 'files' : 'general';
    
    const responses = {
      auth: {
        priority: "HIGH" as const,
        confidence: "HIGH" as const,
        coreInsight: "Implement secure session management, strong password hashing, and MFA for sensitive operations",
        immediateActions: ["Use bcrypt for password hashing", "Implement secure session cookies", "Add MFA for admin access", "Use RBAC for authorization"],
        risks: ["Session hijacking", "Password brute force attacks", "Privilege escalation"]
      },
      injection: {
        priority: "HIGH" as const,
        confidence: "HIGH" as const,
        coreInsight: "Use parameterized queries, input validation, and output encoding to prevent injection attacks",
        immediateActions: ["Replace string concatenation with parameterized queries", "Add input validation", "Implement CSP headers", "Use DOMPurify for XSS prevention"],
        risks: ["Data breach through SQL injection", "XSS attacks", "CSRF vulnerabilities"]
      },
      data: {
        priority: "HIGH" as const,
        confidence: "HIGH" as const,
        coreInsight: "Encrypt sensitive data at rest and in transit, implement proper access controls",
        immediateActions: ["Encrypt sensitive database fields", "Enforce HTTPS everywhere", "Add data masking in logs", "Implement access controls"],
        risks: ["Data exposure", "Privacy violations", "Compliance issues"]
      },
      files: {
        priority: "MEDIUM" as const,
        confidence: "HIGH" as const,
        coreInsight: "Validate file types, scan for malware, store outside web root with size limits",
        immediateActions: ["Whitelist allowed file types", "Add file size limits", "Store uploads outside web root", "Implement virus scanning"],
        risks: ["Malicious file execution", "Path traversal attacks", "Server compromise"]
      },
      general: {
        priority: "MEDIUM" as const,
        confidence: "MEDIUM" as const,
        coreInsight: "Add security headers, dependency scanning, and comprehensive logging for security events",
        immediateActions: ["Add security headers", "Scan dependencies for vulnerabilities", "Implement security logging", "Set up incident response"],
        risks: ["Various attack vectors", "Outdated dependencies", "Poor incident response"]
      }
    };

    const response = responses[type];
    
    return {
      priority: response.priority,
      confidence: response.confidence,
      coreInsight: response.coreInsight,
      immediateActions: response.immediateActions,
      risks: response.risks,
      questions: ["What sensitive data is being handled?", "Are there compliance requirements?"]
    };
  }
}

export default ConsultSecurityExpertTool;