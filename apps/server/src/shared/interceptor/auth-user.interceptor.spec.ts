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

// Mock ContextProvider
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
	let mockExecutionContext: ExecutionContext;
	let mockCallHandler: CallHandler;
	let mockRequest: any;
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

		// Mock request object
		mockRequest = {
			cookies: {},
			headers: {},
			user: null,
		};

		// Mock ExecutionContext
		mockExecutionContext = {
			switchToHttp: jest.fn().mockReturnValue({
				getRequest: jest.fn().mockReturnValue(mockRequest),
			}),
			getHandler: jest.fn(),
			getClass: jest.fn(),
		} as any;

		// Mock CallHandler
		mockCallHandler = {
			handle: jest.fn().mockReturnValue(of("test response")),
		};

		// Clear all mocks
		jest.clearAllMocks();
	});

	describe("intercept", () => {
		it("should handle request without authentication context", (done) => {
			const result = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);

			result.subscribe({
				next: (value) => {
					expect(value).toBe("test response");
					expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
						user: undefined,
						tenant: undefined,
						tenantId: undefined,
						spaceId: undefined,
					});
					done();
				},
			});
		});

		it("should set tenantId when present in cookies", (done) => {
			mockRequest.cookies = { tenantId: "test-tenant-id" };

			const result = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);

			result.subscribe({
				next: (value) => {
					expect(value).toBe("test response");
					expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
						user: undefined,
						tenant: undefined,
						tenantId: "test-tenant-id",
						spaceId: undefined,
					});
					done();
				},
			});
		});

		it("should set auth user when valid user is present", (done) => {
			const mockUser: UserDto = {
				id: "user-123",
				spaceId: "space-123",
				email: "test@example.com",
				name: "Test User",
				phone: "123-456-7890",
				password: "password",
				createdAt: new Date(),
				updatedAt: new Date(),
				tenants: [{ id: "tenant-1", name: "Test Tenant" } as any],
			} as UserDto;

			mockRequest.user = mockUser;

			const result = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);

			result.subscribe({
				next: (value) => {
					expect(value).toBe("test response");
					expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
						user: mockUser,
						tenant: { id: "tenant-1", name: "Test Tenant" },
						tenantId: "tenant-1",
						spaceId: undefined,
					});
					done();
				},
			});
		});

		it("should not set auth user when user is invalid", (done) => {
			mockRequest.user = { id: "user-123" }; // Missing tenants

			const result = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);

			result.subscribe({
				next: (value) => {
					expect(value).toBe("test response");
					expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
						user: undefined,
						tenant: undefined,
						tenantId: undefined,
						spaceId: undefined,
					});
					done();
				},
			});
		});

		it("should handle all context data together", (done) => {
			const mockUser: UserDto = {
				id: "user-123",
				spaceId: "space-123",
				email: "test@example.com",
				name: "Test User",
				phone: "123-456-7890",
				password: "password",
				createdAt: new Date(),
				updatedAt: new Date(),
				tenants: [{ id: "test-tenant-id", name: "Test Tenant" } as any],
			} as UserDto;

			mockRequest.cookies = {
				tenantId: "test-tenant-id",
			};
			mockRequest.user = mockUser;

			const result = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);

			result.subscribe({
				next: (value) => {
					expect(value).toBe("test response");
					expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
						user: mockUser,
						tenant: { id: "test-tenant-id", name: "Test Tenant" },
						tenantId: "test-tenant-id",
						spaceId: undefined,
					});
					done();
				},
			});
		});

		it("should use request-id from headers when available", (done) => {
			mockRequest.headers = { "x-request-id": "custom-request-id" };

			const result = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);

			result.subscribe({
				next: (value) => {
					expect(value).toBe("test response");
					done();
				},
			});
		});

		it("should handle errors during context extraction", () => {
			// Mock a problematic request that causes an error
			mockExecutionContext.switchToHttp = jest.fn().mockImplementation(() => {
				throw new Error("Context extraction failed");
			});

			expect(() => {
				interceptor.intercept(mockExecutionContext, mockCallHandler);
			}).toThrow("Context extraction failed");
		});

		it("should handle errors from ContextProvider", () => {
			(ContextProvider.setAuthContext as jest.Mock).mockImplementation(() => {
				throw new Error("ContextProvider error");
			});

			mockRequest.cookies = { tenantId: "test-tenant-id" };

			expect(() => {
				interceptor.intercept(mockExecutionContext, mockCallHandler);
			}).toThrow(
				expect.objectContaining({
					message: "Failed to set authentication context",
					status: 500,
				}),
			);
		});

		it("should handle downstream errors and re-throw them", (done) => {
			const testError = new Error("Downstream error");
			mockCallHandler.handle = jest
				.fn()
				.mockReturnValue(throwError(() => testError));

			const result = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);

			result.subscribe({
				error: (error) => {
					expect(error).toBeInstanceOf(HttpException);
					expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
					done();
				},
			});
		});

		it("should preserve HttpException errors from downstream", (done) => {
			const httpError = new HttpException(
				"Bad Request",
				HttpStatus.BAD_REQUEST,
			);
			mockCallHandler.handle = jest
				.fn()
				.mockReturnValue(throwError(() => httpError));

			const result = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);

			result.subscribe({
				error: (error) => {
					expect(error).toBe(httpError);
					expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
					done();
				},
			});
		});

		it("should inject tenantId to query for GET requests with Auth options", (done) => {
			const mockUser: UserDto = {
				id: "user-123",
				spaceId: "space-123",
				email: "test@example.com",
				name: "Test User",
				phone: "123-456-7890",
				password: "password",
				createdAt: new Date(),
				updatedAt: new Date(),
				tenants: [{ id: "tenant-1", name: "Test Tenant", main: true } as any],
			} as UserDto;

			mockRequest.user = mockUser;
			mockRequest.method = "GET";
			mockRequest.query = {};

			// Mock both @InjectTenantId and Auth options
			mockReflector.getAllAndOverride
				.mockReturnValueOnce(false) // for INJECT_TENANT_ID_KEY
				.mockReturnValueOnce({       // for AUTH_OPTIONS_KEY
					roles: [],
					injectTenant: true,
				});

			const result = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);

			result.subscribe({
				next: (value) => {
					expect(value).toBe("test response");
					expect(mockRequest.query.tenantId).toBe("tenant-1");
					expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
						user: mockUser,
						tenant: { id: "tenant-1", name: "Test Tenant", main: true },
						tenantId: "tenant-1",
						spaceId: undefined,
					});
					done();
				},
			});
		});

		it("should NOT inject tenantId to body for POST requests with Auth options", (done) => {
			const mockUser: UserDto = {
				id: "user-123",
				spaceId: "space-123",
				email: "test@example.com",
				name: "Test User",
				phone: "123-456-7890",
				password: "password",
				createdAt: new Date(),
				updatedAt: new Date(),
				tenants: [{ id: "tenant-1", name: "Test Tenant", main: true } as any],
			} as UserDto;

			mockRequest.user = mockUser;
			mockRequest.method = "POST";
			mockRequest.body = { name: "Test Category" };

			// Mock both @InjectTenantId and Auth options
			mockReflector.getAllAndOverride
				.mockReturnValueOnce(false) // for INJECT_TENANT_ID_KEY
				.mockReturnValueOnce({       // for AUTH_OPTIONS_KEY
					roles: [],
					injectTenant: true,
				});

			const result = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);

			result.subscribe({
				next: (value) => {
					expect(value).toBe("test response");
					expect(mockRequest.body).toEqual({ name: "Test Category" });
					expect(mockRequest.body.tenantId).toBeUndefined();
					expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
						user: mockUser,
						tenant: { id: "tenant-1", name: "Test Tenant", main: true },
						tenantId: "tenant-1",
						spaceId: undefined,
					});
					done();
				},
			});
		});

		it("should skip tenant injection when Auth options injectTenant is false", (done) => {
			const mockUser: UserDto = {
				id: "user-123",
				spaceId: "space-123",
				email: "test@example.com",
				name: "Test User",
				phone: "123-456-7890",
				password: "password",
				createdAt: new Date(),
				updatedAt: new Date(),
				tenants: [{ id: "tenant-1", name: "Test Tenant", main: true } as any],
			} as UserDto;

			mockRequest.user = mockUser;
			mockRequest.method = "GET";
			mockRequest.query = {};

			// Mock both @InjectTenantId and Auth options
			mockReflector.getAllAndOverride
				.mockReturnValueOnce(false) // for INJECT_TENANT_ID_KEY
				.mockReturnValueOnce({       // for AUTH_OPTIONS_KEY
					roles: [],
					injectTenant: false,
				});

			const result = interceptor.intercept(
				mockExecutionContext,
				mockCallHandler,
			);

			result.subscribe({
				next: (value) => {
					expect(value).toBe("test response");
					// tenantId is still set in context but NOT injected to query due to injectTenant: false
					expect(mockRequest.query.tenantId).toBeUndefined();
					expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
						user: mockUser,
						tenant: { id: "tenant-1", name: "Test Tenant", main: true },
						tenantId: "tenant-1",
						spaceId: undefined,
					});
					done();
				},
			});
		});
	});

	describe("private methods", () => {
		it("should generate unique request IDs", () => {
			const id1 = (interceptor as any).generateRequestId();
			const id2 = (interceptor as any).generateRequestId();

			expect(id1).toMatch(/^req_\d+_[a-z0-9]+$/);
			expect(id2).toMatch(/^req_\d+_[a-z0-9]+$/);
			expect(id1).not.toBe(id2);
		});

		it("should validate user objects correctly", () => {
			const validUser: UserDto = {
				id: "user-123",
				spaceId: "space-123",
				email: "test@example.com",
				name: "Test User",
				phone: "123-456-7890",
				password: "password",
				createdAt: new Date(),
				updatedAt: new Date(),
				tenants: [{ id: "tenant-1", name: "Test Tenant" } as any],
			} as UserDto;

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

		it("should handle errors correctly", () => {
			const httpError = new HttpException("Test Error", HttpStatus.BAD_REQUEST);
			const regularError = new Error("Regular error");

			expect((interceptor as any).handleError(httpError)).toBe(httpError);

			const handledError = (interceptor as any).handleError(regularError);
			expect(handledError).toBeInstanceOf(HttpException);
			expect(handledError.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
		});
	});
});
