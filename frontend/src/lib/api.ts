// ============================================================
// PRANU v2 — API Client
// ============================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface ApiOptions extends RequestInit {
    requiresAuth?: boolean;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
        const { requiresAuth = false, headers = {}, ...restOptions } = options;

        const requestHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Merge custom headers
        if (headers && typeof headers === 'object') {
            Object.assign(requestHeaders, headers);
        }

        // Add auth token if required
        if (requiresAuth) {
            const tokens = localStorage.getItem('pranu-auth-storage');
            if (tokens) {
                const { tokens: authTokens } = JSON.parse(tokens).state;
                if (authTokens?.accessToken) {
                    requestHeaders['Authorization'] = `Bearer ${authTokens.accessToken}`;
                }
            }
        }

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...restOptions,
            headers: requestHeaders,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Request failed');
        }

        return data;
    }

    // GET request
    async get<T>(endpoint: string, options?: ApiOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    // POST request
    async post<T>(endpoint: string, body?: any, options?: ApiOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    // PUT request
    async put<T>(endpoint: string, body?: any, options?: ApiOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    // DELETE request
    async delete<T>(endpoint: string, options?: ApiOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }

    // Authentication endpoints
    async register(data: { email: string; password: string; name: string }) {
        return this.post('/auth/register', data);
    }

    async login(data: { email: string; password: string }) {
        return this.post('/auth/login', data);
    }

    async logout(refreshToken: string) {
        return this.post('/auth/logout', { refreshToken }, { requiresAuth: true });
    }

    async getProfile() {
        return this.get('/auth/profile', { requiresAuth: true });
    }

    async updateProfile(data: { name?: string; email?: string }) {
        return this.put('/auth/profile', data, { requiresAuth: true });
    }

    async chat(data: { messages: Array<{ role: string; content: string }> }) {
        return this.post('/ai/chat', data, { requiresAuth: true });
    }

    async generateContent(data: { prompt: string; type: string }) {
        return this.post('/ai/generate', data, { requiresAuth: true });
    }

    // Task endpoints
    async getTasks(params?: { page?: number; limit?: number; status?: string }) {
        const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
        return this.get(`/tasks${queryString}`);
    }

    async createTask(data: { description: string; workspacePath?: string }) {
        return this.post('/tasks', data, { requiresAuth: true });
    }

    async getTask(id: string) {
        return this.get(`/tasks/${id}`);
    }

    async deleteTask(id: string) {
        return this.delete(`/tasks/${id}`, { requiresAuth: true });
    }

    // File endpoints
    async getFileTree() {
        return this.get('/files/tree');
    }

    async getFile(path: string) {
        return this.get(`/files/${path}`);
    }

    async updateFile(path: string, content: string) {
        return this.post(`/files/${path}`, { content }, { requiresAuth: true });
    }
}

export const api = new ApiClient(API_BASE_URL);

// Backward compatibility functions
export async function createTask(description: string, workspacePath?: string) {
    return api.createTask({ description, workspacePath });
}

export async function getTasks() {
    return api.getTasks();
}

export async function getTask(taskId: string) {
    return api.getTask(taskId);
}

export async function stopTask(taskId: string) {
    return api.post(`/tasks/${taskId}/stop`);
}

export async function pauseTask(taskId: string) {
    return api.post(`/tasks/${taskId}/pause`);
}

export async function resumeTask(taskId: string) {
    return api.post(`/tasks/${taskId}/resume`);
}

export async function getAgentStatus() {
    return api.get('/agents/status');
}

export async function getFileTree() {
    return api.getFileTree();
}

export async function getFileContent(path: string) {
    return api.getFile(path);
}
