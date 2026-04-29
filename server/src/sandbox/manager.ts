// ============================================================
// PRANU v2 — Docker Sandbox Manager
// ============================================================

import { config } from '../config.js';

interface ContainerInfo {
    id: string;
    taskId: string;
    createdAt: Date;
    lastUsed: Date;
}

export class SandboxManager {
    private containers: Map<string, ContainerInfo> = new Map();
    private docker: InstanceType<typeof import('dockerode')> | null = null;
    private initialized = false;
    private cleanupInterval: ReturnType<typeof setInterval> | null = null;

    async initialize(): Promise<void> {
        if (this.initialized) return;

        if (!config.SANDBOX_ENABLED) {
            console.log('📦 Sandbox disabled — running commands directly');
            this.initialized = true;
            return;
        }

        try {
            const DockerMod = await import('dockerode');
            const Docker = DockerMod.default ?? DockerMod;
            this.docker = new (Docker as any)();

            // Verify Docker is accessible
            await this.docker!.ping();
            console.log('📦 Docker sandbox initialized');

            // Start cleanup interval (every 5 minutes)
            this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
            this.initialized = true;
        } catch (error) {
            console.warn('⚠ Docker not available, falling back to direct execution:', error instanceof Error ? error.message : String(error));
            this.initialized = true;
        }
    }

    async createContainer(taskId: string, workspacePath: string): Promise<string | undefined> {
        if (!this.docker || !config.SANDBOX_ENABLED) {
            return undefined;
        }

        try {
            // Pull sandbox image if needed
            try {
                await this.docker.getImage(config.SANDBOX_IMAGE).inspect();
            } catch {
                console.log(`📦 Building sandbox image...`);
                // Build from Dockerfile if image doesn't exist
                // For now, use a base image
                await this.docker.pull('node:20-slim');
            }

            const container = await this.docker.createContainer({
                Image: 'node:20-slim',
                Cmd: ['tail', '-f', '/dev/null'], // Keep container running
                WorkingDir: '/workspace',
                HostConfig: {
                    Binds: [`${workspacePath}:/workspace`],
                    NanoCpus: config.SANDBOX_CPU_LIMIT * 1e9,
                    Memory: this.parseMemoryString(config.SANDBOX_MEMORY_LIMIT),
                    NetworkMode: 'none', // No network by default
                },
                Labels: {
                    'pranu.task-id': taskId,
                    'pranu.managed': 'true',
                },
            });

            await container.start();

            const containerId = container.id;
            this.containers.set(taskId, {
                id: containerId,
                taskId,
                createdAt: new Date(),
                lastUsed: new Date(),
            });

            console.log(`📦 Container created for task ${taskId}: ${containerId.substring(0, 12)}`);
            return containerId;
        } catch (error) {
            console.error('Failed to create container:', error);
            return undefined;
        }
    }

    async destroyContainer(taskId: string): Promise<void> {
        const info = this.containers.get(taskId);
        if (!info || !this.docker) return;

        try {
            const container = this.docker.getContainer(info.id);
            await container.stop({ t: 5 });
            await container.remove({ force: true });
            this.containers.delete(taskId);
            console.log(`📦 Container destroyed for task ${taskId}`);
        } catch (error) {
            console.warn(`Failed to destroy container for task ${taskId}:`, error);
            this.containers.delete(taskId);
        }
    }

    getContainerId(taskId: string): string | undefined {
        return this.containers.get(taskId)?.id;
    }

    async destroyAll(): Promise<void> {
        const tasks = Array.from(this.containers.keys());
        await Promise.all(tasks.map((taskId) => this.destroyContainer(taskId)));

        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }

    private async cleanup(): Promise<void> {
        const now = new Date();
        const ttl = config.SANDBOX_TIMEOUT_MS;

        for (const [taskId, info] of this.containers) {
            const idleTime = now.getTime() - info.lastUsed.getTime();
            if (idleTime > ttl) {
                console.log(`📦 Auto-cleaning idle container for task ${taskId}`);
                await this.destroyContainer(taskId);
            }
        }
    }

    private parseMemoryString(mem: string): number {
        const match = mem.match(/^(\d+)(g|m|k)?$/i);
        if (!match) return 4 * 1024 * 1024 * 1024; // 4GB default
        const num = parseInt(match[1], 10);
        const unit = (match[2] ?? 'm').toLowerCase();
        switch (unit) {
            case 'g': return num * 1024 * 1024 * 1024;
            case 'm': return num * 1024 * 1024;
            case 'k': return num * 1024;
            default: return num;
        }
    }
}

// Singleton
export const sandboxManager = new SandboxManager();
