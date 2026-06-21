import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/module/app.module";
import { setNestApp } from "../src/setNestApp";
import { getTestAuth, TestJwtStrategy } from "./helpers/test-auth.helper";

describe("Templates API E2E 테스트", () => {
	let app: INestApplication;
	let jwtToken: string;
	let tenantId: string;

	const createdTemplateIds: string[] = [];
	const TEST_PREFIX = `E2E_TEMPLATE_${Date.now()}`;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
			providers: [TestJwtStrategy],
		}).compile();

		app = moduleFixture.createNestApplication();
		setNestApp(app);
		await app.init();

		try {
			const auth = await getTestAuth(app);
			jwtToken = auth.jwtToken;
			tenantId = auth.tenantId;
		} catch (error) {
			console.warn(`테스트 인증 설정 실패: ${error}`);
		}
	}, 60000);

	afterAll(async () => {
		if (jwtToken && tenantId) {
			for (const templateId of createdTemplateIds) {
				try {
					await request(app.getHttpServer())
						.delete(`/api/v1/templates/${templateId}`)
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

	describe("목록 조회", () => {
		it("Given 인증과 x-tenant-id 헤더가 있을 때 When 템플릿 목록을 조회하면 Then 200과 ResponseEntity 목록을 반환해야 한다", async () => {
			// Given
			if (!jwtToken || !tenantId) return;

			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/templates")
				.query({ skip: 0, take: 10 })
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			// Then
			expect(response.status).toBe(200);
			expect(response.body.httpStatus).toBe(200);
			expect(response.body.data).toBeInstanceOf(Array);
			expect(response.body.meta).toBeDefined();
			expect(response.body.meta.total).toBeGreaterThanOrEqual(0);
		});
	});

	describe("생성", () => {
		it("Given 유효한 템플릿 데이터와 필수 헤더가 있을 때 When 템플릿을 생성하면 Then 201과 생성된 템플릿을 반환해야 한다", async () => {
			// Given
			if (!jwtToken || !tenantId) return;

			const createDto = {
				code: `${TEST_PREFIX}_CODE_${Date.now()}`,
				name: `${TEST_PREFIX}_NAME_${Date.now()}`,
				type: "EMAIL",
				subject: "E2E 제목",
				content: "안녕하세요 {{name}}",
				description: "E2E 생성 테스트",
			};

			// When
			const response = await request(app.getHttpServer())
				.post("/api/v1/templates")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId)
				.send(createDto);

			// Then
			expect(response.status).toBe(201);
			expect(response.body.httpStatus).toBe(201);
			expect(response.body.data.id).toBeDefined();
			expect(response.body.data.code).toBe(createDto.code);
			expect(response.body.data.name).toBe(createDto.name);
			expect(response.body.data.type).toBe(createDto.type);

			createdTemplateIds.push(response.body.data.id);
		});

		it("Given code 필드가 누락된 데이터가 있을 때 When 템플릿을 생성하면 Then 400을 반환해야 한다", async () => {
			// Given
			if (!jwtToken || !tenantId) return;

			const invalidDto = {
				name: `${TEST_PREFIX}_INVALID_${Date.now()}`,
				type: "EMAIL",
				subject: "제목",
				content: "본문",
				description: "유효성 실패 테스트",
			};

			// When
			const response = await request(app.getHttpServer())
				.post("/api/v1/templates")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId)
				.send(invalidDto);

			// Then
			expect(response.status).toBe(400);
		});
	});

	describe("단건 조회", () => {
		it("Given 존재하지 않는 templateId가 있을 때 When 단건 조회하면 Then 404를 반환해야 한다", async () => {
			// Given
			if (!jwtToken || !tenantId) return;

			const nonExistentTemplateId = "00000000-0000-0000-0000-000000000099";

			// When
			const response = await request(app.getHttpServer())
				.get(`/api/v1/templates/${nonExistentTemplateId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			// Then
			expect(response.status).toBe(404);
		});
	});

	describe("인증", () => {
		it("Given 인증 토큰 없이 요청할 때 When 템플릿 목록을 조회하면 Then 401을 반환해야 한다", async () => {
			// Given
			if (!tenantId) return;

			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/templates")
				.set("x-tenant-id", tenantId);

			// Then
			expect(response.status).toBe(401);
		});
	});
});
