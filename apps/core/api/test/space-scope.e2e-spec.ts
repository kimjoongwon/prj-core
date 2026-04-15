import { PRISMA_SERVICE_TOKEN, SYSTEM_ROLES } from "@cocrepo/constant";
import { UsersRepository, TasksRepository, SpacesRepository } from "@cocrepo/repository";
import {
	AuthCacheService,
	JwtStrategy,
	SpaceContext,
	TaskService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import { SpaceScope } from "@cocrepo/dto";
import { SpaceCategoryName } from "@cocrepo/enum";
import {
	Controller,
	Get,
	HttpStatus,
	Query,
	UnauthorizedException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { INestApplication, Injectable } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/module/app.module";
import { setNestApp } from "../src/setNestApp";

const TEST_JWT_SECRET = "test-jwt-secret-e2e";
const USER_ID = "00000000-0000-4000-8000-000000000001";
const TENANT_A_ID = "10000000-0000-4000-8000-000000000001";
const TENANT_B_ID = "20000000-0000-4000-8000-000000000001";
const TENANT_C_ID = "30000000-0000-4000-8000-000000000001";
const SPACE_A_ID = "11111111-1111-4111-8111-111111111111";
const SPACE_B_ID = "22222222-2222-4222-8222-222222222222";
const SPACE_C_ID = "33333333-3333-4333-8333-333333333333";
const SPACE_D_ID = "44444444-4444-4444-8444-444444444444";

function createTestUser() {
	return {
		id: USER_ID,
		email: "scope-e2e@example.com",
		tenants: [
			{
				id: TENANT_A_ID,
				spaceId: SPACE_A_ID,
				role: { name: SYSTEM_ROLES.MANAGE },
				space: {
					classification: {
						category: {
							name: SpaceCategoryName.BRANCH.name,
						},
					},
				},
			},
			{
				id: TENANT_B_ID,
				spaceId: SPACE_B_ID,
				role: { name: SYSTEM_ROLES.FULL_ACCESS },
				space: {
					classification: {
						category: {
							name: SpaceCategoryName.ROOT.name,
						},
					},
				},
			},
			{
				id: TENANT_C_ID,
				spaceId: SPACE_C_ID,
				role: { name: SYSTEM_ROLES.FULL_ACCESS },
				space: {
					classification: {
						category: {
							name: SpaceCategoryName.BRANCH.name,
						},
					},
				},
			},
		],
	};
}

@Injectable()
class ScopeTestJwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: TEST_JWT_SECRET,
			algorithms: ["HS256"],
		});
	}

	async validate(payload: { user: ReturnType<typeof createTestUser> }) {
		return payload.user;
	}
}

@Controller("api/v1/test-space-scope")
class SpaceScopeTestController {
	constructor(
		private readonly spaceContext: SpaceContext,
		private readonly userService: UserService,
		private readonly taskService: TaskService,
	) {}

	@Get("context")
	getContext() {
		return {
			spaceId: this.spaceContext.spaceId ?? null,
			spaceIds: this.spaceContext.spaceIds ?? null,
			tenantRole: this.spaceContext.tenant?.role?.name ?? null,
		};
	}

	@Get("users")
	async probeUsers() {
		return this.userService.getUsersBySpace({
			skip: 0,
			take: 10,
			toPrismaWhere: (baseWhere: unknown) => baseWhere,
			toPrismaOrderBy: () => [],
		} as never);
	}

	@Get("tasks")
	async probeTasks(@Query("spaceScope") spaceScope?: SpaceScope) {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException("SPACE_NOT_SELECTED");
		}

		return this.taskService.findTasks({
			spaceId,
			spaceScope: spaceScope ?? SpaceScope.CURRENT,
			skip: 0,
			take: 10,
		});
	}
}

describe("Space Scope API (E2E)", () => {
	let app: INestApplication;
	let jwtToken: string;

	const usersRepoCalls: Array<Record<string, unknown>> = [];
	const tasksRepoCalls: Array<Record<string, unknown>> = [];
	const spacesRepoCalls: Array<Record<string, unknown>> = [];

	const usersRepositoryMock = {
		findManyBySpaceIds: async (params: Record<string, unknown>) => {
			usersRepoCalls.push({ type: "findManyBySpaceIds", ...params });
			return { users: [], totalCount: 0 };
		},
		countStatsBySpaceIds: async (
			params?: Record<string, unknown>,
		) => {
			usersRepoCalls.push({ type: "countStatsBySpaceIds", ...(params ?? {}) });
			return {
				total: 0,
				active: 0,
				inactive: 0,
				newThisMonth: 0,
			};
		},
	};

	const tasksRepositoryMock = {
		findManyTasks: async (params: Record<string, unknown>) => {
			tasksRepoCalls.push({ type: "findManyTasks", ...params });
			return [[], 0];
		},
	};

	const spacesRepositoryMock = {
		findManyWithGround: async (params?: Record<string, unknown>) => {
			spacesRepoCalls.push({ type: "findManyWithGround", ...(params ?? {}) });
			return [[], 0];
		},
		findGroundBySpaceId: async (spaceId: string) => {
			spacesRepoCalls.push({ type: "findGroundBySpaceId", spaceId });
			return {
				id: "44444444-4444-4444-8444-444444444444",
				spaceId,
				name: `Ground ${spaceId.slice(0, 4)}`,
				label: null,
				address: "Seoul",
				phone: "02-1234-5678",
				email: "scope-ground@example.com",
				businessNo: "1234567890",
				logoImageFileId: null,
				imageFileId: null,
				removedAt: null,
			};
		},
	};

	beforeAll(async () => {
		const jwtService = new JwtService({ secret: TEST_JWT_SECRET });
		jwtToken = jwtService.sign({
			sub: USER_ID,
			user: createTestUser(),
		});

		const moduleBuilder = Test.createTestingModule({
			imports: [AppModule],
			controllers: [SpaceScopeTestController],
			providers: [
				SpaceContext,
				UserService,
				TaskService,
				{
					provide: AuthCacheService,
					useValue: {
						invalidate: async () => {},
					},
				},
				{
					provide: UsersRepository,
					useValue: usersRepositoryMock,
				},
				{
					provide: TasksRepository,
					useValue: tasksRepositoryMock,
				},
				{
					provide: SpacesRepository,
					useValue: spacesRepositoryMock,
				},
			],
		})
			.overrideProvider(PRISMA_SERVICE_TOKEN)
			.useValue({})
			.overrideProvider(AuthCacheService)
			.useValue({
				invalidate: async () => {},
			})
			.overrideProvider(JwtStrategy)
			.useClass(ScopeTestJwtStrategy)
			.overrideProvider(TokenStorageService)
			.useValue({
				isBlacklisted: async () => false,
			})
			.overrideProvider(UsersRepository)
			.useValue(usersRepositoryMock)
			.overrideProvider(TasksRepository)
			.useValue(tasksRepositoryMock)
			.overrideProvider(SpacesRepository)
			.useValue(spacesRepositoryMock);

		const moduleFixture: TestingModule = await moduleBuilder.compile();
		app = moduleFixture.createNestApplication();
		setNestApp(app);
		await app.init();
	}, 60000);

	beforeEach(() => {
		usersRepoCalls.length = 0;
		tasksRepoCalls.length = 0;
		spacesRepoCalls.length = 0;
	});

	afterAll(async () => {
		if (app) {
			await app.close();
		}
	}, 30000);

	it("비 FULL_ACCESS tenant면 현재 x-space-id 한 개만 EFFECTIVE_SPACE_IDS로 사용한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/test-space-scope/context")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_A_ID);

		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body.data).toEqual({
			spaceId: SPACE_A_ID,
			spaceIds: [SPACE_A_ID],
			tenantRole: SYSTEM_ROLES.MANAGE,
		});
	});

	it("ROOT Space의 FULL_ACCESS tenant면 EFFECTIVE_SPACE_IDS를 전체 조회로 연다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/test-space-scope/context")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_B_ID);

		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body.data).toEqual({
			spaceId: SPACE_B_ID,
			spaceIds: null,
			tenantRole: SYSTEM_ROLES.FULL_ACCESS,
		});
	});

	it("BRANCH에 미러된 FULL_ACCESS tenant면 EFFECTIVE_SPACE_IDS를 현재 space 1개로 유지한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/test-space-scope/context")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_C_ID);

		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body.data).toEqual({
			spaceId: SPACE_C_ID,
			spaceIds: [SPACE_C_ID],
			tenantRole: SYSTEM_ROLES.FULL_ACCESS,
		});
	});

	it("비 FULL_ACCESS 사용자의 users 조회는 현재 spaceId만 repository로 전달한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/test-space-scope/users")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_A_ID);

		expect(response.status).toBe(HttpStatus.OK);
		expect(usersRepoCalls[0]).toMatchObject({
			type: "findManyBySpaceIds",
			spaceIds: [SPACE_A_ID],
			where: {
				tenants: {
					some: {
						spaceId: { in: [SPACE_A_ID] },
						removedAt: null,
						role: {
							name: { notIn: [SYSTEM_ROLES.FULL_ACCESS] },
						},
					},
				},
			},
		});
		expect(usersRepoCalls[1]).toEqual({
			type: "countStatsBySpaceIds",
			spaceIds: [SPACE_A_ID],
			excludedRoleNames: [SYSTEM_ROLES.FULL_ACCESS],
		});
	});

	it("ROOT Space FULL_ACCESS 사용자의 users 조회는 전체 scope로 repository를 호출한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/test-space-scope/users")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_B_ID);

		expect(response.status).toBe(HttpStatus.OK);
		expect(usersRepoCalls[0]).toMatchObject({
			type: "findManyBySpaceIds",
			spaceIds: undefined,
			where: {},
		});
		expect(usersRepoCalls[1]).toEqual({
			type: "countStatsBySpaceIds",
			spaceIds: undefined,
			excludedRoleNames: undefined,
		});
	});

	it("BRANCH에 미러된 FULL_ACCESS 사용자의 users 조회는 현재 space 일반 회원만 조회한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/test-space-scope/users")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_C_ID);

		expect(response.status).toBe(HttpStatus.OK);
		expect(usersRepoCalls[0]).toMatchObject({
			type: "findManyBySpaceIds",
			spaceIds: [SPACE_C_ID],
			where: {
				tenants: {
					some: {
						spaceId: { in: [SPACE_C_ID] },
						removedAt: null,
						role: {
							name: { notIn: [SYSTEM_ROLES.FULL_ACCESS] },
						},
					},
				},
			},
		});
		expect(usersRepoCalls[1]).toEqual({
			type: "countStatsBySpaceIds",
			spaceIds: [SPACE_C_ID],
			excludedRoleNames: [SYSTEM_ROLES.FULL_ACCESS],
		});
	});

	it("비 FULL_ACCESS 사용자가 INCLUDE_ANCESTORS를 보내도 tasks 조회는 현재 space만 사용한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/test-space-scope/tasks")
			.query({ spaceScope: SpaceScope.INCLUDE_ANCESTORS })
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_A_ID);

		expect(response.status).toBe(HttpStatus.OK);
		expect(tasksRepoCalls[0]).toMatchObject({
			type: "findManyTasks",
			spaceIds: [SPACE_A_ID],
		});
	});

	it("FULL_ACCESS 사용자의 tasks 조회는 INCLUDE_ANCESTORS에서 전체 조회를 사용한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/test-space-scope/tasks")
			.query({ spaceScope: SpaceScope.INCLUDE_ANCESTORS })
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_B_ID);

		expect(response.status).toBe(HttpStatus.OK);
		expect(tasksRepoCalls[0]).toMatchObject({
			type: "findManyTasks",
		});
		expect(tasksRepoCalls[0].spaceIds).toBeUndefined();
	});

	it("spaces 목록도 현재 scope 기준으로 spaceIds를 전달한다", async () => {
		const limitedResponse = await request(app.getHttpServer())
			.get("/api/v1/spaces")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_A_ID);

		expect(limitedResponse.status).toBe(HttpStatus.OK);
		expect(spacesRepoCalls[0]).toEqual({
			type: "findManyWithGround",
			spaceIds: [SPACE_A_ID],
		});

		spacesRepoCalls.length = 0;

		const fullResponse = await request(app.getHttpServer())
			.get("/api/v1/spaces")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_B_ID);

		expect(fullResponse.status).toBe(HttpStatus.OK);
		expect(spacesRepoCalls[0]).toEqual({
			type: "findManyWithGround",
		});
	});

	it("비 FULL_ACCESS 사용자는 다른 space의 ground 상세에 접근할 수 없고 FULL_ACCESS는 접근 가능하다", async () => {
		const forbiddenResponse = await request(app.getHttpServer())
			.get(`/api/v1/spaces/${SPACE_B_ID}/ground`)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_A_ID);

		expect(forbiddenResponse.status).toBe(HttpStatus.FORBIDDEN);
		expect(
			spacesRepoCalls.some((call) => call.type === "findGroundBySpaceId"),
		).toBe(false);

		spacesRepoCalls.length = 0;

		const allowedResponse = await request(app.getHttpServer())
			.get(`/api/v1/spaces/${SPACE_A_ID}/ground`)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_B_ID);

		expect(allowedResponse.status).toBe(HttpStatus.OK);
		expect(spacesRepoCalls[0]).toEqual({
			type: "findGroundBySpaceId",
			spaceId: SPACE_A_ID,
		});
	});

	it("tenant가 없는 x-space-id는 403으로 차단한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/test-space-scope/context")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_D_ID);

		expect(response.status).toBe(HttpStatus.FORBIDDEN);
	});
});
