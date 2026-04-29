// ============================================================
// PRANU v2 — LLM Provider Interface
// ============================================================

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string;
    tool_call_id?: string;
    tool_calls?: ToolCall[];
}

export interface ToolCall {
    id: string;
    type: 'function';
    function: {
        name: string;
        arguments: string;
    };
}

export interface ChatResponse {
    content: string;
    toolCalls?: ToolCall[];
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    model: string;
    provider: string;
}

export interface ChatChunk {
    content?: string;
    toolCalls?: Partial<ToolCall>[];
    done: boolean;
}

export interface ChatOptions {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    tools?: ToolDefinition[];
    toolChoice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
    signal?: AbortSignal;
}

export interface ToolDefinition {
    type: 'function';
    function: {
        name: string;
        description: string;
        parameters: Record<string, unknown>;
    };
}

export interface ILLMProvider {
    readonly name: string;
    readonly model: string;
    chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse>;
    streamChat(messages: ChatMessage[], options?: ChatOptions): AsyncIterable<ChatChunk>;
}
