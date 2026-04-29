// ============================================================
// PRANU v2 — Role & Permission Service
// ============================================================

import { databaseService } from './database.js';
import { PrismaClient, Role } from '@prisma/client';
import { logger } from '../utils/logger.js';

const DEFAULT_ROLES = [
    {
        name: 'ADMIN', description: 'Super administrator with full access', permissions: [
            'users.manage',
            'workflow.manage',
            'cms.manage',
            'billing.manage',
            'ai.manage',
            'storage.manage',
        ]
    },
    {
        name: 'USER', description: 'Standard workspace user', permissions: [
            'tasks.create',
            'tasks.view',
            'ai.use',
            'content.create',
            'storage.upload',
        ]
    },
];

export class RoleService {
    private db: PrismaClient;

    constructor() {
        this.db = databaseService.getClient();
    }

    async ensureDefaultRoles() {
        for (const role of DEFAULT_ROLES) {
            await this.db.role.upsert({
                where: { name: role.name },
                update: {
                    description: role.description,
                    permissions: role.permissions,
                },
                create: {
                    name: role.name,
                    description: role.description,
                    permissions: role.permissions,
                },
            });
        }
        logger.info('Default roles created or updated');
    }

    async getRoleByName(name: string): Promise<Role | null> {
        return this.db.role.findUnique({ where: { name } });
    }

    async createRole(name: string, description: string, permissions: string[]) {
        return this.db.role.create({ data: { name, description, permissions } });
    }

    async updateRolePermissions(roleId: string, permissions: string[]) {
        return this.db.role.update({ where: { id: roleId }, data: { permissions } });
    }

    async listRoles() {
        return this.db.role.findMany({ orderBy: { createdAt: 'asc' } });
    }

    async userHasPermission(userId: string, permission: string): Promise<boolean> {
        const user = await this.db.user.findUnique({
            where: { id: userId },
            include: { role: true },
        });

        const permissions = user?.role.permissions as unknown as string[] | undefined;
        return !!permissions?.includes(permission);
    }
}

export const roleService = new RoleService();
