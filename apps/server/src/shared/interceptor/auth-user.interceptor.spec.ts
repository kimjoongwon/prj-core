import {
	CallHandler,
	ExecutionContext,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { UserDto } from "@shared/schema";
import { of, throwError } from "rxjs";
import { ContextProvider } from "../provider";
import { AuthUserInterceptor } from "./auth-user.interceptor";

// Mock ContextProvider using jest.mock
jest.mock("../provider", () => ({
	ContextProvider: {
		setTenantId: jest.fn(),
		setTenant: jest.fn(),
		setSpaceId: jest.fn(),
		setAuthUser: jest.fn(),
		setAuthUserId: jest.fn(),
		setAuthContext: jest.fn(),
	},
}));

describe("AuthUserInterceptor", () => {
	let interceptor: AuthUserInterceptor;
	let mockReflector: jest.Mocked<Reflector>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthUserInterceptor,
				{
					provide: Reflector,
					useValue: {
						getAllAndOverride: jest.fn(),
					},
				},
			],
		}).compile();

		interceptor = module.get<AuthUserInterceptor>(AuthUserInterceptor);
		mockReflector = module.get(Reflector);

		// Clear all mocks
		jest.clearAllMocks();
	});

	const createMockRequest = (overrides: Record<string, any> = {}) => ({
		cookies: {},
		headers: { host: "localhost:3000" },
		user: null,
		query: {},
		body: {},
		method: "GET",
		url: "/test",
		...overrides,
	});

	const createMockExecutionContext = (mockRequest: any): ExecutionContext =>
		({
			switchToHttp: jest.fn().mockReturnValue({
				getRequest: jest.fn().mockReturnValue(mockRequest),
			}),
			getHandler: jest.fn(),
			getClass: jest.fn(),
		}) as any;

	const createMockCallHandler = (response = "test response"): CallHandler => ({
		handle: jest.fn().mockReturnValue(of(response)),
	});

	const createValidUser = (overrides: Partial<UserDto> = {}): UserDto =>
		({
			id: "user-123",
			spaceId: "space-123",
			email: "test@example.com",
			name: "Test User",
			phone: "123-456-7890",
			password: "password",
			createdAt: new Date(),
			updatedAt: new Date(),
			tenants: [{ id: "tenant-1", name: "Test Tenant" } as any],
			...overrides,
		}) as UserDto;

	describe("intercept", () => {
		it("요청에 인증 컨텍스트가 없을 때 정상적으로 처리한다", async () => {
			const mockRequest = createMockRequest();
			const mockExecutionContext = createMockExecutionContext(mockRequest);
			const mockCallHandler = createMockCallHandler();

			const result$ = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);
			const value = await result$.toPromise();

			expect(value).toBe("test response");
			expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
				user: undefined,
				tenant: undefined,
				tenantId: undefined,
				spaceId: undefined,
			});
		});

		it("쿠키에 tenantId가 있을 때 설정한다", async () => {
			const mockRequest = createMockRequest({
				cookies: { tenantId: "test-tenant-id" },
			});
			const mockExecutionContext = createMockExecutionContext(mockRequest);
			const mockCallHandler = createMockCallHandler();

			const result$ = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);
			const value = await result$.toPromise();

			expect(value).toBe("test response");
			expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
				user: undefined,
				tenant: undefined,
				tenantId: "test-tenant-id",
				spaceId: undefined,
			});
		});

		it("유효한 사용자가 있을 때 인증 사용자를 설정한다", async () => {
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
			expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
				user: mockUser,
				tenant: { id: "tenant-1", name: "Test Tenant" },
				tenantId: "tenant-1",
				spaceId: undefined,
			});
		});

		it("사용자가 유효하지 않을 때 인증 사용자를 설정하지 않는다", async () => {
			const mockRequest = createMockRequest({
				user: { id: "user-123" }, // Missing tenants
			});
			const mockExecutionContext = createMockExecutionContext(mockRequest);
			const mockCallHandler = createMockCallHandler();

			const result$ = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);
			const value = await result$.toPromise();

			expect(value).toBe("test response");
			expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
				user: undefined,
				tenant: undefined,
				tenantId: undefined,
				spaceId: undefined,
			});
		});

		it("모든 컨텍스트 데이터를 함께 처리한다", async () => {
			const mockUser = createValidUser({
				tenants: [{ id: "test-tenant-id", name: "Test Tenant" } as any],
			});

			const mockRequest = createMockRequest({
				cookies: { tenantId: "test-tenant-id" },
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
			expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
				user: mockUser,
				tenant: { id: "test-tenant-id", name: "Test Tenant" },
				tenantId: "test-tenant-id",
				spaceId: undefined,
			});
		});

		it("헤더에서 request-id를 사용할 수 있을 때 처리한다", async () => {
			const mockRequest = createMockRequest({
				headers: { "x-request-id": "custom-request-id" },
			});
			const mockExecutionContext = createMockExecutionContext(mockRequest);
			const mockCallHandler = createMockCallHandler();

			const result$ = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);
			const value = await result$.toPromise();

			expect(value).toBe("test response");
		});

		it("컨텍스트 추출 중 오류가 발생할 때 처리한다", () => {
			const mockCallHandler = createMockCallHandler();
			const badExecutionContext = {
				switchToHttp: jest.fn().mockImplementation(() => {
					throw new Error("Context extraction failed");
				}),
				getHandler: jest.fn(),
				getClass: jest.fn(),
			} as any;

			expect(() => {
				interceptor.intercept(badExecutionContext, mockCallHandler);
			}).toThrow("Context extraction failed");
		});

		it("ContextProvider에서 오류가 발생할 때 처리한다", () => {
			(ContextProvider.setAuthContext as jest.Mock).mockImplementationOnce(
				() => {
					throw new Error("ContextProvider error");
				},
			);

			const mockRequest = createMockRequest({
				cookies: { tenantId: "test-tenant-id" },
			});
			const mockExecutionContext = createMockExecutionContext(mockRequest);
			const mockCallHandler = createMockCallHandler();

			expect(() => {
				interceptor.intercept(mockExecutionContext, mockCallHandler);
			}).toThrow(
				expect.objectContaining({
					message: "인증 컨텍스트 설정에 실패했습니다",
					status: 500,
				}),
			);
		});

		it("다운스트림 오류를 처리하고 다시 던진다", async () => {
			const testError = new Error("Downstream error");
			const mockRequest = createMockRequest();
			const mockExecutionContext = createMockExecutionContext(mockRequest);
			const mockCallHandler = {
				handle: jest.fn().mockReturnValue(throwError(() => testError)),
			};

			const result$ = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);

			await expect(result$.toPromise()).rejects.toMatchObject({
				status: HttpStatus.INTERNAL_SERVER_ERROR,
			});
		});

		it("다운스트림에서 HttpException 오류를 보존한다", async () => {
			const httpError = new HttpException(
				"Bad Request",
				HttpStatus.BAD_REQUEST,
			);
			const mockRequest = createMockRequest();
			const mockExecutionContext = createMockExecutionContext(mockRequest);
			const mockCallHandler = {
				handle: jest.fn().mockReturnValue(throwError(() => httpError)),
			};

			const result$ = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);

			await expect(result$.toPromise()).rejects.toBe(httpError);
		});

		it("Auth 옵션으로 GET 요청에 tenantId를 쿼리에 주입한다", async () => {
			const mockUser = createValidUser({
				tenants: [{ id: "tenant-1", name: "Test Tenant", main: true } as any],
			});

			const mockRequest = createMockRequest({
				user: mockUser,
				method: "GET",
				query: {},
			});
			const mockExecutionContext = createMockExecutionContext(mockRequest);
			const mockCallHandler = createMockCallHandler();

			mockReflector.getAllAndOverride.mockReturnValueOnce({
				roles: [],
				injectTenant: true,
			}); // for AUTH_OPTIONS_KEY

			const result$ = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);
			const value = await result$.toPromise();

			expect(value).toBe("test response");
			expect(mockRequest.url).toContain("tenantId=tenant-1");
			expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
				user: mockUser,
				tenant: { id: "tenant-1", name: "Test Tenant", main: true },
				tenantId: "tenant-1",
				spaceId: undefined,
			});
		});

		it("Auth 옵션으로 POST 요청에 tenantId를 body에 주입하지 않는다", async () => {
			const mockUser = createValidUser({
				tenants: [{ id: "tenant-1", name: "Test Tenant", main: true } as any],
			});

			const mockRequest = createMockRequest({
				user: mockUser,
				method: "POST",
				body: { name: "Test Category" },
			});
			const mockExecutionContext = createMockExecutionContext(mockRequest);
			const mockCallHandler = createMockCallHandler();

			mockReflector.getAllAndOverride.mockReturnValueOnce({
				roles: [],
				injectTenant: true,
			}); // for AUTH_OPTIONS_KEY

			const result$ = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);
			const value = await result$.toPromise();

			expect(value).toBe("test response");
			expect(mockRequest.body).toEqual({ name: "Test Category" });
			expect(mockRequest.body).not.toHaveProperty("tenantId");
			expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
				user: mockUser,
				tenant: { id: "tenant-1", name: "Test Tenant", main: true },
				tenantId: "tenant-1",
				spaceId: undefined,
			});
		});

		it("Auth 옵션의 injectTenant이 false일 때 테넌트 주입을 건너뛴다", async () => {
			const mockUser = createValidUser({
				tenants: [{ id: "tenant-1", name: "Test Tenant", main: true } as any],
			});

			const mockRequest = createMockRequest({
				user: mockUser,
				method: "GET",
				query: {},
			});
			const mockExecutionContext = createMockExecutionContext(mockRequest);
			const mockCallHandler = createMockCallHandler();

			mockReflector.getAllAndOverride.mockReturnValueOnce({
				roles: [],
				injectTenant: false,
			}); // for AUTH_OPTIONS_KEY

			const result$ = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);
			const value = await result$.toPromise();

			expect(value).toBe("test response");
			expect(mockRequest.url).not.toContain("tenantId");
			expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
				user: mockUser,
				tenant: { id: "tenant-1", name: "Test Tenant", main: true },
				tenantId: "tenant-1",
				spaceId: undefined,
			});
		});
	});

	describe("private methods", () => {
		it("고유한 요청 ID를 생성한다", () => {
			const id1 = (interceptor as any).generateRequestId();
			const id2 = (interceptor as any).generateRequestId();

			expect(id1).toMatch(/^req_\d+_[a-z0-9]+$/);
			expect(id2).toMatch(/^req_\d+_[a-z0-9]+$/);
			expect(id1).not.toBe(id2);
		});

		it("사용자 객체를 올바르게 검증한다", () => {
			const validUser = createValidUser();

			const invalidUsers = [
				null,
				undefined,
				{},
				{ id: "user-123" },
				{ tenants: [] },
				{ id: "user-123", tenants: null },
				{ id: "user-123", tenants: "not-array" },
			];

			expect((interceptor as any).isValidUser(validUser)).toBe(true);
			invalidUsers.forEach((user) => {
				expect((interceptor as any).isValidUser(user)).toBe(false);
			});
		});

		it("오류를 올바르게 처리한다", () => {
			const httpError = new HttpException("Test Error", HttpStatus.BAD_REQUEST);
			const regularError = new Error("Regular error");

			expect((interceptor as any).handleError(httpError)).toBe(httpError);

			const handledError = (interceptor as any).handleError(regularError);
			expect(handledError).toBeInstanceOf(HttpException);
			expect(handledError.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});
});
