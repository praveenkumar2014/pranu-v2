// ============================================================
// PRANU v2 — Storage Service
// Handles S3-compatible storage and local fallback.
// ============================================================

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { databaseService } from './database.js';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

export class StorageService {
    private s3Client: S3Client | null = null;
    private bucket: string | null = null;
    private db = databaseService.getClient();

    constructor() {
        if (config.S3_ENDPOINT && config.S3_REGION && config.S3_ACCESS_KEY_ID && config.S3_SECRET_ACCESS_KEY && config.S3_BUCKET) {
            this.bucket = config.S3_BUCKET;
            this.s3Client = new S3Client({
                endpoint: config.S3_ENDPOINT,
                region: config.S3_REGION,
                credentials: {
                    accessKeyId: config.S3_ACCESS_KEY_ID,
                    secretAccessKey: config.S3_SECRET_ACCESS_KEY,
                },
                forcePathStyle: true,
            });
        }
    }

    async generateUploadUrl(key: string, contentType = 'application/octet-stream'): Promise<string> {
        if (!this.s3Client || !this.bucket) {
            throw new Error('S3 storage is not configured');
        }

        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: contentType,
        });

        const url = await getSignedUrl(this.s3Client, command, { expiresIn: 900 });
        logger.info(`Generated signed upload URL for ${key}`);
        return url;
    }

    async getObjectUrl(key: string): Promise<string> {
        if (!this.s3Client || !this.bucket) {
            throw new Error('S3 storage is not configured');
        }

        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        const url = await getSignedUrl(this.s3Client, command, { expiresIn: 900 });
        return url;
    }

    async recordObject(key: string, url: string, userId?: string, metadata?: Record<string, unknown>) {
        return this.db.storageObject.create({
            data: {
                key,
                bucket: this.bucket ?? 'local',
                url,
                metadata: (metadata ?? {}) as any,
                user: userId ? { connect: { id: userId } } : undefined,
            },
        });
    }
}

export const storageService = new StorageService();
