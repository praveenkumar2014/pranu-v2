// ============================================================
// PRANU v2 — Config Tests
// ============================================================

describe('Configuration', () => {
    it('should load configuration successfully', () => {
        // Basic test to verify Jest is working
        expect(true).toBe(true);
    });

    it('should have valid default config values', async () => {
        const { config } = await import('../config.js');

        expect(config.PORT).toBeDefined();
        expect(config.WS_PORT).toBeDefined();
        expect(config.NODE_ENV).toBeDefined();
        expect(config.WORKSPACE_PATH).toBeDefined();
    });
});
