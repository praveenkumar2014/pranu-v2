// ============================================================
// PRANU v2 — AI Service
// Supports OpenAI provider and fallback model routing.
// ============================================================

import OpenAI from 'openai';
import { config, LLM_PROVIDERS, LLM_ROUTING } from '../config.js';
import { logger } from '../utils/logger.js';

interface ChatRequest {
    model?: string;
    provider?: 'openai' | 'groq' | 'together';
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
}

export class AIService {
    private openAIClient: OpenAI | null = null;

    constructor() {
        if (config.OPENAI_API_KEY) {
            this.openAIClient = new OpenAI({ apiKey: config.OPENAI_API_KEY });
        }
    }

    getAvailableModels() {
        return [
            { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai' },
            { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'openai' },
            { id: LLM_PROVIDERS.together.model, name: 'Together AI', provider: 'together' },
            { id: LLM_PROVIDERS.groq.model, name: 'Groq AI', provider: 'groq' },
        ];
    }

    async createChat(request: ChatRequest) {
        const provider = request.provider || LLM_ROUTING.planning;
        const model = request.model || LLM_PROVIDERS[provider].model;

        if (provider === 'openai') {
            if (!this.openAIClient) {
                throw new Error('OpenAI API key is not configured');
            }
            const completion = await this.openAIClient.chat.completions.create({
                model,
                messages: request.messages,
                temperature: 0.75,
                max_tokens: 800,
            });
            const text = completion.choices?.[0]?.message?.content || '';
            logger.info(`OpenAI chat completed for model ${model}`);
            return { provider: 'openai', model, output: text };
        }

        // Placeholder for local or alternate providers
        return {
            provider,
            model,
            output: request.messages.map((message) => message.content).join(' '),
        };
    }

    async generateContent(prompt: string, type: string) {
        return this.createChat({
            provider: 'openai',
            messages: [
                { role: 'system', content: `Generate ${type} content in a premium SaaS voice.` },
                { role: 'user', content: prompt },
            ],
        });
    }
}

export const aiService = new AIService();
