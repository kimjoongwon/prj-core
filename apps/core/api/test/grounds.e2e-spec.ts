import { JwtStrategy } from "@cocrepo/be-common";
import { SpaceAggregate } from "@cocrepo/aggregate";
import {
	PRISMA_SERVICE_TOKEN,
	SYSTEM_ROLES } from "@cocrepo/constant";
import {
	AuthCacheService,
	TokenStorageService,
} from "@cocrepo/service";
import { INestApplication, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import request from "supertest";
import { AppModule } from "../src/module/app.module";
import { setNestApp } from "../src/setNestApp";

const TEST_JWT_SECRET = "test-jwt-secret-e2e";
const USER_ID = "00000000-0000-4000-8000-000000000021";
const SPACE_MANAGE_ID = "11111111-1111-4111-8111-111111111111";
const SPACE_FULL_ACCESS_ID = "22222222-2222-4222-8222-222222222222";
const SPACE_VIEW_ID = "33333333-3333-4333-8333-333333333333";
const UNKNOWN_SPACE_ID = "55555555-5555-4555-8555-555555555555";
const SPACE_RESULT_ID = "66666666-6666-4666-8666-666666666666";
const GROUND_ID = "77777777-7777-4777-8777-777777777777";

function createTestUser() {
	return {
		id: USER_ID,
		email: "spaces-e2e@example.com",
		tenants: [
			{
				id: "10000000-0000-4000-8000-000000000021",
				spaceId: SPACE_MANAGE_ID,
				role: { name: SYSTEM_ROLES.MANAGE },
			},
			{
				id: "20000000-0000-4000-8000-000000000021",
				spaceId: SPACE_FULL_ACCESS_ID,
				role: { name: SYSTEM_ROLES.FULL_ACCESS },
			},
			{
				id: "30000000-0000-4000-8000-000000000021",
				spaceId: SPACE_VIEW_ID,
				role: { name: SYSTEM_ROLES.VIEW },
			},
		],
	};
}

@Injectable()
class SpacesTestJwtStrategy extends PassportStrategy(Strategy) {
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

describe("Spaces API (E2E)", () => {
	let app: INestApplication;
	let jwtToken: string;

	const spaceServiceMock = {
		listSpaces: jest.fn(),
		getGroundBySpaceId: jest.fn(),
		createSpaceWithGround: jest.fn(),
		updateGroundBySpaceId: jest.fn(),
	};

	beforeAll(async () => {
		const jwtService = new JwtService({ secret: TEST_JWT_SECRET });
		jwtToken = jwtService.sign({
			sub: USER_ID,
			user: createTestUser(),
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
				{
					id: SPACE_RESULT_ID,
					name: "Scope space",
				},
			],
			total: 1,
		});
		spaceServiceMock.getGroundBySpaceId.mockImplementation(async (spaceId: string) => ({
			id: GROUND_ID,
			spaceId,
			name: "Main ground",
			label: null,
			address: "Seoul",
			phone: "02-1234-5678",
			email: "ground@example.com",
			businessNo: "1234567890",
			logoImageFileId: null,
			imageFileId: null,
		}));
		spaceServiceMock.createSpaceWithGround.mockResolvedValue({
			id: SPACE_RESULT_ID,
			name: "Created space",
		});
		spaceServiceMock.updateGroundBySpaceId.mockResolvedValue({
			id: SPACE_RESULT_ID,
			name: "Updated space",
		});
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

	it("인증은 있지만 x-space-id가 없으면 400을 반환해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/spaces")
			.set("Authorization", `Bearer ${jwtToken}`);

		expect(response.status).toBe(400);
	});

	it("비 FULL_ACCESS tenant는 현재 선택한 space 하나만 목록 필터로 전달해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/spaces")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_VIEW_ID);

		expect(response.status).toBe(200);
		expect(response.body.httpStatus).toBe(200);
		expect(response.body.data).toBeInstanceOf(Array);
		expect(spaceServiceMock.listSpaces).toHaveBeenCalledWith({
			spaceIds: [SPACE_VIEW_ID],
		});
	});

	it("FULL_ACCESS tenant는 전체 space 조회로 전달해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/spaces")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_FULL_ACCESS_ID);

		expect(response.status).toBe(200);
		expect(response.body.httpStatus).toBe(200);
		expect(spaceServiceMock.listSpaces).toHaveBeenCalledWith({
			spaceIds: undefined,
		});
	});

	it("현재 접근 가능한 space의 ground는 조회할 수 있어야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get(`/api/v1/spaces/${SPACE_VIEW_ID}/ground`)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_VIEW_ID);

		expect(response.status).toBe(200);
		expect(response.body.httpStatus).toBe(200);
		expect(response.body.data.spaceId).toBe(SPACE_VIEW_ID);
		expect(spaceServiceMock.getGroundBySpaceId).toHaveBeenCalledWith(SPACE_VIEW_ID);
	});

	it("비 FULL_ACCESS tenant는 다른 space ground 조회 시 403을 반환해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get(`/api/v1/spaces/${SPACE_MANAGE_ID}/ground`)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_VIEW_ID);

		expect(response.status).toBe(403);
		expect(spaceServiceMock.getGroundBySpaceId).not.toHaveBeenCalled();
	});

	it("FULL_ACCESS tenant는 다른 space ground도 조회할 수 있어야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get(`/api/v1/spaces/${UNKNOWN_SPACE_ID}/ground`)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_FULL_ACCESS_ID);

		expect(response.status).toBe(200);
		expect(response.body.httpStatus).toBe(200);
		expect(response.body.data.spaceId).toBe(UNKNOWN_SPACE_ID);
		expect(spaceServiceMock.getGroundBySpaceId).toHaveBeenCalledWith(
			UNKNOWN_SPACE_ID,
		);
	});

	it("공간 생성은 현재 DTO를 그대로 service에 전달해야 한다", async () => {
		const createDto = {
			name: "Scope ground",
			label: "HQ",
			address: "Seoul",
			phone: "02-1234-5678",
			email: "scope@example.com",
			businessNo: "1234567890",
			logoImageFileId: null,
			imageFileId: null,
			spaceId: SPACE_MANAGE_ID,
			contentLanguageCode: "ko_KR",
		};

		const response = await request(app.getHttpServer())
			.post("/api/v1/spaces")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_MANAGE_ID)
			.send(createDto);

		expect(response.status).toBe(201);
		expect(response.body.httpStatus).toBe(201);
		expect(response.body.data.id).toBe(SPACE_RESULT_ID);
		expect(spaceServiceMock.createSpaceWithGround).toHaveBeenCalledWith(createDto);
	});

	it("현재 접근 가능한 space의 ground는 수정할 수 있어야 한다", async () => {
		const updateDto = {
			name: "Updated ground",
			label: "Updated label",
		};

		const response = await request(app.getHttpServer())
			.patch(`/api/v1/spaces/${SPACE_VIEW_ID}/ground`)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_VIEW_ID)
			.send(updateDto);

		expect(response.status).toBe(200);
		expect(response.body.httpStatus).toBe(200);
		expect(spaceServiceMock.updateGroundBySpaceId).toHaveBeenCalledWith(
			SPACE_VIEW_ID,
			updateDto,
		);
	});

	it("접근 불가한 space의 ground 수정은 403을 반환해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.patch(`/api/v1/spaces/${SPACE_MANAGE_ID}/ground`)
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_VIEW_ID)
			.send({ name: "Blocked update" });

		expect(response.status).toBe(403);
		expect(spaceServiceMock.updateGroundBySpaceId).not.toHaveBeenCalled();
	});

	it("유효하지 않은 UUID spaceId는 400을 반환해야 한다", async () => {
		const response = await request(app.getHttpServer())
			.get("/api/v1/spaces/not-a-valid-uuid/ground")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("x-space-id", SPACE_VIEW_ID);

		expect(response.status).toBe(400);
		expect(spaceServiceMock.getGroundBySpaceId).not.toHaveBeenCalled();
	});
});
