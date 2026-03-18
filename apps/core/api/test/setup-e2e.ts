import "reflect-metadata";
import * as path from "node:path";
import * as dotenv from "dotenv";

// 로컬 테스트는 앱 디렉터리의 .env만 사용합니다.
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Jest global setup for E2E tests
beforeAll(() => {
	// 테스트 환경 설정 (기존 환경 변수 유지, 필요한 것만 오버라이드)
	process.env.NODE_ENV = "test";
	// JWT 테스트용 시크릿 (실제 시크릿 사용 가능하면 그대로 유지)
	if (!process.env.AUTH_JWT_SECRET) {
		process.env.AUTH_JWT_SECRET = "test-jwt-secret-e2e";
	}
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
