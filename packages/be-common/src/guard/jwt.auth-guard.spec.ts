import { PUBLIC_ROUTE_KEY } from "@cocrepo/decorator";
import { TokenStorageService } from "@cocrepo/service";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { JwtAuthGuard } from "./jwt.auth-guard";

describe("JwtAuthGuard", () => {
	let guard: JwtAuthGuard;
	let mockReflector: jest.Mocked<Reflector>;
	let mockTokenStorageService: jest.Mocked<TokenStorageService>;

	const createMockExecutionContext = (
		overrides: Partial<{
			path: string;
			method: string;
			authorization: string;
			cookies: Record<string, string>;
		}> = {},
	): ExecutionContext => {
		const request = {
			path: overrides.path || "/api/test",
			method: overrides.method || "GET",
			headers: {
				authorization: overrides.authorization,
			},
			cookies: overrides.cookies || {},
		};

		const handler = jest.fn();
		const classRef = jest.fn();

		return {
			switchToHttp: () => ({
				getRequest: () => request,
				getResponse: () => ({}),
			}),
			getHandler: () => handler,
			getClass: () => classRef,
		} as unknown as ExecutionContext;
	};

	beforeEach(async () => {
		mockReflector = {
			get: jest.fn(),
			getAllAndOverride: jest.fn(),
			getAllAndMerge: jest.fn(),
		} as any;

		mockTokenStorageService = {
			isBlacklisted: jest.fn(),
			saveRefreshToken: jest.fn(),
			validateRefreshToken: jest.fn(),
			deleteRefreshToken: jest.fn(),
			addToBlacklist: jest.fn(),
		} as any;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				JwtAuthGuard,
				{ provide: Reflector, useValue: mockReflector },
				{ provide: TokenStorageService, useValue: mockTokenStorageService },
			],
		}).compile();

		guard = module.get<JwtAuthGuard>(JwtAuthGuard);
	});

	it("가드가 정의되어야 한다", () => {
		expect(guard).toBeDefined();
	});

	describe("canActivate", () => {
		it("공개 라우트는 true를 반환해야 한다", () => {
			// Given
			mockReflector.get.mockReturnValue(true);
			const context = createMockExecutionContext();

			// When
			const result = guard.canActivate(context);

			// Then
			expect(result).toBe(true);
			expect(mockReflector.get).toHaveBeenCalledWith(
				PUBLIC_ROUTE_KEY,
				context.getHandler(),
			);
		});

		it("블랙리스트에 있는 토큰은 UnauthorizedException을 던져야 한다", async () => {
			// Given
			mockReflector.get.mockReturnValue(false);
			mockTokenStorageService.isBlacklisted.mockResolvedValue(true);
			const context = createMockExecutionContext({
				cookies: { accessToken: "blacklisted-token" },
			});

			// When & Then
			await expect(guard.canActivate(context)).rejects.toThrow(
				UnauthorizedException,
			);
			expect(mockTokenStorageService.isBlacklisted).toHaveBeenCalledWith(
				"blacklisted-token",
			);
		});
	});

	describe("handleRequest", () => {
		it("유효한 사용자를 반환해야 한다", () => {
			// Given
			const user = { id: "user-test-id", email: "test@example.com" };

			// When
			const result = guard.handleRequest(null, user, null);

			// Then
			expect(result).toEqual(user);
		});

		it("에러가 있으면 에러를 던져야 한다", () => {
			// Given
			const error = new Error("Auth error");

			// When & Then
			expect(() => guard.handleRequest(error, null, null)).toThrow(error);
		});

		it("사용자가 없으면 UnauthorizedException을 던져야 한다", () => {
			// When & Then
			expect(() => guard.handleRequest(null, null, null)).toThrow(
				UnauthorizedException,
			);
		});

		it("사용자가 없을 때 info가 있으면 UnauthorizedException을 던져야 한다", () => {
			// Given
			const info = { message: "Token expired" };

			// When & Then
			expect(() => guard.handleRequest(null, null, info)).toThrow(
				UnauthorizedException,
			);
		});
	});
});
