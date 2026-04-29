// ============================================================
// PRANU v2 — LLM Smart Router
// Routes LLM requests to the optimal provider based on task type
// ============================================================

import { config, LLM_PROVIDERS, LLM_ROUTING, type TaskType } from '../config.js';
import type { ILLMProvider, ChatMessage, ChatResponse, ChatChunk, ChatOptions } from './provider.js';
import { OpenAICompatibleProvider } from './openai-compatible.js';

class SmartRouter implements ILLMProvider {
    readonly name = 'smart-router';
    readonly model = 'auto';

    private providers: Map<string, ILLMProvider> = new Map();
    private fallbackOrder: TaskType[] = ['planning', 'coding', 'review'];

    constructor() {
        // Initialize providers
        for (const [key, providerConfig] of Object.entries(LLM_PROVIDERS)) {
            this.providers.set(key, new OpenAICompatibleProvider(providerConfig));
        }
    }

    private getProvider(taskType: TaskType): ILLMProvider {
        const providerName = LLM_ROUTING[taskType];
        const provider = this.providers.get(providerName);

        if (provider && LLM_PROVIDERS[providerName as keyof typeof LLM_PROVIDERS].apiKey) {
            return provider;
        }

        // Fallback: find first available provider with an API key
        for (const [key, p] of this.providers) {
            if (LLM_PROVIDERS[key as keyof typeof LLM_PROVIDERS].apiKey) {
                console.warn(`⚠ Primary provider '${providerName}' not available, falling back to '${key}'`);
                return p;
            }
        }

        throw new Error('No LLM provider available. Set at least one API key in .env');
    }

    async chat(
        messages: ChatMessage[],
        options?: ChatOptions & { taskType?: TaskType }
    ): Promise<ChatResponse> {
        const taskType = options?.taskType ?? 'coding';

        try {
            const provider = this.getProvider(taskType);
            return await provider.chat(messages, options);
        } catch (error) {
            // Try fallback providers
            for (const fallbackType of this.fallbackOrder) {
                if (fallbackType === taskType) continue;
                try {
                    const provider = this.getProvider(fallbackType);
                    return await provider.chat(messages, options);
                } catch {
                    continue;
                }
            }
            throw error;
        }
    }

    async *streamChat(
        messages: ChatMessage[],
        options?: ChatOptions & { taskType?: TaskType }
    ): AsyncIterable<ChatChunk> {
        const taskType = options?.taskType ?? 'coding';

        try {
            const provider = this.getProvider(taskType);
            yield* provider.streamChat(messages, options);
        } catch (error) {
            // Try fallback providers
            for (const fallbackType of this.fallbackOrder) {
                if (fallbackType === taskType) continue;
                try {
                    const provider = this.getProvider(fallbackType);
                    yield* provider.streamChat(messages, options);
                    return;
                } catch {
                    continue;
                }
            }
            throw error;
        }
    }

    getProviderForTask(taskType: TaskType): ILLMProvider {
        return this.getProvider(taskType);
    }
}

// Singleton instance
export const llmRouter = new SmartRouter();
