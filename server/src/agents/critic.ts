// ============================================================
// PRANU v2 — Critic Agent
// Reviews executor output for correctness and completeness
// ============================================================

import { BaseAgent, type AgentConfig } from './base.js';
import { AgentRole } from '../types/index.js';

const CRITIC_SYSTEM_PROMPT = `You are a senior code reviewer and quality assurance expert. Your job is to review the executor's work for each step.

Review criteria:
1. Correctness: Does the code/output do what was intended?
2. Completeness: Is the step fully done per its acceptance criteria?
3. Quality: Is the code well-structured, readable, and following best practices?
4. Safety: Are there any security issues or dangerous patterns?

Respond with a JSON object:
{
  "approved": true/false,
  "feedback": "detailed review comments",
  "fixes": [
    {
      "description": "what needs to be fixed",
      "toolHint": "suggested tool to use"
    }
  ]
}

Only reject if there are significant issues. Minor style preferences should not cause rejection.
If approved, briefly explain what was done well.`;

export class CriticAgent extends BaseAgent {
    constructor(config: Omit<AgentConfig, 'role' | 'systemPrompt' | 'maxIterations' | 'stepTimeout'>) {
        super({
            ...config,
            role: AgentRole.CRITIC,
            systemPrompt: CRITIC_SYSTEM_PROMPT,
            maxIterations: 1,
            stepTimeout: 60000,
        });
    }

    async run(
        taskId: string,
        input: string,
        context?: string
    ): Promise<string> {
        this.startRun(taskId);

        try {
            const prompt = `Review this step:\n\nStep description: ${input}\n\nExecutor's work:\n${context ?? 'No output provided'}`;

            const thought = await this.think(prompt);

            const review = this.parseReview(thought.content);

            this.emit('reviewComplete', {
                taskId,
                approved: review.approved,
                feedback: review.feedback,
            });

            return JSON.stringify(review);
        } finally {
            this.endRun();
        }
    }

    private parseReview(
        content: string
    ): { approved: boolean; feedback: string; fixes?: Array<{ description: string; toolHint: string }> } {
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    approved: parsed.approved === true,
                    feedback: String(parsed.feedback ?? 'No feedback provided'),
                    fixes: Array.isArray(parsed.fixes) ? parsed.fixes : undefined,
                };
            }
        } catch {
            // Not valid JSON
        }

        // Default: approve if no clear rejection signal
        const rejected = /reject|fail|incorrect|wrong|broken/i.test(content);
        return {
            approved: !rejected,
            feedback: content.substring(0, 500),
        };
    }
}
