import { RoleCategoryName } from "@cocrepo/enum";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/module/app.module";
import { setNestApp } from "../src/setNestApp";
import { getTestAuth, TestJwtStrategy } from "./helpers/test-auth.helper";

describe("Actions API E2E 테스트", () => {
	let app: INestApplication;
	let jwtToken: string;
	let tenantId: string;

	const createdActionIds: string[] = [];
	const TEST_PREFIX = `E2E_ACTION_${Date.now()}`;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
			providers: [TestJwtStrategy],
		}).compile();

		app = moduleFixture.createNestApplication();
		setNestApp(app);
		await app.init();

		try {
			const auth = await getTestAuth(app, {
				roleCategoryName: RoleCategoryName.WORKSPACE,
			});
			jwtToken = auth.jwtToken;
			tenantId = auth.tenantId;
		} catch (error) {
			console.warn(`테스트 인증 설정 실패: ${error}`);
		}
	}, 60000);

	afterAll(async () => {
		if (jwtToken && tenantId) {
			for (const actionId of createdActionIds) {
				try {
					await request(app.getHttpServer())
						.delete(`/api/v1/actions/${actionId}`)
						.set("Authorization", `Bearer ${jwtToken}`)
						.set("x-tenant-id", tenantId);
				} catch {
					// 이미 삭제된 데이터는 무시
				}
			}
		}

		if (app) {
			await app.close();
		}
	}, 30000);

	describe("GET /api/v1/actions", () => {
		it("Given 공개 엔드포인트가 열려 있을 때 When 액션 목록을 조회하면 Then 200과 ResponseEntity 배열을 반환해야 한다", async () => {
			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/actions")
				.query({ group: "crud" });

			// Then
			expect(response.status).toBe(200);
			expect(response.body.httpStatus).toBe(200);
			expect(response.body.data).toBeInstanceOf(Array);
			expect(response.body.message).toEqual(expect.any(String));
		});
	});

	describe("GET /api/v1/actions/:id", () => {
		it("Given 존재하지 않는 UUID가 있을 때 When 액션 단건을 조회하면 Then 404를 반환해야 한다", async () => {
			// Given
			const nonExistentActionId = "00000000-0000-0000-0000-000000000099";

			// When
			const response = await request(app.getHttpServer()).get(
				`/api/v1/actions/${nonExistentActionId}`,
			);

			// Then
			expect(response.status).toBe(404);
		});
	});

	describe("POST /api/v1/actions", () => {
		it("Given 인증 토큰과 x-tenant-id 헤더 및 유효한 데이터가 있을 때 When 액션을 생성하면 Then 201과 생성된 액션을 반환해야 한다", async () => {
			// Given
			if (!jwtToken || !tenantId) return;

			const createDto = {
				name: `${TEST_PREFIX}_NAME_${Date.now()}`,
				displayName: "E2E 액션",
				description: "E2E 생성 테스트",
				group: "workflow",
				order: 9999,
				config: {
					source: "e2e",
				},
			};

			// When
			const response = await request(app.getHttpServer())
				.post("/api/v1/actions")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId)
				.send(createDto);

			// Then
			expect(response.status).toBe(201);
			expect(response.body.httpStatus).toBe(201);
			expect(response.body.data.id).toBeDefined();
			expect(response.body.data.name).toBe(createDto.name);

			createdActionIds.push(response.body.data.id);
		});

		it("Given 필수 필드가 누락된 데이터가 있을 때 When 액션을 생성하면 Then 400을 반환해야 한다", async () => {
			// Given
			if (!jwtToken || !tenantId) return;

			const invalidDto = {
				displayName: "이름 누락",
				group: "crud",
				order: 1,
			};

			// When
			const response = await request(app.getHttpServer())
				.post("/api/v1/actions")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId)
				.send(invalidDto);

			// Then
			expect(response.status).toBe(400);
		});

		it("Given 인증 토큰 없이 요청할 때 When 액션을 생성하면 Then 401을 반환해야 한다", async () => {
			// Given
			if (!tenantId) return;

			const createDto = {
				name: `${TEST_PREFIX}_UNAUTH_${Date.now()}`,
				order: 1,
			};

			// When
			const response = await request(app.getHttpServer())
				.post("/api/v1/actions")
				.set("x-tenant-id", tenantId)
				.send(createDto);

			// Then
			expect(response.status).toBe(401);
		});
	});
});
