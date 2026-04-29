// ============================================================
// PRANU v2 — OpenAI-Compatible LLM Provider
// Uses the OpenAI SDK which is compatible with Groq and Together
// ============================================================

import OpenAI from 'openai';
import type {
    ILLMProvider,
    ChatMessage,
    ChatResponse,
    ChatChunk,
    ChatOptions,
    ToolCall,
} from './provider.js';

interface ProviderConfig {
    name: string;
    apiKey: string;
    baseURL: string;
    model: string;
}

function toOpenAIMessages(messages: ChatMessage[]): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
    return messages.map((m) => {
        const msg: Record<string, unknown> = {
            role: m.role,
            content: m.content,
        };
        if (m.tool_call_id) msg.tool_call_id = m.tool_call_id;
        if (m.tool_calls) msg.tool_calls = m.tool_calls;
        return msg as unknown as OpenAI.Chat.Completions.ChatCompletionMessageParam;
    });
}

export class OpenAICompatibleProvider implements ILLMProvider {
    readonly name: string;
    readonly model: string;
    private client: OpenAI;
    private providerName: string;

    constructor(config: ProviderConfig) {
        this.name = config.name;
        this.model = config.model;
        this.providerName = config.name;
        this.client = new OpenAI({
            apiKey: config.apiKey || 'sk-placeholder',
            baseURL: config.baseURL,
        });
    }

    async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
        try {
            const params: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
                model: this.model,
                messages: toOpenAIMessages(messages),
                temperature: options?.temperature ?? 0.7,
                max_tokens: options?.maxTokens ?? 4096,
                top_p: options?.topP,
                ...(options?.tools
                    ? {
                        tools: options.tools,
                        tool_choice: options.toolChoice ?? 'auto',
                    }
                    : {}),
            };

            const response = await this.client.chat.completions.create(params, {
                signal: options?.signal ?? undefined,
            });

            const choice = response.choices[0];
            const content = choice?.message?.content ?? '';
            const toolCalls = choice?.message?.tool_calls?.map(
                (tc: OpenAI.Chat.Completions.ChatCompletionMessageToolCall): ToolCall => ({
                    id: tc.id,
                    type: 'function',
                    function: {
                        name: tc.function.name,
                        arguments: tc.function.arguments,
                    },
                })
            );

            return {
                content,
                toolCalls: (toolCalls && toolCalls.length > 0 ? toolCalls : undefined) as any,
                usage: response.usage
                    ? {
                        promptTokens: response.usage.prompt_tokens,
                        completionTokens: response.usage.completion_tokens,
                        totalTokens: response.usage.total_tokens,
                    }
                    : undefined,
                model: response.model,
                provider: this.providerName,
            };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`[${this.name}] Chat failed: ${message}`);
        }
    }

    async *streamChat(
        messages: ChatMessage[],
        options?: ChatOptions
    ): AsyncIterable<ChatChunk> {
        try {
            const params: OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming = {
                model: this.model,
                messages: toOpenAIMessages(messages),
                temperature: options?.temperature ?? 0.7,
                max_tokens: options?.maxTokens ?? 4096,
                top_p: options?.topP,
                stream: true,
                ...(options?.tools
                    ? {
                        tools: options.tools,
                        tool_choice: options.toolChoice ?? 'auto',
                    }
                    : {}),
            };

            const stream = await this.client.chat.completions.create(params, {
                signal: options?.signal ?? undefined,
            });

            for await (const chunk of stream) {
                const delta = chunk.choices[0]?.delta;
                if (!delta) continue;

                const toolCalls = delta.tool_calls?.map((tc) => ({
                    id: tc.id ?? '',
                    type: 'function' as const,
                    function: {
                        name: tc.function?.name ?? '',
                        arguments: tc.function?.arguments ?? '',
                    },
                }));

                yield {
                    content: delta.content ?? undefined,
                    toolCalls: (toolCalls && toolCalls.length > 0 ? toolCalls : undefined) as any,
                    done: chunk.choices[0]?.finish_reason === 'stop',
                };
            }

            yield { done: true };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`[${this.name}] Stream failed: ${message}`);
        }
    }
}
