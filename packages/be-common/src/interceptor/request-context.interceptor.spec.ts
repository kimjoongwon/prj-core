import { CONTEXT_KEYS } from "@cocrepo/constant";
import { type UserDto } from "@cocrepo/dto";
import { type CallHandler, type ExecutionContext } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { ClsService } from "nestjs-cls";
import { of } from "rxjs";
import { RequestContextInterceptor } from "./request-context.interceptor";

describe("RequestContextInterceptor", () => {
	let interceptor: RequestContextInterceptor;
	let mockClsService: {
		set: jest.Mock;
		get: jest.Mock;
	};

	beforeEach(async () => {
		mockClsService = {
			set: jest.fn(),
			get: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RequestContextInterceptor,
				{
					provide: ClsService,
					useValue: mockClsService,
				},
			],
		}).compile();

		interceptor = module.get<RequestContextInterceptor>(
			RequestContextInterceptor,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	const createMockRequest = (overrides: Record<string, any> = {}) => ({
		headers: {},
		user: null,
		...overrides,
	});

	const createMockExecutionContext = (mockRequest: any): ExecutionContext =>
		({
			switchToHttp: jest.fn().mockReturnValue({
				getRequest: jest.fn().mockReturnValue(mockRequest),
			}),
		}) as any;

	const createMockCallHandler = (): CallHandler => ({
		handle: jest.fn().mockReturnValue(of("test response")),
	});

	const createValidUser = (overrides: Partial<UserDto> = {}): UserDto =>
		({
			id: "user-123",
			email: "test@example.com",
			name: "Test User",
			phone: "123-456-7890",
			password: "password",
			createdAt: new Date(),
			updatedAt: new Date(),
			tenants: [
				{ id: "tenant-1", name: "Test Tenant 1", spaceId: "space-123" } as any,
				{ id: "tenant-2", name: "Test Tenant 2", spaceId: "space-456" } as any,
			],
			...overrides,
		}) as UserDto;

	describe("intercept", () => {
		it("사용자 정보가 없으면 모든 컨텍스트를 undefined로 설정한다", async () => {
			const mockRequest = createMockRequest({
				headers: { "x-space-id": "space-123" },
			});
			const mockExecutionContext = createMockExecutionContext(mockRequest);
			const mockCallHandler = createMockCallHandler();

			const result$ = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);
			const value = await result$.toPromise();

			expect(value).toBe("test response");
			expect(mockClsService.set).toHaveBeenCalledWith(
				CONTEXT_KEYS.AUTH_USER,
				undefined,
			);
			expect(mockClsService.set).toHaveBeenCalledWith(
				CONTEXT_KEYS.USER_ID,
				undefined,
			);
			expect(mockClsService.set).toHaveBeenCalledWith(
				CONTEXT_KEYS.TENANT,
				undefined,
			);
		});

		it("X-Space-ID 헤더가 없으면 user는 저장하고 tenant는 undefined로 설정한다", async () => {
			const mockUser = createValidUser();
			const mockRequest = createMockRequest({ user: mockUser });
			const mockExecutionContext = createMockExecutionContext(mockRequest);
			const mockCallHandler = createMockCallHandler();

			const result$ = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);
			const value = await result$.toPromise();

			expect(value).toBe("test response");
			expect(mockClsService.set).toHaveBeenCalledWith(
				CONTEXT_KEYS.AUTH_USER,
				mockUser,
			);
			expect(mockClsService.set).toHaveBeenCalledWith(
				CONTEXT_KEYS.USER_ID,
				"user-123",
			);
			expect(mockClsService.set).toHaveBeenCalledWith(
				CONTEXT_KEYS.TENANT,
				undefined,
			);
		});

		it("유효한 spaceId로 요청하면 user와 tenant 컨텍스트를 모두 설정한다", async () => {
			const mockUser = createValidUser();
			const mockRequest = createMockRequest({
				headers: { "x-space-id": "space-123" },
				user: mockUser,
			});
			const mockExecutionContext = createMockExecutionContext(mockRequest);
			const mockCallHandler = createMockCallHandler();

			const result$ = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);
			const value = await result$.toPromise();

			expect(value).toBe("test response");
			expect(mockClsService.set).toHaveBeenCalledWith(
				CONTEXT_KEYS.AUTH_USER,
				mockUser,
			);
			expect(mockClsService.set).toHaveBeenCalledWith(
				CONTEXT_KEYS.USER_ID,
				"user-123",
			);
			expect(mockClsService.set).toHaveBeenCalledWith(CONTEXT_KEYS.TENANT, {
				id: "tenant-1",
				name: "Test Tenant 1",
				spaceId: "space-123",
			});
		});

		it("사용자가 접근 권한이 없는 spaceId로 요청하면 tenant는 undefined로 설정한다", async () => {
			const mockUser = createValidUser();
			const mockRequest = createMockRequest({
				headers: { "x-space-id": "unauthorized-space" },
				user: mockUser,
			});
			const mockExecutionContext = createMockExecutionContext(mockRequest);
			const mockCallHandler = createMockCallHandler();

			const result$ = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);
			const value = await result$.toPromise();

			expect(value).toBe("test response");
			expect(mockClsService.set).toHaveBeenCalledWith(
				CONTEXT_KEYS.AUTH_USER,
				mockUser,
			);
			expect(mockClsService.set).toHaveBeenCalledWith(
				CONTEXT_KEYS.TENANT,
				undefined,
			);
		});

		it("여러 tenant가 있는 사용자에서 올바른 spaceId로 tenant를 찾는다", async () => {
			const mockUser = createValidUser();
			const mockRequest = createMockRequest({
				headers: { "x-space-id": "space-456" },
				user: mockUser,
			});
			const mockExecutionContext = createMockExecutionContext(mockRequest);
			const mockCallHandler = createMockCallHandler();

			const result$ = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);
			const value = await result$.toPromise();

			expect(value).toBe("test response");
			expect(mockClsService.set).toHaveBeenCalledWith(CONTEXT_KEYS.TENANT, {
				id: "tenant-2",
				name: "Test Tenant 2",
				spaceId: "space-456",
			});
		});
	});
});
