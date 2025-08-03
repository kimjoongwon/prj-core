import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/module/app.module";

describe("App E2E Tests", () => {
	let app: INestApplication;
	let jwtToken: string;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();

		// ValidationPipe 전역 설정 (main.ts와 동일)
		app.useGlobalPipes(
			new ValidationPipe({
				transform: true,
				whitelist: true,
				forbidNonWhitelisted: true, // 정확한 에러 메시지를 위해 추가
			}),
		);

		await app.init();
	}, 60000);

	afterAll(async () => {
		if (app) {
			await app.close();
		}
	}, 30000);

	describe("Authentication", () => {
		it("should register a new user and return JWT token", async () => {
			const uniqueId = Date.now();
			const userData = {
				nickname: `testuser${uniqueId}`,
				spaceId: "00000000-0000-0000-0000-000000000000", // 임시 UUID
				email: `test${uniqueId}@example.com`,
				name: `Test User ${uniqueId}`,
				password: "password123",
				phone: `+8210${uniqueId.toString().slice(-8)}`,
			};

			const response = await request(app.getHttpServer())
				.post("/api/v1/auth/sign-up")
				.send(userData)
				.expect(201);

			expect(response.body.data).toHaveProperty("accessToken");
			expect(response.body.data.accessToken).toBeDefined();
			expect(typeof response.body.data.accessToken).toBe("string");
		});

		it("should login with existing user and return JWT token", async () => {
			const uniqueId = Date.now();
			const userData = {
				nickname: `testuser${uniqueId}`,
				spaceId: "00000000-0000-0000-0000-000000000000", // 임시 UUID
				email: `test${uniqueId}@example.com`,
				name: `Test User ${uniqueId}`,
				password: "password123",
				phone: `+8210${uniqueId.toString().slice(-8)}`,
			};

			await request(app.getHttpServer())
				.post("/api/v1/auth/sign-up")
				.send(userData);

			const loginResponse = await request(app.getHttpServer())
				.post("/api/v1/auth/login")
				.send({
					email: userData.email,
					password: userData.password,
				})
				.expect(200);

			expect(loginResponse.body.data).toHaveProperty("accessToken");
			expect(loginResponse.body.data.accessToken).toBeDefined();
			expect(typeof loginResponse.body.data.accessToken).toBe("string");

			jwtToken = loginResponse.body.data.accessToken;
		});
	});

	describe("Categories", () => {
		it("should create a new category and return 201 with created data", async () => {
			const categoryData = {
				name: `Test Category ${Date.now()}`,
				type: "User", // 기본값으로 User 타입 명시적 지정
			};

			const response = await request(app.getHttpServer())
				.post("/api/v1/categories")
				.set("Authorization", `Bearer ${jwtToken}`)
				.send(categoryData)
				.expect(200);

			expect(response.body.data).toHaveProperty("id");
			expect(response.body.data.name).toBe(categoryData.name);
			expect(response.body.data).toHaveProperty("createdAt");
			expect(response.body.data).toHaveProperty("updatedAt");
		});

		it("should get category list and verify created category is included", async () => {
			const categoryData = {
				name: `Unique Category ${Date.now()}`,
				type: "User", // 기본값으로 User 타입 명시적 지정
			};

			const createResponse = await request(app.getHttpServer())
				.post("/api/v1/categories")
				.set("Authorization", `Bearer ${jwtToken}`)
				.send(categoryData)
				.expect(200);

			const getResponse = await request(app.getHttpServer())
				.get("/api/v1/categories")
				.set("Authorization", `Bearer ${jwtToken}`)
				.expect(200);

			expect(Array.isArray(getResponse.body.data)).toBe(true);

			const createdCategory = getResponse.body.data.find(
				(category: any) => category.id === createResponse.body.data.id,
			);

			expect(createdCategory).toBeDefined();
			expect(createdCategory.name).toBe(categoryData.name);
		});
	});
});
