// ============================================================
// PRANU v2 — Executor Agent
// Executes steps using tools in a loop until complete
// ============================================================

import { v4 as uuid } from 'uuid';
import { BaseAgent, type AgentConfig } from './base.js';
import { AgentRole } from '../types/index.js';
import type { TaskStep, ToolResult } from '../types/index.js';
import type { ToolContext } from '../tools/registry.js';

const EXECUTOR_SYSTEM_PROMPT = `You are an expert software developer. Your job is to execute each step of a plan using the available tools.

Rules:
1. Use tools to accomplish tasks — never guess or assume
2. After each tool call, observe the result before deciding the next action
3. If a tool call fails, try a different approach
4. When writing code, ensure it is correct and well-structured
5. Verify your work by reading files after writing them
6. Run tests or build commands to validate changes
7. If you cannot complete a step after multiple attempts, explain what went wrong

Available tools:
- run_terminal: Execute shell commands (build, test, git, etc.)
- write_file: Create or modify files
- read_file: Read file contents
- search_code: Search the codebase
- install_package: Install npm/pip packages
- http_request: Make HTTP requests

When you decide to use a tool, output a JSON object:
{
  "tool": "tool_name",
  "input": { ... tool parameters ... }
}

When you believe the step is complete, output:
{
  "done": true,
  "summary": "brief description of what was accomplished"
}`;

export class ExecutorAgent extends BaseAgent {
  constructor(config: Omit<AgentConfig, 'role' | 'systemPrompt' | 'maxIterations' | 'stepTimeout'>) {
    super({
      ...config,
      role: AgentRole.EXECUTOR,
      systemPrompt: EXECUTOR_SYSTEM_PROMPT,
      maxIterations: 15,
      stepTimeout: 300000, // 5 minutes
    });
  }

  async run(
    taskId: string,
    input: string,
    context?: string
  ): Promise<string> {
    this.startRun(taskId);

    try {
      const toolContext: ToolContext = {
        taskId,
        workspacePath: process.env.WORKSPACE_PATH ?? '/tmp/pranu-workspace',
      };

      let iteration = 0;
      let currentPrompt = context
        ? `Execute this step:\n${input}\n\nAdditional context:\n${context}`
        : `Execute this step:\n${input}`;

      while (iteration < this.maxIterations) {
        iteration++;
        const thought = await this.think(currentPrompt);

        // Check if agent says it's done
        const doneMatch = this.parseDoneSignal(thought.content);
        if (doneMatch) {
          return doneMatch.summary ?? thought.content;
        }

        // Parse tool call from response
        const toolCall = this.parseToolCall(thought.content, thought.toolCalls);
        if (!toolCall) {
          // No tool call found — might be reasoning only
          currentPrompt = `Continue executing the step. Your last response didn't include a tool call. Step: ${input}`;
          continue;
        }

        // Execute the tool
        const result = await this.act(toolCall.tool, toolCall.input, toolContext);
        this.observe(result);

        // Update prompt with result for next iteration
        currentPrompt = this.formatResultPrompt(input, toolCall.tool, result);

        // If tool was successful and seems like step is complete
        if (result.success && this.isStepComplete(result)) {
          return result.output;
        }
      }

      return `Step execution reached max iterations (${this.maxIterations}). Last output may be incomplete.`;
    } finally {
      this.endRun();
    }
  }

  private parseToolCall(
    content: string,
    toolCalls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>
  ): { tool: string; input: Record<string, unknown> } | null {
    // Prefer structured tool calls from LLM
    if (toolCalls && toolCalls.length > 0) {
      const tc = toolCalls[0];
      try {
        const args = JSON.parse(tc.function.arguments);
        return { tool: tc.function.name, input: args };
      } catch {
        // Fall through to content parsing
      }
    }

    // Try to parse from content text
    try {
      const jsonMatch = content.match(/\{[\s\S]*"tool"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.tool) {
          return {
            tool: parsed.tool,
            input: parsed.input ?? parsed.args ?? {},
          };
        }
      }
    } catch {
      // Not valid JSON
    }

    return null;
  }

  private parseDoneSignal(content: string): { done: true; summary?: string } | null {
    try {
      const jsonMatch = content.match(/\{[\s\S]*"done"[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.done === true) {
          return { done: true, summary: parsed.summary };
        }
      }
    } catch {
      // Not valid JSON
    }
    return null;
  }

  private formatResultPrompt(step: string, tool: string, result: ToolResult): string {
    const status = result.success ? 'succeeded' : 'failed';
    const output = result.output ?? result.error ?? 'No output';

    return `Step: ${step}\n\nLast tool call (${tool}) ${status}:\n${output.substring(0, 3000)}\n\nContinue executing. If the step is complete, respond with {"done": true, "summary": "..."}. Otherwise, use another tool.`;
  }

  private isStepComplete(result: ToolResult): boolean {
    // Heuristic: if a write_file or terminal command succeeded, step might be done
    // The critic will verify, so we can be lenient here
    return result.success;
  }
}
