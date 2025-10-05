import { type CallHandler, type ExecutionContext } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { UserDto } from "@shared/schema";
import { of } from "rxjs";
import { ContextProvider } from "../provider";
import { SpaceContextInterceptor } from "./space-context.interceptor";

// Mock ContextProvider
jest.mock("../provider", () => ({
	ContextProvider: {
		setAuthContext: jest.fn(),
	},
}));

describe("SpaceContextInterceptor", () => {
	let interceptor: SpaceContextInterceptor;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [SpaceContextInterceptor],
		}).compile();

		interceptor = module.get<SpaceContextInterceptor>(SpaceContextInterceptor);

		// Clear all mocks
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
		it("X-Space-ID 헤더가 없으면 기본 컨텍스트를 설정한다", async () => {
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
				tenant: undefined,
				tenantId: undefined,
				spaceId: undefined,
			});
		});

		it("사용자 정보가 없으면 기본 컨텍스트를 설정한다", async () => {
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
			expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
				user: undefined,
				tenant: undefined,
				tenantId: undefined,
				spaceId: undefined,
			});
		});

		it("사용자에게 tenants가 없으면 기본 컨텍스트를 설정한다", async () => {
			const mockUser = { id: "user-123" }; // tenants 없음
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
			expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
				user: mockUser,
				tenant: undefined,
				tenantId: undefined,
				spaceId: undefined,
			});
		});

		it("유효한 spaceId로 요청하면 컨텍스트를 설정한다", async () => {
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
			expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
				user: mockUser,
				tenant: { id: "tenant-1", name: "Test Tenant 1", spaceId: "space-123" },
				tenantId: "tenant-1",
				spaceId: "space-123",
			});
		});

		it("사용자가 접근 권한이 없는 spaceId로 요청하면 null로 설정한다", async () => {
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
			expect(ContextProvider.setAuthContext).toHaveBeenCalledWith({
				user: mockUser,
				tenant: undefined,
				tenantId: undefined,
				spaceId: "unauthorized-space",
			});
		});

		it("ContextProvider.setAuthContext에서 오류가 발생하면 기본 컨텍스트로 설정한다", async () => {
			(ContextProvider.setAuthContext as jest.Mock).mockImplementationOnce(
				() => {
					throw new Error("ContextProvider error");
				},
			);

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
			// 에러 발생 후 기본 컨텍스트로 재설정
			expect(ContextProvider.setAuthContext).toHaveBeenLastCalledWith({
				user: mockUser,
				tenant: undefined,
				tenantId: undefined,
				spaceId: undefined,
			});
		});

		it("여러 tenant가 있는 사용자에서 올바른 spaceId로 tenant를 찾는다", async () => {
			const mockUser = createValidUser();
			const mockRequest = createMockRequest({
				headers: { "x-space-id": "space-456" }, // 두 번째 tenant의 spaceId
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
				tenant: { id: "tenant-2", name: "Test Tenant 2", spaceId: "space-456" },
				tenantId: "tenant-2",
				spaceId: "space-456",
			});
		});

		it("대소문자를 구분하여 spaceId를 매칭한다", async () => {
			const mockUser = createValidUser();
			const mockRequest = createMockRequest({
				headers: { "x-space-id": "SPACE-123" }, // 대문자로 요청
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
				tenant: undefined,
				tenantId: undefined,
				spaceId: "SPACE-123",
			});
		});
	});
});
