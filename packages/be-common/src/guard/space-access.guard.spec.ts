import { CONTEXT_KEYS } from "@cocrepo/constant";
import { PUBLIC_ROUTE_KEY, SKIP_SPACE_CHECK_KEY } from "@cocrepo/decorator";
import { BadRequestException, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { ClsService } from "nestjs-cls";
import { SpaceAccessGuard } from "./space-access.guard";

describe("SpaceAccessGuard", () => {
	let guard: SpaceAccessGuard;
	let mockReflector: jest.Mocked<Reflector>;
	let mockClsService: { get: jest.Mock };

	const createMockExecutionContext = (): ExecutionContext => {
		const handler = jest.fn();
		Object.defineProperty(handler, "name", { value: "testHandler" });

		return {
			switchToHttp: () => ({
				getRequest: () => ({}),
			}),
			getHandler: () => handler,
		} as unknown as ExecutionContext;
	};

	const createMockUser = (overrides: any = {}) => ({
		id: "user-test-id",
		email: "test@example.com",
		tenants: [
			{
				id: "tenant-1",
				spaceId: "space-001",
				role: { name: "VIEW" },
			},
		],
		...overrides,
	});

	beforeEach(async () => {
		mockReflector = {
			get: jest.fn(),
			getAllAndOverride: jest.fn(),
			getAllAndMerge: jest.fn(),
		} as any;

		mockClsService = {
			get: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SpaceAccessGuard,
				{ provide: Reflector, useValue: mockReflector },
				{ provide: ClsService, useValue: mockClsService },
			],
		}).compile();

		guard = module.get<SpaceAccessGuard>(SpaceAccessGuard);
	});

	it("가드가 정의되어야 한다", () => {
		expect(guard).toBeDefined();
	});

	describe("canActivate", () => {
		describe("데코레이터에 의한 skip", () => {
			it("@PublicRoute 데코레이터가 있으면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockImplementation((key: string) => {
					if (key === PUBLIC_ROUTE_KEY) return true;
					return undefined;
				});
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

			it("@SkipSpaceCheck 데코레이터가 있으면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockImplementation((key: string) => {
					if (key === PUBLIC_ROUTE_KEY) return false;
					if (key === SKIP_SPACE_CHECK_KEY) return true;
					return undefined;
				});
				const context = createMockExecutionContext();

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
				expect(mockReflector.get).toHaveBeenCalledWith(
					SKIP_SPACE_CHECK_KEY,
					context.getHandler(),
				);
			});
		});

		describe("비인증 요청 처리", () => {
			it("비인증 요청(user=undefined)이면 true를 반환해야 한다 (JwtAuthGuard가 처리)", () => {
				// Given
				mockReflector.get.mockReturnValue(undefined);
				mockClsService.get.mockReturnValue(undefined);
				const context = createMockExecutionContext();

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});
		});

		describe("X-Space-ID 헤더 검증", () => {
			it("인증된 사용자가 X-Space-ID 없이 요청하면 BadRequestException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(undefined);
				const user = createMockUser();
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.SPACE_ID) return undefined;
					return undefined;
				});
				const context = createMockExecutionContext();

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(BadRequestException);
				expect(() => guard.canActivate(context)).toThrow(
					"X-Space-ID 헤더가 필요합니다",
				);
			});

			it("인증 + X-Space-ID + 해당 tenant가 있으면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(undefined);
				const user = createMockUser();
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.SPACE_ID) return "space-001";
					return undefined;
				});
				const context = createMockExecutionContext();

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("인증 + X-Space-ID + 해당 tenant가 없으면 ForbiddenException을 던져야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(undefined);
				const user = createMockUser();
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.SPACE_ID) return "non-existent-space";
					return undefined;
				});
				const context = createMockExecutionContext();

				// When & Then
				expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
				expect(() => guard.canActivate(context)).toThrow(
					"해당 Space에 대한 접근 권한이 없습니다",
				);
			});
		});

		describe("tenants가 비정상인 경우", () => {
			it("인증 + X-Space-ID + tenants가 null이면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(undefined);
				const user = createMockUser({ tenants: null });
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.SPACE_ID) return "space-001";
					return undefined;
				});
				const context = createMockExecutionContext();

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});

			it("인증 + X-Space-ID + tenants가 undefined이면 true를 반환해야 한다", () => {
				// Given
				mockReflector.get.mockReturnValue(undefined);
				const user = createMockUser({ tenants: undefined });
				mockClsService.get.mockImplementation((key: string) => {
					if (key === CONTEXT_KEYS.AUTH_USER) return user;
					if (key === CONTEXT_KEYS.SPACE_ID) return "space-001";
					return undefined;
				});
				const context = createMockExecutionContext();

				// When
				const result = guard.canActivate(context);

				// Then
				expect(result).toBe(true);
			});
		});
	});
});
