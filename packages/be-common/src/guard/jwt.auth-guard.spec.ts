import {
	CONTEXT_KEYS } from "@cocrepo/constant";
import { PUBLIC_ROUTE_KEY } from "@cocrepo/decorator";
import { ExecutionContext,
	UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test,
	TestingModule } from "@nestjs/testing";
import { ClsService } from "nestjs-cls";

// @cocrepo/service import 체인의 masking.interceptor 에러 회피
jest.mock("@cocrepo/service",
	() => {
	class TokenStorageService {
		isBlacklisted = jest.fn();
		saveRefreshToken = jest.fn();
		validateRefreshToken = jest.fn();
		deleteRefreshToken = jest.fn();
		addToBlacklist = jest.fn();
	}
	return {
		__esModule: true,
	TokenStorageService,
	};
});

import { TokenStorageService,
} from "@cocrepo/service";
import { JwtAuthGuard } from "./jwt.auth-guard";

describe("JwtAuthGuard", () => {
	let guard: JwtAuthGuard;
	let mockReflector: jest.Mocked<Reflector>;
	let mockTokenStorageService: jest.Mocked<TokenStorageService>;
	let mockClsService: { get: jest.Mock };

	const createMockExecutionContext = (
		overrides: Partial<{
			path: string;
			method: string;
			authorization: string;
			cookies: Record<string, string>;
			user: any;
		}> = {},
	): ExecutionContext => {
		const request = {
			path: overrides.path || "/api/test",
			method: overrides.method || "GET",
			headers: {
				authorization: overrides.authorization,
			},
			cookies: overrides.cookies || {},
			user: overrides.user,
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

		mockClsService = {
			get: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				JwtAuthGuard,
				{ provide: Reflector, useValue: mockReflector },
				{ provide: TokenStorageService, useValue: mockTokenStorageService },
				{ provide: ClsService, useValue: mockClsService },
			],
		}).compile();

		guard = module.get<JwtAuthGuard>(JwtAuthGuard);
	});

	it("가드가 정의되어야 한다", () => {
		expect(guard).toBeDefined();
	});

	describe("canActivate", () => {
		it("공개 라우트는 true를 반환해야 한다", async () => {
			// Given
			mockReflector.getAllAndOverride.mockReturnValue(true);
			const context = createMockExecutionContext();

			// When
			const result = await guard.canActivate(context);

			// Then
			expect(result).toBe(true);
			expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
				PUBLIC_ROUTE_KEY,
				[context.getHandler(), context.getClass()],
			);
		});

		it("블랙리스트에 있는 토큰은 UnauthorizedException을 던져야 한다", async () => {
			// Given
			mockReflector.getAllAndOverride.mockReturnValue(false);
			mockClsService.get.mockReturnValue("blacklisted-token");
			mockTokenStorageService.isBlacklisted.mockResolvedValue(true);
			const context = createMockExecutionContext();

			// When & Then
			await expect(guard.canActivate(context)).rejects.toThrow(
				UnauthorizedException,
			);
			expect(mockTokenStorageService.isBlacklisted).toHaveBeenCalledWith(
				"blacklisted-token",
			);
		});

		it("Bearer 토큰도 블랙리스트 체크를 해야 한다", async () => {
			// Given
			mockReflector.getAllAndOverride.mockReturnValue(false);
			mockClsService.get.mockReturnValue("bearer-token");
			mockTokenStorageService.isBlacklisted.mockResolvedValue(true);
			const context = createMockExecutionContext({
				authorization: "Bearer bearer-token",
			});

			// When & Then
			await expect(guard.canActivate(context)).rejects.toThrow(
				UnauthorizedException,
			);
			expect(mockClsService.get).toHaveBeenCalledWith(CONTEXT_KEYS.TOKEN);
			expect(mockTokenStorageService.isBlacklisted).toHaveBeenCalledWith(
				"bearer-token",
			);
		});

		it("request.user가 있으면 true를 반환해야 한다", async () => {
			// Given
			mockReflector.getAllAndOverride.mockReturnValue(false);
			mockClsService.get.mockReturnValue("valid-token");
			mockTokenStorageService.isBlacklisted.mockResolvedValue(false);
			const user = { id: "user-1", email: "test@example.com" };
			const context = createMockExecutionContext({ user });

			// When
			const result = await guard.canActivate(context);

			// Then
			expect(result).toBe(true);
		});

		it("request.user가 없으면 UnauthorizedException을 던져야 한다", async () => {
			// Given
			mockReflector.getAllAndOverride.mockReturnValue(false);
			mockClsService.get.mockReturnValue("valid-token");
			mockTokenStorageService.isBlacklisted.mockResolvedValue(false);
			const context = createMockExecutionContext({ user: undefined });

			// When & Then
			await expect(guard.canActivate(context)).rejects.toThrow(
				UnauthorizedException,
			);
		});

		it("CLS에 토큰이 없으면 블랙리스트 체크를 건너뛰어야 한다", async () => {
			// Given
			mockReflector.getAllAndOverride.mockReturnValue(false);
			mockClsService.get.mockReturnValue(undefined);
			const user = { id: "user-1", email: "test@example.com" };
			const context = createMockExecutionContext({ user });

			// When
			const result = await guard.canActivate(context);

			// Then
			expect(result).toBe(true);
			expect(mockTokenStorageService.isBlacklisted).not.toHaveBeenCalled();
		});

		it("토큰이 블랙리스트에 없으면 다음 단계로 진행해야 한다", async () => {
			// Given
			mockReflector.getAllAndOverride.mockReturnValue(false);
			mockClsService.get.mockReturnValue("valid-token");
			mockTokenStorageService.isBlacklisted.mockResolvedValue(false);
			const user = { id: "user-1", email: "test@example.com" };
			const context = createMockExecutionContext({ user });

			// When
			const result = await guard.canActivate(context);

			// Then
			expect(result).toBe(true);
			expect(mockTokenStorageService.isBlacklisted).toHaveBeenCalledWith(
				"valid-token",
			);
		});
	});
});
