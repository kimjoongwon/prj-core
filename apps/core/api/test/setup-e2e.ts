import "reflect-metadata";
import * as path from "node:path";
import * as dotenv from "dotenv";

const DEFAULT_E2E_DATABASE_NAME = "plate_e2e";

// 로컬 테스트는 앱 디렉터리의 .env만 사용합니다.
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const e2eDatabaseUrl =
	process.env.E2E_DATABASE_URL ??
	process.env.TEST_DATABASE_URL ??
	(process.env.DATABASE_URL
		? toDefaultE2eDatabaseUrl(process.env.DATABASE_URL)
		: undefined);
const e2eDirectUrl =
	process.env.E2E_DIRECT_URL ?? process.env.TEST_DIRECT_URL ?? e2eDatabaseUrl;

if (e2eDatabaseUrl) {
	process.env.DATABASE_URL = e2eDatabaseUrl;
}

if (e2eDirectUrl) {
	process.env.DIRECT_URL = e2eDirectUrl;
}

// Jest global setup for E2E tests
beforeAll(() => {
	// 테스트 환경 설정 (기존 환경 변수 유지, 필요한 것만 오버라이드)
	process.env.NODE_ENV = "test";
	process.env.ENABLE_NEST_DEVTOOLS = "false";
});

// Global test timeout for E2E tests
jest.setTimeout(30000);

function toDefaultE2eDatabaseUrl(databaseUrl: string): string {
	const parsedUrl = new URL(databaseUrl);
	const databaseName = decodeURIComponent(
		parsedUrl.pathname.replace(/^\//, ""),
	);

	if (!databaseName) {
		throw new Error("DATABASE_URL must include a database name.");
	}

	parsedUrl.pathname = `/${encodeURIComponent(DEFAULT_E2E_DATABASE_NAME)}`;
	return parsedUrl.toString();
}

// Mock console.log in E2E tests to reduce noise
global.console = {
	...console,
	log: jest.fn(),
	debug: jest.fn(),
	info: jest.fn(),
	warn: jest.fn(),
	error: console.error, // Keep error logs for debugging
};
