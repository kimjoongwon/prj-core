import { SpaceAggregate } from "@cocrepo/aggregate";
import { JwtStrategy } from "@cocrepo/be-common";
import { PRISMA_SERVICE_TOKEN, SYSTEM_ROLES } from "@cocrepo/constant";
import { SpacesRepository } from "@cocrepo/repository";
import { AuthCacheService, TokenStorageService } from "@cocrepo/service";
import {
	type INestApplication,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
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

const USER_ULID = "01J00000000000000000001021";
const COMPANY_MANAGER_SPACE_ID = "01JSPACE0000000000000000CM";
const PLATFORM_ADMIN_SPACE_ID = "01JSPACE0000000000000000PA";
const MEMBER_SPACE_ID = "01JSPACE0000000000000000MB";
const UNKNOWN_SPACE_ID = "01JSPACE0000000000000000XN";
const COMPANY_MANAGER_TENANT_ID = "01JTENANT00000000000000TMC";
const PLATFORM_ADMIN_TENANT_ID = "01JTENANT00000000000000TPA";
const MEMBER_TENANT_ID = "01JTENANT00000000000000TMB";
const SPACE_RESULT_ID = "01JSPACE0000000000000000RZ";
const MEMBER_FITNESS_CENTER_ID = "01JFTNS00000000000000000MB";
const COMPANY_MANAGER_FITNESS_CENTER_ID = "01JFTNS00000000000000000CM";
const CREATED_FITNESS_CENTER_ID = "01JFTNS00000000000000000NW";
const SHARED_COMPANY_ID = "01JCMPNY0000000000000000SH";
const UNKNOWN_COMPANY_ID = "01JCMPNY0000000000000000XN";
const COMPANY_NAME = "CoreFit";
const COMPANY_BUSINESS_NO = "1234567890";
const PLATFORM_ADMIN_SCOPED_SPACE_IDS = [
	PLATFORM_ADMIN_SPACE_ID,
	COMPANY_MANAGER_SPACE_ID,
	MEMBER_SPACE_ID,
	UNKNOWN_SPACE_ID,
];

/**
 * 인증/tenant scope 검증에 사용할 사용자 fixture를 만듭니다.
 */
function createTestUser() {
	return {
		id: USER_ULID,
		email: "fitness-centers-e2e@example.com",
		tenants: [
			{
				id: COMPANY_MANAGER_TENANT_ID,
				space: { id: COMPANY_MANAGER_SPACE_ID },
				role: {
					id: "01JTASK0000000000000000RCM",
					name: SYSTEM_ROLES.COMPANY_MANAGER,
				},
			},
			{
				id: PLATFORM_ADMIN_TENANT_ID,
				space: { id: PLATFORM_ADMIN_SPACE_ID },
				role: {
					id: "01JTASK0000000000000000RPA",
					name: SYSTEM_ROLES.PLATFORM_ADMIN,
				},
			},
			{
				id: MEMBER_TENANT_ID,
				space: { id: MEMBER_SPACE_ID },
				role: {
					id: "01JTASK0000000000000000RMB",
					name: SYSTEM_ROLES.MEMBER,
				},
			},
		],
	};
}

/**
 * 두 FitnessCenter가 공유하는 Company fixture를 만듭니다.
 */
function createCompanyFixture() {
	return {
		id: SHARED_COMPANY_ID,
		createdAt: new Date("2026-01-01T00:00:00.000Z"),
		updatedAt: null,
		removedAt: null,
		name: COMPANY_NAME,
		label: "CoreFit Company",
		address: "Seoul",
		phone: "02-1111-2222",
		email: "company@corefit.example.com",
		businessNo: COMPANY_BUSINESS_NO,
		logoImageFileId: null,
	};
}

/**
 * Space에 유일하게 연결되는 FitnessCenter fixture를 만듭니다.
 */
function createFitnessCenterFixture(id: string, spaceId: string) {
	return {
		id,
		createdAt: new Date("2026-01-01T00:00:00.000Z"),
		updatedAt: null,
		removedAt: null,
		space: { id: spaceId },
		address: "Seoul",
		phone: "02-1234-5678",
		email: `${spaceId}@fitness-center.example.com`,
		imageFileId: null,
		company: createCompanyFixture(),
	};
}

/**
 * 단수 FitnessCenter relation을 포함한 Space fixture를 만듭니다.
 */
function createSpaceFixture(
	spaceId: string,
	fitnessCenterId: string,
	spaceName: string,
) {
	return {
		id: spaceId,
		createdAt: new Date("2026-01-01T00:00:00.000Z"),
		updatedAt: null,
		removedAt: null,
		name: spaceName,
		label: null,
		contentLanguageCode: "ko_KR",
		fitnessCenter: createFitnessCenterFixture(fitnessCenterId, spaceId),
	};
}

@Injectable()
class SpacesTestJwtStrategy extends PassportStrategy(Strategy) {
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

describe("FitnessCenter API (E2E)", () => {
	let app: INestApplication;
	let jwtToken: string;

	const spaceServiceMock = {
		listSpaces: jest.fn(),
		getFitnessCenterBySpaceId: jest.fn(),
		createSpaceWithFitnessCenter: jest.fn(),
		updateFitnessCenterBySpaceId: jest.fn(),
	};
	const spacesRepositoryMock = {
		findSpaceIdsByCategoryHierarchy: async (spaceId: string) => {
			if (spaceId === PLATFORM_ADMIN_SPACE_ID) {
				return PLATFORM_ADMIN_SCOPED_SPACE_IDS;
			}
			return [spaceId];
		},
	};

	beforeAll(async () => {
		jwtToken = signOidcTestToken({
			sub: USER_ULID,
		});

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideProvider(PRISMA_SERVICE_TOKEN)
			.useValue({})
			.overrideProvider(JwtStrategy)
			.useClass(SpacesTestJwtStrategy)
			.overrideProvider(TokenStorageService)
			.useValue({
				isBlacklisted: async () => false,
			})
			.overrideProvider(AuthCacheService)
			.useValue({
				invalidate: async () => {},
			})
			.overrideProvider(SpacesRepository)
			.useValue(spacesRepositoryMock)
			.overrideProvider(SpaceAggregate)
			.useValue(spaceServiceMock)
			.compile();

		app = moduleFixture.createNestApplication();
		setNestApp(app);
		await app.init();
	}, 60000);

	beforeEach(() => {
		jest.clearAllMocks();

		spaceServiceMock.listSpaces.mockResolvedValue({
			spaces: [
				createSpaceFixture(
					MEMBER_SPACE_ID,
					MEMBER_FITNESS_CENTER_ID,
					"CoreFit Jongno",
				),
				createSpaceFixture(
					COMPANY_MANAGER_SPACE_ID,
					COMPANY_MANAGER_FITNESS_CENTER_ID,
					"CoreFit Gangnam",
				),
			],
			total: 2,
		});
		spaceServiceMock.getFitnessCenterBySpaceId.mockImplementation(
			async (spaceId: string) => {
				if (spaceId === UNKNOWN_SPACE_ID) {
					throw new NotFoundException("시설 정보를 찾을 수 없습니다");
				}

				const fitnessCenterId =
					spaceId === COMPANY_MANAGER_SPACE_ID
						? COMPANY_MANAGER_FITNESS_CENTER_ID
						: MEMBER_FITNESS_CENTER_ID;
				return createFitnessCenterFixture(fitnessCenterId, spaceId);
			},
		);
		spaceServiceMock.createSpaceWithFitnessCenter.mockResolvedValue(
			createSpaceFixture(
				SPACE_RESULT_ID,
				CREATED_FITNESS_CENTER_ID,
				"Created fitness center",
			),
		);
		spaceServiceMock.updateFitnessCenterBySpaceId.mockImplementation(
			async (
				spaceId: string,
				input: {
					name?: string;
					label?: string | null;
					contentLanguageCode?: string;
				},
			) => {
				const space = createSpaceFixture(
					spaceId,
					MEMBER_FITNESS_CENTER_ID,
					input.name ?? "CoreFit Center",
				);
				return {
					...space,
					label: input.label ?? null,
					contentLanguageCode:
						input.contentLanguageCode ?? space.contentLanguageCode,
				};
			},
		);
	});

	afterAll(async () => {
		if (app) {
			await app.close();
		}
	}, 30000);

	it("인증 없이 공간 목록 조회 시 401을 반환해야 한다", async () => {
		const response = await request(app.getHttpServer()).get("/api/v1/spaces");

		expect(response.status).toBe(401);
	});

	it("인증은 있지만 x-tenant-id가 없으면 400을 반환해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/spaces")
			.set("Authorization", `Bearer ${jwtToken}`);

		expect(response.status).toBe(400);
	});

	it("비 PLATFORM_ADMIN tenant는 현재 선택한 space 하나만 목록 필터로 전달해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/spaces")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", MEMBER_TENANT_ID);

		expect(response.status).toBe(200);
		expect(response.body.httpStatus).toBe(200);
		expect(response.body.data).toBeInstanceOf(Array);
		expect(spaceServiceMock.listSpaces).toHaveBeenCalledWith({
			spaceIds: [MEMBER_SPACE_ID],
		});
	});

	it("Company 하나의 여러 FitnessCenter를 Space별 단수 relation으로 조회해야 한다", async () => {
		// Given
		const expectedSpaceIds = [
			MEMBER_SPACE_ID,
			COMPANY_MANAGER_SPACE_ID,
		];

		// When
		const response = await request(app.getHttpServer())
			.get("/api/v1/spaces")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", PLATFORM_ADMIN_TENANT_ID);

		// Then
		expect(response.status).toBe(200);
		expect(response.body.httpStatus).toBe(200);
		expect(spaceServiceMock.listSpaces).toHaveBeenCalledWith({
			spaceIds: PLATFORM_ADMIN_SCOPED_SPACE_IDS,
		});
		expect(response.body.data).toHaveLength(2);

		const spaces = response.body.data as Array<{
			id: string;
			fitnessCenter: {
				id: string;
				spaceId: string;
				companyId: string;
			};
		}>;
		expect(spaces.map((space) => space.id)).toEqual(expectedSpaceIds);
		expect(
			new Set(
				spaces.map((space) => space.fitnessCenter.companyId),
			),
		).toEqual(new Set([undefined]));
		expect(new Set(spaces.map((space) => space.fitnessCenter.id)).size).toBe(2);
		for (const space of spaces) {
			expect(space).toHaveProperty("fitnessCenter");
			expect(space).not.toHaveProperty("fitnessCenters");
			expect(space.fitnessCenter.spaceId).toBeUndefined();
		}
	});

	it("현재 접근 가능한 space의 FitnessCenter를 조회할 수 있어야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get(`/api/v1/spaces/${MEMBER_SPACE_ID}/fitness-center`)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", MEMBER_TENANT_ID);

		expect(response.status).toBe(200);
		expect(response.body.httpStatus).toBe(200);
		expect(response.body.data.spaceId).toBeUndefined();
		expect(response.body.data.companyId).toBeUndefined();
		expect(spaceServiceMock.getFitnessCenterBySpaceId).toHaveBeenCalledWith(
			MEMBER_SPACE_ID,
		);
	});

	it("비 PLATFORM_ADMIN tenant는 다른 space FitnessCenter 조회 시 403을 반환해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get(
				`/api/v1/spaces/${COMPANY_MANAGER_SPACE_ID}/fitness-center`,
			)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", MEMBER_TENANT_ID);

		expect(response.status).toBe(403);
		expect(spaceServiceMock.getFitnessCenterBySpaceId).not.toHaveBeenCalled();
	});

	it("PLATFORM_ADMIN tenant는 다른 space FitnessCenter도 조회할 수 있어야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get(
				`/api/v1/spaces/${COMPANY_MANAGER_SPACE_ID}/fitness-center`,
			)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", PLATFORM_ADMIN_TENANT_ID);

		expect(response.status).toBe(200);
		expect(response.body.httpStatus).toBe(200);
		expect(response.body.data.spaceId).toBeUndefined();
		expect(spaceServiceMock.getFitnessCenterBySpaceId).toHaveBeenCalledWith(
			COMPANY_MANAGER_SPACE_ID,
		);
	});

	it("존재하지 않는 Space reference의 FitnessCenter 조회는 404를 반환해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get(`/api/v1/spaces/${UNKNOWN_SPACE_ID}/fitness-center`)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", PLATFORM_ADMIN_TENANT_ID);

		expect(response.status).toBe(404);
		expect(spaceServiceMock.getFitnessCenterBySpaceId).toHaveBeenCalledWith(
			UNKNOWN_SPACE_ID,
		);
	});

	it("공간 생성 DTO는 클라이언트가 주입한 Company/Space reference를 제거해야 한다", async () => {
		// Given
		const expectedCreateDto = {
			name: "Scope fitness center",
			label: "HQ",
			address: "Seoul",
			phone: "02-1234-5678",
			email: "scope@example.com",
			businessNo: COMPANY_BUSINESS_NO,
			logoImageFileId: null,
			imageFileId: null,
			contentLanguageCode: "ko_KR",
		};

		// When
		const response = await request(app.getHttpServer())
			.post("/api/v1/spaces")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", COMPANY_MANAGER_TENANT_ID)
			.send({
				...expectedCreateDto,
				companyId: UNKNOWN_COMPANY_ID,
				spaceId: UNKNOWN_SPACE_ID,
			});

		// Then
		expect(response.status).toBe(201);
		expect(response.body.httpStatus).toBe(201);
		expect(response.body.data.id).toBe(SPACE_RESULT_ID);
		expect(spaceServiceMock.createSpaceWithFitnessCenter).toHaveBeenCalledTimes(
			1,
		);
		const forwardedDto =
			spaceServiceMock.createSpaceWithFitnessCenter.mock.calls[0]?.[0];
		expect(forwardedDto).toEqual(expectedCreateDto);
		expect(forwardedDto).not.toHaveProperty("companyId");
		expect(forwardedDto).not.toHaveProperty("spaceId");
	});

	it("FitnessCenter PATCH는 Company reference와 사업자 정보를 변경하지 않아야 한다", async () => {
		// Given
		const updateDto = {
			name: "Updated fitness center",
			label: "Updated label",
		};

		// When
		const response = await request(app.getHttpServer())
			.patch(`/api/v1/spaces/${MEMBER_SPACE_ID}/fitness-center`)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", MEMBER_TENANT_ID)
			.send({
				...updateDto,
				companyId: UNKNOWN_COMPANY_ID,
				businessNo: "9999999999",
				logoImageFileId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
			});

		// Then
		expect(response.status).toBe(200);
		expect(response.body.httpStatus).toBe(200);
		expect(spaceServiceMock.updateFitnessCenterBySpaceId).toHaveBeenCalledTimes(
			1,
		);
		const [forwardedSpaceId, forwardedDto] =
			spaceServiceMock.updateFitnessCenterBySpaceId.mock.calls[0] ?? [];
		expect(forwardedSpaceId).toBe(MEMBER_SPACE_ID);
		expect(forwardedDto).toMatchObject(updateDto);
		expect(forwardedDto).not.toHaveProperty("companyId");
		expect(forwardedDto).not.toHaveProperty("businessNo");
		expect(forwardedDto).not.toHaveProperty("logoImageFileId");
		// 이름/라벨은 Space 응답 루트에 노출되고 시설 응답은 참조 정보만 담습니다.
		expect(response.body.data).toMatchObject({
			name: updateDto.name,
			label: updateDto.label,
		});
		expect(response.body.data.fitnessCenter).toMatchObject({
			company: {
				id: SHARED_COMPANY_ID,
				name: COMPANY_NAME,
				businessNo: COMPANY_BUSINESS_NO,
			},
		});
		expect(response.body.data.fitnessCenter).not.toHaveProperty("companyId");
		expect(response.body.data.fitnessCenter).not.toHaveProperty("name");
	});

	it("접근 불가한 space의 FitnessCenter 수정은 403을 반환해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.patch(
				`/api/v1/spaces/${COMPANY_MANAGER_SPACE_ID}/fitness-center`,
			)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", MEMBER_TENANT_ID)
			.send({ name: "Blocked update" });

		expect(response.status).toBe(403);
		expect(
			spaceServiceMock.updateFitnessCenterBySpaceId,
		).not.toHaveBeenCalled();
	});

	it("유효하지 않은 숫자 spaceId 문자열은 400을 반환해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/spaces/01/fitness-center")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", MEMBER_TENANT_ID);

		expect(response.status).toBe(400);
		expect(spaceServiceMock.getFitnessCenterBySpaceId).not.toHaveBeenCalled();
	});

	it("이전 ground 조회/수정 endpoint는 노출하지 않아야 한다", async () => {
		const getResponse = await request(app.getHttpServer())
			.get(`/api/v1/spaces/${MEMBER_SPACE_ID}/ground`)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", MEMBER_TENANT_ID);
		const patchResponse = await request(app.getHttpServer())
			.patch(`/api/v1/spaces/${MEMBER_SPACE_ID}/ground`)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-tenant-id", MEMBER_TENANT_ID)
			.send({ name: "Legacy update" });

		expect(getResponse.status).toBe(404);
		expect(patchResponse.status).toBe(404);
		expect(spaceServiceMock.getFitnessCenterBySpaceId).not.toHaveBeenCalled();
		expect(
			spaceServiceMock.updateFitnessCenterBySpaceId,
		).not.toHaveBeenCalled();
	});
});
