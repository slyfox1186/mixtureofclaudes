# Mixture of Claudes MCP Server

An intelligent expert consultation system built on the Model Context Protocol (MCP). This server provides multiple AI expert personalities that collaborate to solve complex development challenges through multi-perspective analysis.

## Overview

Instead of getting a single perspective from Claude, Mixture of Claudes creates a virtual team of experts:

- **Software Engineer** - Technical implementation and code quality
- **Performance Expert** - Speed optimization and bottleneck analysis  
- **Security Expert** - Vulnerability assessment and data protection
- **UX/UI Designer** - User experience and interface design
- **DevOps Expert** - Infrastructure, deployment, and monitoring
- **Project Manager** - Planning, coordination, and resource management
- **Edge Cases Expert** - Identifies overlooked failure modes and boundary conditions
- **Synthesis Engine** - Combines all expert perspectives into unified action plans

## How It Works

1. **Task Analysis** - Intelligently determines which experts are needed based on your query
2. **Expert Consultation** - Selected experts provide focused, non-overlapping insights
3. **Synthesis** - All expert perspectives are combined into a comprehensive solution
4. **Conflict Resolution** - Disagreements between experts are resolved with clear reasoning

## Features

- **Context Efficient** - Ultra-concise expert responses optimized for LLM processing
- **No Overlap** - Each expert has distinct, focused domain expertise
- **Smart Selection** - Maximum 3 experts per query to maintain efficiency
- **Structured Output** - JSON-formatted responses with priorities, confidence levels, and actionable steps

## Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

## Installation for Claude Code

Add this server to your Claude Code configuration:

```bash
claude mcp add mixtureofclaudes /path/to/mixtureofclaudes/dist/index.js
```

## Available Expert Tools

- `analyze_task` - Intelligently selects optimal expert combination
- `consult_software_engineer` - Technical implementation guidance
- `consult_performance_expert` - Speed and optimization analysis
- `consult_security_expert` - Vulnerability assessment and protection
- `consult_designer` - UX/UI and user experience guidance  
- `consult_devops_expert` - Infrastructure and deployment expertise
- `consult_manager` - Project planning and coordination
- `consult_edge_cases_expert` - Failure modes and boundary conditions
- `synthesize_experts` - Combines all expert perspectives

## Example Usage

**Simple Query:**
"Fix this bug in my React component"
→ Software Engineer only

**Complex Query:**  
"Our login system is slow and users are complaining about security"
→ Software Engineer + Performance Expert + Security Expert + Designer + Edge Cases Expert

The system automatically determines the optimal expert combination for maximum effectiveness while maintaining context efficiency.

## Architecture

### Expert Response Format
```json
{
  "priority": "HIGH|MEDIUM|LOW",
  "confidence": "HIGH|MEDIUM|LOW", 
  "coreInsight": "One key actionable sentence",
  "immediateActions": ["specific", "next", "steps"],
  "risks": ["main", "concerns"],
  "questions": ["clarifying", "questions"]
}
```

### Intelligent Selection
- **Keyword Analysis** - Precision matching for each expert domain
- **Context Optimization** - Maximum 3 experts per query
- **No Redundancy** - Each expert has distinct, non-overlapping expertise
- **Auto-Escalation** - Edge Cases Expert triggered for complex scenarios

## Development

```bash
# Watch for changes during development
npm run watch

# Build for production
npm run build
```

## Project Structure

```
mixtureofclaudes/
├── src/
│   ├── tools/                 # Expert consultation tools
│   │   ├── AnalyzeTaskTool.ts
│   │   ├── ConsultSoftwareEngineerTool.ts
│   │   ├── ConsultPerformanceExpertTool.ts
│   │   ├── ConsultSecurityExpertTool.ts
│   │   ├── ConsultDesignerTool.ts
│   │   ├── ConsultDevOpsExpertTool.ts
│   │   ├── ConsultManagerTool.ts
│   │   ├── ConsultEdgeCasesExpertTool.ts
│   │   └── SynthesizeExpertsTool.ts
│   └── index.ts              # Server entry point
├── dist/                     # Compiled output
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Claude Code
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Learn More

- [MCP Framework Documentation](https://mcp-framework.com)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
