import "reflect-metadata";

// Jest global setup for unit tests
beforeAll(() => {
	// Set test environment variables
	process.env.NODE_ENV = "test";
	process.env.JWT_SECRET = "test-jwt-secret";
	process.env.JWT_REFRESH_SECRET = "test-jwt-refresh-secret";
	process.env.BCRYPT_SALT_ROUNDS = "10";
});

// Global test timeout
jest.setTimeout(10000);

// Mock console.log in tests to reduce noise
global.console = {
	...console,
	log: jest.fn(),
	debug: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: console.error, // Keep error logs for debugging
};
