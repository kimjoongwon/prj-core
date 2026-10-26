import {
	JwtStrategy,
	SPACE_RESOURCE_SCOPE_SWAGGER_EXTENSION,
	WithAncestorSpaces,
	WithSpaceTree,
} from "@cocrepo/be-common";
import { PRISMA_SERVICE_TOKEN, SYSTEM_ROLES } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import { ApiAuth } from "@cocrepo/decorator";
import { SpaceCategoryName } from "@cocrepo/enum";
import {
	SpacesRepository,
	TenantsRepository,
	UsersRepository,
} from "@cocrepo/repository";
import {
	AuthCacheService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import { SpaceResourceScope } from "@cocrepo/type";
import {
	Controller,
	Get,
	HttpStatus,
	INestApplication,
	Injectable,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Test, TestingModule } from "@nestjs/testing";
import { ExtractJwt, Strategy } from "passport-jwt";
import request from "supertest";
import { AppModule } from "../src/module/app.module";
import { setNestApp } from "../src/setNestApp";
import {
	getOidcTestIssuer,
	getOidcTestPublicKeyPem,
	signOidcTestToken,
} from "./helpers/test-auth.helper";

const USER_ULID = "01JMEMBER00000000000000E2E";
const TENANT_A_ID = "01JTENANT000000000000000TA";
const TENANT_B_ID = "01JTENANT000000000000000TB";
const SPACE_A_ID = "01JSPACE0000000000000000SA";
const SPACE_B_ID = "01JSPACE0000000000000000SB";
const ROOT_SCOPED_SPACE_IDS = [SPACE_B_ID, SPACE_A_ID];
const BRANCH_SCOPED_SPACE_IDS = [SPACE_A_ID];
const UNKNOWN_TENANT_ID = "01JTENANT000000000000000XN";

function createTestUser() {
	return {
		id: USER_ULID,
		email: "scope-e2e@example.com",
		tenants: [
			{
				id: TENANT_A_ID,
				role: { name: SYSTEM_ROLES.COMPANY_MANAGER },
				space: {
					id: SPACE_A_ID,
					classification: {
						category: {
							name: SpaceCategoryName.BRANCH.name,
						},
					},
				},
			},
			{
				id: TENANT_B_ID,
				role: { name: SYSTEM_ROLES.PLATFORM_ADMIN },
				space: {
					id: SPACE_B_ID,
					classification: {
						category: {
							name: SpaceCategoryName.ROOT.name,
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
			secretOrKey: getOidcTestPublicKeyPem(),
			issuer: getOidcTestIssuer(),
			algorithms: ["RS256"],
		});
	}

	async validate(_payload: { sub: string }) {
		return createTestUser();
	}
}

@Controller("api/v1/test-space-scope")
class SpaceScopeTestController {
	constructor(
		private readonly spaceContext: SpaceContext,
		private readonly userService: UserService,
	) {}

	@Get("context")
	@ApiAuth()
	getContext() {
		return {
			spaceId: this.spaceContext.spaceId ?? null,
			spaceIds: this.spaceContext.spaceIds ?? null,
			tenantRole: this.spaceContext.tenant?.role?.name ?? null,
		};
	}

	@Get("context/ancestors")
	@ApiAuth()
	@WithAncestorSpaces()
	getAncestorContext() {
		return {
			spaceId: this.spaceContext.spaceId ?? null,
			spaceIds: this.spaceContext.spaceIds ?? null,
			tenantRole: this.spaceContext.tenant?.role?.name ?? null,
		};
	}

	@Get("context/tree")
	@ApiAuth()
	@WithSpaceTree()
	getTreeContext() {
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

}

describe("Space Scope API (E2E)", () => {
	let app: INestApplication;
	let jwtToken: string;
	let swaggerDocument: ReturnType<typeof SwaggerModule.createDocument>;

	const usersRepoCalls: Array<Record<string, unknown>> = [];
	const spacesRepoCalls: Array<Record<string, unknown>> = [];

	const usersRepositoryMock = {
		findManyBySpaceIds: async (params: Record<string, unknown>) => {
			usersRepoCalls.push({ type: "findManyBySpaceIds", ...params });
			return { users: [], totalCount: 0 };
		},
		countStatsBySpaceIds: async (params?: Record<string, unknown>) => {
			usersRepoCalls.push({ type: "countStatsBySpaceIds", ...(params ?? {}) });
			return {
				total: 0,
				active: 0,
				inactive: 0,
				newThisMonth: 0,
			};
		},
	};

	const spacesRepositoryMock = {
		findSpaceIdsByCategoryHierarchy: async (
			spaceId: string,
			scope: SpaceResourceScope = SpaceResourceScope.WITH_DESCENDANTS,
		) => {
			spacesRepoCalls.push({
				type: "findSpaceIdsByCategoryHierarchy",
				spaceId,
				scope,
			});

			if (spaceId === SPACE_B_ID) {
				return ROOT_SCOPED_SPACE_IDS;
			}
			if (scope === SpaceResourceScope.WITH_ANCESTORS) {
				return [SPACE_A_ID, SPACE_B_ID];
			}
			if (scope === SpaceResourceScope.WITH_TREE) {
				return [SPACE_A_ID, SPACE_B_ID];
			}
			return BRANCH_SCOPED_SPACE_IDS;
		},
	};

	beforeAll(async () => {
		jwtToken = signOidcTestToken({
			sub: USER_ULID,
		});

		const moduleBuilder = Test.createTestingModule({
			imports: [AppModule],
			controllers: [SpaceScopeTestController],
			providers: [
				SpaceContext,
				UserService,
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
					provide: TenantsRepository,
					useValue: {},
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
			.overrideProvider(SpacesRepository)
			.useValue(spacesRepositoryMock);

		const moduleFixture: TestingModule = await moduleBuilder.compile();
		app = moduleFixture.createNestApplication();
		setNestApp(app);
		await app.init();
		swaggerDocument = SwaggerModule.createDocument(
			app,
			new DocumentBuilder()
				.setTitle("Space Scope Test")
				.setVersion("1.0.0")
				.build(),
		);
	}, 60000);

	beforeEach(() => {
		usersRepoCalls.length = 0;
		spacesRepoCalls.length = 0;
	});

	afterAll(async () => {
		if (app) {
			await app.close();
		}
	}, 30000);

	const getSwaggerOperation = (path: string, method: "get" | "post") => {
		const operation = (
			swaggerDocument.paths[path] as
				| Record<string, Record<string, unknown>>
				| undefined
		)?.[method];
		expect(operation).toBeDefined();
		return operation as Record<string, unknown>;
	};

	const findTenantHeader = (operation: Record<string, unknown>) => {
		const parameters = operation.parameters;
		if (!Array.isArray(parameters)) {
			return undefined;
		}

		return parameters.find(
			(parameter): parameter is Record<string, unknown> =>
				typeof parameter === "object" &&
				parameter !== null &&
				"in" in parameter &&
				"name" in parameter &&
				parameter.in === "header" &&
				typeof parameter.name === "string" &&
				parameter.name.toLowerCase() === "x-tenant-id",
		);
	};

	describe("Swagger 문서", () => {
		it("Given tenant scoped 보호 API When OpenAPI 문서를 만들면 Then x-tenant-id header가 필수로 노출된다", () => {
			const operation = getSwaggerOperation(
				"/api/v1/test-space-scope/context",
				"get",
			);

			expect(findTenantHeader(operation)).toMatchObject({
				name: "x-tenant-id",
				in: "header",
				required: true,
			});
		});

		// /api/v1/auth/my-spaces, /api/v1/auth/current-space는 발급자 단일화 때
		// AuthModule이 idp-api로 이동하며 core-api 스웨거에서 사라졌습니다.
		// core-api에는 더 이상 Space 선택 전 공개 라우트가 없으므로 두 케이스를 제거합니다.

		it("Given Space scope 데코레이터 When OpenAPI 문서를 만들면 Then scope vendor extension을 노출한다", () => {
			const ancestorOperation = getSwaggerOperation(
				"/api/v1/test-space-scope/context/ancestors",
				"get",
			);
			const treeOperation = getSwaggerOperation(
				"/api/v1/test-space-scope/context/tree",
				"get",
			);

			expect(ancestorOperation[SPACE_RESOURCE_SCOPE_SWAGGER_EXTENSION]).toBe(
				SpaceResourceScope.WITH_ANCESTORS,
			);
			expect(treeOperation[SPACE_RESOURCE_SCOPE_SWAGGER_EXTENSION]).toBe(
				SpaceResourceScope.WITH_TREE,
			);
		});
	});

	it("BRANCH tenant의 기본 scope는 현재 space만 EFFECTIVE_SPACE_IDS로 사용한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/test-space-scope/context")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", TENANT_A_ID);

		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body.data).toEqual({
			spaceId: SPACE_A_ID,
			spaceIds: BRANCH_SCOPED_SPACE_IDS,
			tenantRole: SYSTEM_ROLES.COMPANY_MANAGER,
		});
		expect(spacesRepoCalls[0]).toEqual({
			type: "findSpaceIdsByCategoryHierarchy",
			spaceId: SPACE_A_ID,
			scope: SpaceResourceScope.WITH_DESCENDANTS,
		});
	});

	it("ROOT tenant의 기본 scope는 자기 자신과 하위 space를 EFFECTIVE_SPACE_IDS로 사용한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/test-space-scope/context")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", TENANT_B_ID);

		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body.data).toEqual({
			spaceId: SPACE_B_ID,
			spaceIds: ROOT_SCOPED_SPACE_IDS,
			tenantRole: SYSTEM_ROLES.PLATFORM_ADMIN,
		});
		expect(spacesRepoCalls[0]).toEqual({
			type: "findSpaceIdsByCategoryHierarchy",
			spaceId: SPACE_B_ID,
			scope: SpaceResourceScope.WITH_DESCENDANTS,
		});
	});

	it("ancestor decorator는 현재 space와 상위 space를 EFFECTIVE_SPACE_IDS로 사용한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/test-space-scope/context/ancestors")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", TENANT_A_ID);

		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body.data).toEqual({
			spaceId: SPACE_A_ID,
			spaceIds: [SPACE_A_ID, SPACE_B_ID],
			tenantRole: SYSTEM_ROLES.COMPANY_MANAGER,
		});
		expect(spacesRepoCalls[0]).toEqual({
			type: "findSpaceIdsByCategoryHierarchy",
			spaceId: SPACE_A_ID,
			scope: SpaceResourceScope.WITH_ANCESTORS,
		});
	});

	it("tree decorator는 현재 space와 상위/하위 space를 EFFECTIVE_SPACE_IDS로 사용한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/test-space-scope/context/tree")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", TENANT_A_ID);

		expect(response.status).toBe(HttpStatus.OK);
		expect(response.body.data).toEqual({
			spaceId: SPACE_A_ID,
			spaceIds: [SPACE_A_ID, SPACE_B_ID],
			tenantRole: SYSTEM_ROLES.COMPANY_MANAGER,
		});
		expect(spacesRepoCalls[0]).toEqual({
			type: "findSpaceIdsByCategoryHierarchy",
			spaceId: SPACE_A_ID,
			scope: SpaceResourceScope.WITH_TREE,
		});
	});

	it("비 PLATFORM_ADMIN 사용자의 users 조회는 현재 spaceId만 repository로 전달한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/test-space-scope/users")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", TENANT_A_ID);

		expect(response.status).toBe(HttpStatus.OK);
		expect(usersRepoCalls[0]).toMatchObject({
			type: "findManyBySpaceIds",
			spaceIds: BRANCH_SCOPED_SPACE_IDS,
			where: {
				tenants: {
					some: {
						space: { id: { in: BRANCH_SCOPED_SPACE_IDS } },
						removedAt: null,
					},
				},
			},
		});
		expect(usersRepoCalls[1]).toEqual({
			type: "countStatsBySpaceIds",
			spaceIds: BRANCH_SCOPED_SPACE_IDS,
		});
	});

	it("PLATFORM_ADMIN 사용자의 users 조회도 category scope로 repository를 호출한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/test-space-scope/users")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", TENANT_B_ID);

		expect(response.status).toBe(HttpStatus.OK);
		expect(usersRepoCalls[0]).toMatchObject({
			type: "findManyBySpaceIds",
			spaceIds: ROOT_SCOPED_SPACE_IDS,
			where: {
				tenants: {
					some: {
						space: { id: { in: ROOT_SCOPED_SPACE_IDS } },
						removedAt: null,
					},
				},
			},
		});
		expect(usersRepoCalls[1]).toEqual({
			type: "countStatsBySpaceIds",
			spaceIds: ROOT_SCOPED_SPACE_IDS,
		});
	});

	it("tenant가 없는 x-tenant-id는 403으로 차단한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/test-space-scope/context")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", UNKNOWN_TENANT_ID);

		expect(response.status).toBe(HttpStatus.FORBIDDEN);
	});
});
