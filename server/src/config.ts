// ============================================================
// PRANU v2 — Server Configuration
// ============================================================

import { z } from 'zod';

const envSchema = z.object({
    PORT: z.coerce.number().default(4000),
    WS_PORT: z.coerce.number().default(4001),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Database
    DATABASE_PROVIDER: z.enum(['sqlite', 'postgresql']).default('sqlite'),
    DATABASE_URL: z.string().default('file:./data/pranu.db'),

    // LLM API Keys
    GROQ_API_KEY: z.string().optional(),
    GROQ_MODEL: z.string().default('llama-3.1-70b-versatile'),
    GROQ_BASE_URL: z.string().default('https://api.groq.com/openai/v1'),

    TOGETHER_API_KEY: z.string().optional(),
    TOGETHER_MODEL: z.string().default('deepseek-ai/DeepSeek-V3'),
    TOGETHER_BASE_URL: z.string().default('https://api.together.xyz/v1'),

    OPENAI_API_KEY: z.string().optional(),
    OPENAI_MODEL: z.string().default('gpt-4o'),
    OPENAI_BASE_URL: z.string().default('https://api.openai.com/v1'),

    // Sandbox
    SANDBOX_ENABLED: z.coerce.boolean().default(false),
    SANDBOX_IMAGE: z.string().default('pranu-sandbox:latest'),
    SANDBOX_CPU_LIMIT: z.number().default(2),
    SANDBOX_MEMORY_LIMIT: z.string().default('4g'),
    SANDBOX_TIMEOUT_MS: z.coerce.number().default(300000),

    // Workspace
    WORKSPACE_PATH: z.string().default('/tmp/pranu-workspace'),

    // Authentication
    JWT_SECRET: z.string().default('dev-secret-change-in-production'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    JWT_REFRESH_SECRET: z.string().default('dev-refresh-secret-change-in-production'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
    FRONTEND_URL: z.string().default('http://localhost:3000'),

    // OAuth
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    OAUTH_CALLBACK_URL: z.string().default('http://localhost:4000/api/v1/auth/oauth/google/callback'),

    // S3 Storage
    S3_ENDPOINT: z.string().optional(),
    S3_REGION: z.string().optional(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
    S3_BUCKET: z.string().optional(),

    // Billing
    UPI_PROVIDER: z.string().optional(),
    BILLING_EMAIL: z.string().optional(),
});

export type Config = z.infer<typeof envSchema>;

function loadConfig(): Config {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        console.warn('⚠ Config validation warnings:', result.error.flatten().fieldErrors);
        return envSchema.parse({});
    }
    return result.data;
}

export const config = loadConfig();

export const LLM_PROVIDERS = {
    groq: {
        name: 'groq',
        apiKey: config.GROQ_API_KEY || '',
        baseURL: config.GROQ_BASE_URL,
        model: config.GROQ_MODEL,
    },
    together: {
        name: 'together',
        apiKey: config.TOGETHER_API_KEY || '',
        baseURL: config.TOGETHER_BASE_URL,
        model: config.TOGETHER_MODEL,
    },
    openai: {
        name: 'openai',
        apiKey: config.OPENAI_API_KEY || '',
        baseURL: config.OPENAI_BASE_URL,
        model: config.OPENAI_MODEL,
    },
} as const;

export const LLM_ROUTING = {
    planning: 'openai' as const,
    coding: 'together' as const,
    review: 'groq' as const,
    tool_selection: 'groq' as const,
    memory: 'groq' as const,
};

export type TaskType = keyof typeof LLM_ROUTING;
