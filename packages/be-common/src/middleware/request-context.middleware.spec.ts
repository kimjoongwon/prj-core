import { CONTEXT_KEYS, REQUEST_HEADER_KEYS } from "@cocrepo/constant";
import { BadRequestException } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import type { ClsService } from "nestjs-cls";

// parseAcceptLanguage 함수 mock
jest.mock("@cocrepo/toolkit", () => ({
	parseAcceptLanguage: jest.fn((lang: string | undefined) => lang || "ko_KR"),
}));

import { RequestContextMiddleware } from "./request-context.middleware";

describe("RequestContextMiddleware", () => {
	let middleware: RequestContextMiddleware;
	let mockCls: { set: jest.Mock; get: jest.Mock };
	let mockReq: Partial<Request>;
	let mockRes: Partial<Response>;
	let mockNext: jest.MockedFunction<NextFunction>;

	const createMockUser = (overrides: Record<string, unknown> = {}) => ({
		id: 101n,
		email: "test@example.com",
		tenants: [
			{
				id: 201n,
				spaceId: 301n,
				roleId: 401n,
				role: {
					name: "MEMBER",
					classification: {
						category: {
							name: "공개",
						},
					},
				},
			},
		],
		...overrides,
	});

	beforeEach(() => {
		mockCls = {
			set: jest.fn(),
			get: jest.fn(),
		};

		// RequestContextMiddleware는 더 이상 SpacesRepository, RedisService를 주입받지 않음
		middleware = new RequestContextMiddleware(mockCls as unknown as ClsService);

		mockRes = {};
		mockNext = jest.fn();
	});

	it("미들웨어가 정의되어야 한다", () => {
		expect(middleware).toBeDefined();
	});

	describe("use", () => {
		describe("인증되지 않은 요청", () => {
			it("user가 없으면 AUTH_USER/USER_ID를 undefined로 설정하고 next()를 호출해야 한다", async () => {
				// Given
				mockReq = {
					headers: {},
					user: undefined,
				} as unknown as Partial<Request>;

				// When
				await middleware.use(mockReq as Request, mockRes as Response, mockNext);

				// Then
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.AUTH_USER,
					undefined,
				);
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.USER_ID,
					undefined,
				);
				expect(mockNext).toHaveBeenCalled();
			});
		});

		describe("인증된 요청", () => {
			it("user가 있으면 AUTH_USER/USER_ID를 설정해야 한다", async () => {
				// Given
				const user = createMockUser();
				mockReq = {
					headers: { [REQUEST_HEADER_KEYS.TENANT_ID]: "201" },
					user,
				} as unknown as Partial<Request>;

				// When
				await middleware.use(mockReq as Request, mockRes as Response, mockNext);

				// Then
				expect(mockCls.set).toHaveBeenCalledWith(CONTEXT_KEYS.AUTH_USER, user);
				expect(mockCls.set).toHaveBeenCalledWith(CONTEXT_KEYS.USER_ID, 101n);
				expect(mockNext).toHaveBeenCalled();
			});
		});

		describe("언어 설정", () => {
			it("LANGUAGE 컨텍스트가 설정되어야 한다", async () => {
				// Given
				mockReq = {
					headers: { "x-language": "ko_KR" },
					user: undefined,
				} as unknown as Partial<Request>;

				// When
				await middleware.use(mockReq as Request, mockRes as Response, mockNext);

				// Then - parseAcceptLanguage 결과가 LANGUAGE에 설정됨
				const languageCall = mockCls.set.mock.calls.find(
					([key]: [string]) => key === CONTEXT_KEYS.LANGUAGE,
				);
				expect(languageCall).toBeDefined();
			});
		});

		describe("Space/Tenant 설정", () => {
			it("x-tenant-id와 매칭되는 tenant가 있으면 TENANT를 설정해야 한다", async () => {
				// Given
				const user = createMockUser();
				mockReq = {
					headers: { [REQUEST_HEADER_KEYS.TENANT_ID]: "201" },
					user,
				} as unknown as Partial<Request>;

				// When
				await middleware.use(mockReq as Request, mockRes as Response, mockNext);

				// Then
				expect(mockCls.set).toHaveBeenCalledWith(CONTEXT_KEYS.SPACE_ID, 301n);
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.TENANT,
					user.tenants[0],
				);
				expect(mockCls.set).toHaveBeenCalledWith(CONTEXT_KEYS.TENANT_ID, 201n);
			});

			it("x-tenant-id로 지정한 PLATFORM_ADMIN tenant를 저장해야 한다", async () => {
				// Given
				const user = createMockUser({
					tenants: [
						{
							id: 202n,
							spaceId: 301n,
							roleId: 402n,
							role: { name: "MEMBER" },
						},
						{
							id: 203n,
							spaceId: 301n,
							roleId: 403n,
							role: { name: "PLATFORM_ADMIN" },
						},
					],
				});
				mockReq = {
					headers: {
						[REQUEST_HEADER_KEYS.TENANT_ID]: "203",
					},
					user,
				} as unknown as Partial<Request>;

				// When
				await middleware.use(mockReq as Request, mockRes as Response, mockNext);

				// Then
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.TENANT,
					user.tenants[1],
				);
			});

			it("x-tenant-id의 tenant가 제거되었으면 TENANT를 undefined로 설정해야 한다", async () => {
				// Given
				const user = createMockUser({
					tenants: [
						{
							id: 204n,
							spaceId: 301n,
							roleId: 404n,
							role: { name: "PLATFORM_ADMIN" },
							removedAt: new Date(),
						},
					],
				});
				mockReq = {
					headers: { [REQUEST_HEADER_KEYS.TENANT_ID]: "204" },
					user,
				} as unknown as Partial<Request>;

				// When
				await middleware.use(mockReq as Request, mockRes as Response, mockNext);

				// Then
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.TENANT,
					undefined,
				);
			});

			it("x-tenant-id가 없으면 SPACE_ID를 undefined로 설정해야 한다", async () => {
				// Given
				const user = createMockUser();
				mockReq = { headers: {}, user } as unknown as Partial<Request>;

				// When
				await middleware.use(mockReq as Request, mockRes as Response, mockNext);

				// Then
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.SPACE_ID,
					undefined,
				);
			});

			it("x-tenant-id와 매칭되는 tenant가 없으면 TENANT를 undefined로 설정해야 한다", async () => {
				// Given
				const user = createMockUser();
				mockReq = {
					headers: { [REQUEST_HEADER_KEYS.TENANT_ID]: "999" },
					user,
				} as unknown as Partial<Request>;

				// When
				await middleware.use(mockReq as Request, mockRes as Response, mockNext);

				// Then
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.TENANT,
					undefined,
				);
			});
		});

		describe("에러 처리", () => {
			it.each([
				"0",
				"0201",
				"-1",
				"tenant-1",
				"9223372036854775808",
			])("x-tenant-id가 canonical decimal ID가 아니면 400으로 거부해야 한다: %s", (invalidTenantId) => {
				// Given
				mockReq = {
					headers: {
						[REQUEST_HEADER_KEYS.TENANT_ID]: invalidTenantId,
					},
					user: createMockUser(),
				} as unknown as Partial<Request>;

				// When & Then
				expect(() =>
					middleware.use(mockReq as Request, mockRes as Response, mockNext),
				).toThrow(BadRequestException);
				expect(mockNext).not.toHaveBeenCalled();
			});

			it("setRequestContext에서 예외가 발생해도 next()를 호출해야 한다", async () => {
				// Given - cls.set에서 에러 발생 시뮬레이션
				mockCls.set.mockImplementationOnce(() => {
					throw new Error("CLS 에러");
				});
				mockReq = {
					headers: { [REQUEST_HEADER_KEYS.TENANT_ID]: "201" },
					user: createMockUser(),
				} as unknown as Partial<Request>;

				// When
				await middleware.use(mockReq as Request, mockRes as Response, mockNext);

				// Then
				expect(mockNext).toHaveBeenCalled();
			});
		});
	});
});
