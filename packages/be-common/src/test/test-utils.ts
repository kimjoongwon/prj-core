import type { ContextUserSnapshot } from "@cocrepo/type";
import { User } from "@cocrepo/entity";
import { PrismaService } from "@cocrepo/service";
import type { Provider, Type } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import type { Request, Response } from "express";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";

export type MockedPrismaService = DeepMockProxy<PrismaService>;

export const createMockPrismaService = (): MockedPrismaService => {
	return mockDeep<PrismaService>();
};

export const resetMockPrismaService = (prisma: MockedPrismaService): void => {
	mockReset(prisma);
};

export interface TestUserData {
	id: string;
	name: string;
	phone: string;
	password: string;
	email: string;
	spaceId: string;
	tenants?: Array<{
		id: string;
		spaceId: string;
		roleId: string;
	}>;
	profiles?: Array<{
		name: string;
		nickname: string;
	}>;
}

export const createTestUser = (
	overrides: Partial<TestUserData> = {},
): TestUserData => {
	return {
		id: "user-test-id",
		name: "test@example.com",
		phone: "010-1234-5678",
		password: "$2b$10$hashedPassword",
		email: "test@example.com",
		spaceId: "space-test-id",
		tenants: [
			{
				id: "tenant-test-id",
				spaceId: "space-test-id",
				roleId: "role-test-id",
			},
		],
		profiles: [
			{
				name: "Test User",
				nickname: "testuser",
			},
		],
		...overrides,
	};
};

export const createTestUserDto = (
	overrides: Partial<ContextUserSnapshot> = {},
): ContextUserSnapshot => {
	return {
		id: "user-test-id",
		spaceId: "space-test-id",
		email: "test@example.com",
		name: "Test User",
		phone: "010-1234-5678",
		password: "$2b$10$hashedPassword",
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		tenants: [
			{
				id: "tenant-test-id",
				name: "Test Tenant",
				spaceId: "space-test-id",
				roleId: "role-test-id",
				space: {
					id: "space-test-id",
					name: "Test Space",
					ground: {
						id: "ground-test-id",
						name: "Test Ground",
					},
				},
			},
		],
		...overrides,
	} as ContextUserSnapshot;
};

export const createTestUserEntity = (overrides: Partial<User> = {}): User => {
	const user = new User();
	Object.assign(user, {
		id: "user-test-id",
		spaceId: "space-test-id",
		email: "test@example.com",
		name: "Test User",
		phone: "010-1234-5678",
		password: "$2b$10$hashedPassword",
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		removedAt: null,
		tenants: [
			{
				id: "tenant-test-id",
				name: "Test Tenant",
				spaceId: "space-test-id",
				roleId: "role-test-id",
				space: {
					id: "space-test-id",
					name: "Test Space",
					ground: {
						id: "ground-test-id",
						name: "Test Ground",
					},
				},
			},
		],
		...overrides,
	});
	return user;
};

export interface TestTokens {
	accessToken: string;
	refreshToken: string;
}

export const createTestTokens = (
	userId: string = "user-test-id",
): TestTokens => {
	return {
		accessToken: `test-access-token-${userId}`,
		refreshToken: `test-refresh-token-${userId}`,
	};
};

export const createMockJwtService = (): Partial<JwtService> => {
	return {
		sign: jest
			.fn()
			.mockImplementation((payload) => `mock-token-${JSON.stringify(payload)}`),
		verify: jest.fn().mockImplementation((token) => {
			if (token.includes("user-test-id")) {
				return { userId: "user-test-id" };
			}
			throw new Error("Invalid token");
		}),
		signAsync: jest
			.fn()
			.mockImplementation(
				async (payload) => `mock-token-${JSON.stringify(payload)}`,
			),
		verifyAsync: jest.fn().mockImplementation(async (token) => {
			if (token.includes("user-test-id")) {
				return { userId: "user-test-id" };
			}
			throw new Error("Invalid token");
		}),
	};
};

export const createMockConfigService = (): Partial<ConfigService> => {
	return {
		get: jest.fn().mockImplementation((key: string) => {
			const config: Record<string, string | number> = {
				"auth.jwtSecret": "test-jwt-secret",
				"auth.jwtRefreshSecret": "test-jwt-refresh-secret",
				"auth.jwtAccessTokenExpirationTime": "15m",
				"auth.jwtRefreshTokenExpirationTime": "7d",
				"app.bcryptSaltRounds": 10,
				"app.nodeEnv": "test",
				"database.url": "file:./test.db",
			};
			return config[key] || "test-value";
		}),
	};
};

export const createMockRequest = (
	overrides: Partial<Request> = {},
): Partial<Request> => {
	return {
		user: undefined,
		cookies: {},
		headers: {},
		body: {},
		query: {},
		params: {},
		...overrides,
	};
};

export const createMockResponse = (
	overrides: Partial<Response> = {},
): Partial<Response> => {
	const response = {
		cookie: jest.fn().mockReturnThis(),
		clearCookie: jest.fn().mockReturnThis(),
		status: jest.fn().mockReturnThis(),
		json: jest.fn().mockReturnThis(),
		send: jest.fn().mockReturnThis(),
		...overrides,
	};
	return response;
};

export const setupTestModule = async (
	providers: Provider[],
	overrides: Record<string, unknown> = {},
): Promise<TestingModule> => {
	const module: TestingModule = await Test.createTestingModule({
		providers: [
			...providers,
			{
				provide: PrismaService,
				useValue: overrides.prisma || createMockPrismaService(),
			},
			{
				provide: JwtService,
				useValue: overrides.jwtService || createMockJwtService(),
			},
			{
				provide: ConfigService,
				useValue: overrides.configService || createMockConfigService(),
			},
			...Object.entries(overrides)
				.filter(
					([provide]) =>
						!["prisma", "jwtService", "configService"].includes(provide),
				)
				.map(([provide, useValue]) => ({
					provide,
					useValue,
				})),
		],
	}).compile();

	return module;
};

export const setupTestController = async (
	controller: Type<unknown>,
	providers: Provider[] = [],
	overrides: Record<string, unknown> = {},
): Promise<TestingModule> => {
	const module: TestingModule = await Test.createTestingModule({
		controllers: [controller],
		providers: [
			...providers,
			{
				provide: PrismaService,
				useValue: overrides.prisma || createMockPrismaService(),
			},
			{
				provide: JwtService,
				useValue: overrides.jwtService || createMockJwtService(),
			},
			{
				provide: ConfigService,
				useValue: overrides.configService || createMockConfigService(),
			},
			...Object.entries(overrides)
				.filter(
					([provide]) =>
						!["prisma", "jwtService", "configService"].includes(provide),
				)
				.map(([provide, useValue]) => ({
					provide,
					useValue,
				})),
		],
	}).compile();

	return module;
};

export const expectToThrowAsync = async (
	fn: () => Promise<unknown>,
	errorClass?: new (...arguments_: unknown[]) => Error,
	errorMessage?: string | RegExp,
): Promise<void> => {
	let error: unknown;
	try {
		await fn();
	} catch (e) {
		error = e;
	}

	expect(error).toBeDefined();
	if (errorClass) {
		expect(error).toBeInstanceOf(errorClass);
	}
	if (errorMessage) {
		const message = error instanceof Error ? error.message : String(error);
		if (typeof errorMessage === "string") {
			expect(message).toBe(errorMessage);
		} else {
			expect(message).toMatch(errorMessage);
		}
	}
};

export const delay = (ms: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export const createTestEnvironment = () => {
	const originalEnv = process.env;

	beforeEach(() => {
		process.env = {
			...originalEnv,
			NODE_ENV: "test",
			JWT_SECRET: "test-jwt-secret",
			JWT_REFRESH_SECRET: "test-jwt-refresh-secret",
			BCRYPT_SALT_ROUNDS: "10",
			DATABASE_URL: "file:./test.db",
		};
	});

	afterEach(() => {
		process.env = originalEnv;
	});
};
