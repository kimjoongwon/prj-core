import "reflect-metadata";

// Jest global setup for E2E tests
beforeAll(() => {
	// Set test environment variables
	process.env.NODE_ENV = "test";
	process.env.JWT_SECRET = "test-jwt-secret-e2e";
	process.env.JWT_REFRESH_SECRET = "test-jwt-refresh-secret-e2e";
	process.env.BCRYPT_SALT_ROUNDS = "10";
	process.env.DATABASE_URL = "postgresql://postgres.bgybtdjyzbmodcinmptl:rkdmf7504%21%40%23@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";
});

// Global test timeout for E2E tests
jest.setTimeout(30000);

// Mock console.log in E2E tests to reduce noise
global.console = {
	...console,
	log: jest.fn(),
	debug: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: console.error, // Keep error logs for debugging
};
