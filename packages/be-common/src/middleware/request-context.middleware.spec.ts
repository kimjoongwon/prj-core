import { CONTEXT_KEYS } from "@cocrepo/constant";
import type { NextFunction, Request, Response } from "express";

// import 체인의 masking.interceptor 로드 에러를 회피하기 위한 mock
jest.mock("@cocrepo/be-i18n", () => ({
	parseAcceptLanguage: jest.fn((lang: string | undefined) => lang || "ko_KR"),
}));
jest.mock("@cocrepo/repository", () => ({
	SpacesRepository: jest.fn(),
}));
jest.mock("@cocrepo/service", () => ({
	RedisService: jest.fn(),
}));

import { RequestContextMiddleware } from "./request-context.middleware";

describe("RequestContextMiddleware", () => {
	let middleware: RequestContextMiddleware;
	let mockCls: { set: jest.Mock; get: jest.Mock };
	let mockSpacesRepository: { findSpaceIdsByCategoryHierarchy: jest.Mock };
	let mockRedisService: { get: jest.Mock; set: jest.Mock };
	let mockReq: Partial<Request>;
	let mockRes: Partial<Response>;
	let mockNext: jest.MockedFunction<NextFunction>;

	const createMockUser = (overrides: any = {}) => ({
		id: "user-1",
		email: "test@example.com",
		tenants: [
			{
				id: "tenant-1",
				spaceId: "space-001",
				role: {
					name: "VIEW",
					classification: {
						category: {
							name: "공개",
							parent: { name: "공유" },
							children: [],
						},
					},
					associations: [{ group: { name: "일반" } }],
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

		mockSpacesRepository = {
			findSpaceIdsByCategoryHierarchy: jest.fn().mockResolvedValue([]),
		};

		mockRedisService = {
			get: jest.fn().mockResolvedValue(null),
			set: jest.fn().mockResolvedValue(undefined),
		};

		middleware = new RequestContextMiddleware(
			mockCls as any,
			mockSpacesRepository as any,
			mockRedisService as any,
		);

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
				mockReq = { headers: {}, user: undefined } as any;

				// When
				await middleware.use(
					mockReq as Request,
					mockRes as Response,
					mockNext,
				);

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
					headers: { "x-space-id": "space-001" },
					user,
				} as any;

				// When
				await middleware.use(
					mockReq as Request,
					mockRes as Response,
					mockNext,
				);

				// Then
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.AUTH_USER,
					user,
				);
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.USER_ID,
					"user-1",
				);
				expect(mockNext).toHaveBeenCalled();
			});
		});

		describe("언어 설정", () => {
			it("LANGUAGE 컨텍스트가 설정되어야 한다", async () => {
				// Given
				mockReq = {
					headers: { "x-language": "ko_KR" },
					user: undefined,
				} as any;

				// When
				await middleware.use(
					mockReq as Request,
					mockRes as Response,
					mockNext,
				);

				// Then - parseAcceptLanguage 결과가 LANGUAGE에 설정됨
				const languageCall = mockCls.set.mock.calls.find(
					([key]: [string]) => key === CONTEXT_KEYS.LANGUAGE,
				);
				expect(languageCall).toBeDefined();
			});
		});

		describe("Space/Tenant 설정", () => {
			it("X-Space-ID와 매칭되는 tenant가 있으면 TENANT를 설정해야 한다", async () => {
				// Given
				const user = createMockUser();
				mockReq = {
					headers: { "x-space-id": "space-001" },
					user,
				} as any;

				// When
				await middleware.use(
					mockReq as Request,
					mockRes as Response,
					mockNext,
				);

				// Then
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.SPACE_ID,
					"space-001",
				);
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.TENANT,
					user.tenants[0],
				);
			});

			it("X-Space-ID가 없으면 SPACE_ID를 undefined로 설정해야 한다", async () => {
				// Given
				const user = createMockUser();
				mockReq = { headers: {}, user } as any;

				// When
				await middleware.use(
					mockReq as Request,
					mockRes as Response,
					mockNext,
				);

				// Then
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.SPACE_ID,
					undefined,
				);
			});

			it("X-Space-ID와 매칭되는 tenant가 없으면 TENANT를 undefined로 설정해야 한다", async () => {
				// Given
				const user = createMockUser();
				mockReq = {
					headers: { "x-space-id": "non-existent-space" },
					user,
				} as any;

				// When
				await middleware.use(
					mockReq as Request,
					mockRes as Response,
					mockNext,
				);

				// Then
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.TENANT,
					undefined,
				);
			});

			it("ACCESSIBLE_SPACE_IDS를 사용자의 모든 tenant spaceIds로 설정해야 한다", async () => {
				// Given
				const user = createMockUser({
					tenants: [
						{
							id: "tenant-1",
							spaceId: "space-001",
							role: { name: "VIEW" },
						},
						{
							id: "tenant-2",
							spaceId: "space-002",
							role: { name: "MANAGE" },
						},
					],
				});
				mockReq = {
					headers: { "x-space-id": "space-001" },
					user,
				} as any;

				// When
				await middleware.use(
					mockReq as Request,
					mockRes as Response,
					mockNext,
				);

				// Then
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.ACCESSIBLE_SPACE_IDS,
					expect.arrayContaining(["space-001", "space-002"]),
				);
			});
		});

		describe("역할 컨텍스트 설정", () => {
			it("tenant의 역할 정보를 CLS에 설정해야 한다", async () => {
				// Given
				const user = createMockUser();
				mockReq = {
					headers: { "x-space-id": "space-001" },
					user,
				} as any;

				// When
				await middleware.use(
					mockReq as Request,
					mockRes as Response,
					mockNext,
				);

				// Then
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.ROLE_NAME,
					"VIEW",
				);
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.ROLE_CATEGORY,
					"공개",
				);
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.ROLE_GROUP_NAMES,
					["일반"],
				);
			});

			it("tenant에 역할이 없으면 역할 정보를 undefined로 설정해야 한다", async () => {
				// Given
				const user = createMockUser({
					tenants: [{ id: "tenant-1", spaceId: "space-001", role: null }],
				});
				mockReq = {
					headers: { "x-space-id": "space-001" },
					user,
				} as any;

				// When
				await middleware.use(
					mockReq as Request,
					mockRes as Response,
					mockNext,
				);

				// Then
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.ROLE_NAME,
					undefined,
				);
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.ROLE_CATEGORY,
					undefined,
				);
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.ROLE_GROUP_NAMES,
					undefined,
				);
			});
		});

		describe("Space 하위 계층 ID 설정", () => {
			it("Redis 캐시가 있으면 캐시된 값을 사용해야 한다", async () => {
				// Given
				const user = createMockUser();
				mockReq = {
					headers: { "x-space-id": "space-001" },
					user,
				} as any;
				mockRedisService.get.mockResolvedValue(
					JSON.stringify(["space-001", "space-child-1"]),
				);

				// When
				await middleware.use(
					mockReq as Request,
					mockRes as Response,
					mockNext,
				);

				// Then
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.DESCENDANT_SPACE_IDS,
					["space-001", "space-child-1"],
				);
				expect(
					mockSpacesRepository.findSpaceIdsByCategoryHierarchy,
				).not.toHaveBeenCalled();
			});

			it("Redis 캐시가 없으면 DB에서 조회하고 캐시를 설정해야 한다", async () => {
				// Given
				const user = createMockUser();
				mockReq = {
					headers: { "x-space-id": "space-001" },
					user,
				} as any;
				mockRedisService.get.mockResolvedValue(null);
				mockSpacesRepository.findSpaceIdsByCategoryHierarchy.mockResolvedValue(
					["space-001", "space-child-2"],
				);

				// When
				await middleware.use(
					mockReq as Request,
					mockRes as Response,
					mockNext,
				);

				// Then
				expect(
					mockSpacesRepository.findSpaceIdsByCategoryHierarchy,
				).toHaveBeenCalledWith("space-001");
				expect(mockRedisService.set).toHaveBeenCalledWith(
					"space:descendants:space-001",
					JSON.stringify(["space-001", "space-child-2"]),
					600,
				);
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.DESCENDANT_SPACE_IDS,
					["space-001", "space-child-2"],
				);
			});

			it("Redis/DB 조회가 실패하면 현재 spaceId만 포함해야 한다", async () => {
				// Given
				const user = createMockUser();
				mockReq = {
					headers: { "x-space-id": "space-001" },
					user,
				} as any;
				mockRedisService.get.mockRejectedValue(
					new Error("Redis 연결 실패"),
				);

				// When
				await middleware.use(
					mockReq as Request,
					mockRes as Response,
					mockNext,
				);

				// Then
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.DESCENDANT_SPACE_IDS,
					["space-001"],
				);
				expect(mockNext).toHaveBeenCalled();
			});
		});

		describe("에러 처리", () => {
			it("setRequestContext에서 예외가 발생해도 next()를 호출해야 한다", async () => {
				// Given - cls.set에서 에러 발생 시뮬레이션
				mockCls.set.mockImplementationOnce(() => {
					throw new Error("CLS 에러");
				});
				mockReq = {
					headers: { "x-space-id": "space-001" },
					user: createMockUser(),
				} as any;

				// When
				await middleware.use(
					mockReq as Request,
					mockRes as Response,
					mockNext,
				);

				// Then
				expect(mockNext).toHaveBeenCalled();
			});
		});

		describe("이용자 속성 컨텍스트 설정", () => {
			it("user에 classification이 있으면 USER_CATEGORY를 설정해야 한다", async () => {
				// Given
				const user = createMockUser({
					classification: {
						category: { name: "일반" },
						categoryId: "cat-1",
					},
					associations: [
						{ groupId: "grp-1", group: { name: "그룹A" } },
					],
				});
				mockReq = {
					headers: { "x-space-id": "space-001" },
					user,
				} as any;

				// When
				await middleware.use(
					mockReq as Request,
					mockRes as Response,
					mockNext,
				);

				// Then
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.USER_CATEGORY,
					"일반",
				);
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.USER_CATEGORY_ID,
					"cat-1",
				);
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.USER_GROUP_IDS,
					["grp-1"],
				);
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.USER_GROUP_NAMES,
					["그룹A"],
				);
			});

			it("user에 associations가 없으면 빈 배열을 설정해야 한다", async () => {
				// Given
				const user = createMockUser();
				mockReq = {
					headers: { "x-space-id": "space-001" },
					user,
				} as any;

				// When
				await middleware.use(
					mockReq as Request,
					mockRes as Response,
					mockNext,
				);

				// Then
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.USER_GROUP_IDS,
					[],
				);
				expect(mockCls.set).toHaveBeenCalledWith(
					CONTEXT_KEYS.USER_GROUP_NAMES,
					[],
				);
			});
		});
	});
});
