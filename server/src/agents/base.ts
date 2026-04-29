// ============================================================
// PRANU v2 — Base Agent
// Abstract class implementing the think → act → observe pattern
// ============================================================

import { EventEmitter } from 'events';
import { v4 as uuid } from 'uuid';
import type { ILLMProvider, ChatMessage, ChatOptions, ToolCall, ToolDefinition } from '../llm/provider.js';
import type { ToolResult } from '../types/index.js';
import { AgentRole, AgentState } from '../types/index.js';
import type { ToolRegistry, ToolContext } from '../tools/registry.js';
import type { ShortTermMemory } from '../memory/short-term.js';
import type { MemoryStore } from '../memory/store.js';

export interface AgentConfig {
  role: AgentRole;
  systemPrompt: string;
  provider: ILLMProvider;
  toolRegistry: ToolRegistry;
  memoryStore: MemoryStore;
  shortTermMemory: ShortTermMemory;
  maxIterations: number;
  stepTimeout: number;
}

export interface AgentThought {
  content: string;
  toolCalls?: ToolCall[];
}

export abstract class BaseAgent extends EventEmitter {
  readonly role: AgentRole;
  readonly name: string;
  protected systemPrompt: string;
  protected provider: ILLMProvider;
  protected toolRegistry: ToolRegistry;
  protected memoryStore: MemoryStore;
  protected shortTermMemory: ShortTermMemory;
  protected maxIterations: number;
  protected stepTimeout: number;

  private _state: AgentState = AgentState.IDLE;
  private _currentTaskId: string | null = null;
  private abortController: AbortController | null = null;

  constructor(config: AgentConfig) {
    super();
    this.role = config.role;
    this.name = `pranu-${config.role}`;
    this.systemPrompt = config.systemPrompt;
    this.provider = config.provider;
    this.toolRegistry = config.toolRegistry;
    this.memoryStore = config.memoryStore;
    this.shortTermMemory = config.shortTermMemory;
    this.maxIterations = config.maxIterations;
    this.stepTimeout = config.stepTimeout;
  }

  get state(): AgentState {
    return this._state;
  }

  get currentTaskId(): string | null {
    return this._currentTaskId;
  }

  protected setState(state: AgentState): void {
    this._state = state;
    this.emit('stateChange', { agent: this.role, state, currentTaskId: this._currentTaskId });
  }

  protected setTaskId(taskId: string | null): void {
    this._currentTaskId = taskId;
  }

  abstract run(taskId: string, input: string, context?: string): Promise<string>;

  protected async think(
    prompt: string,
    options?: ChatOptions & { taskType?: string }
  ): Promise<AgentThought> {
    this.setState(AgentState.THINKING);
    this.emit('thought', { agent: this.role, thought: prompt });

    const messages: ChatMessage[] = [
      { role: 'system', content: this.systemPrompt },
      ...this.shortTermMemory.getMessages().map((m) => ({
        role: m.role as ChatMessage['role'],
        content: m.content,
      })),
      { role: 'user', content: prompt },
    ];

    // Get tool definitions for this agent
    const tools = this.getAvailableTools();

    const response = await this.provider.chat(messages, {
      ...options,
      tools: tools.length > 0 ? tools : undefined,
      toolChoice: tools.length > 0 ? 'auto' : undefined,
      signal: this.abortController?.signal,
    });

    // Record in short-term memory
    this.shortTermMemory.add({
      role: 'assistant',
      content: response.content,
      timestamp: new Date().toISOString(),
      metadata: {
        tokenCount: response.usage?.totalTokens,
      },
    });

    return {
      content: response.content,
      toolCalls: response.toolCalls,
    };
  }

  protected async act(
    toolName: string,
    toolInput: unknown,
    context: ToolContext
  ): Promise<ToolResult> {
    this.setState(AgentState.ACTING);
    this.emit('actionStarted', { agent: this.role, tool: toolName, input: toolInput });

    const startTime = Date.now();
    const result = await this.toolRegistry.execute(toolName, toolInput, context);
    const duration = Date.now() - startTime;

    // Log action
    this.memoryStore.logAction({
      id: uuid(),
      taskId: context.taskId,
      stepId: '',
      agentName: this.role,
      actionType: 'tool_call',
      toolName,
      inputJson: JSON.stringify(toolInput),
      outputJson: JSON.stringify(result),
      durationMs: duration,
    });

    // Record in short-term memory
    this.shortTermMemory.add({
      role: 'tool',
      content: result.success ? result.output : `Error: ${result.error}`,
      timestamp: new Date().toISOString(),
      metadata: {
        toolName,
      },
    });

    this.emit('actionCompleted', { agent: this.role, tool: toolName, result, duration });

    return result;
  }

  protected observe(result: ToolResult): void {
    this.emit('observation', { agent: this.role, result });
  }

  protected getAvailableTools(): ToolDefinition[] {
    return this.toolRegistry.list().map((t) => ({
      type: 'function' as const,
      function: {
        name: t.name,
        description: t.description,
        parameters: t.inputSchema,
      },
    }));
  }

  stop(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.setState(AgentState.IDLE);
    this.setTaskId(null);
  }

  protected startRun(taskId: string): void {
    this.abortController = new AbortController();
    this.setTaskId(taskId);
    this.shortTermMemory.clear();
  }

  protected endRun(): void {
    this.setState(AgentState.IDLE);
    this.abortController = null;
  }
}
