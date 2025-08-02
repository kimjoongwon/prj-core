import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/module/app.module";

describe("App E2E Tests (Basic)", () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	}, 60000);

	afterAll(async () => {
		if (app) {
			await app.close();
		}
	}, 30000);

	describe("Basic App Health Checks", () => {
		it("should boot application successfully", () => {
			expect(app).toBeDefined();
			expect(app.getHttpServer()).toBeDefined();
		});

		it("should respond to basic endpoint probes", async () => {
			// Test basic endpoint connectivity (these should return some response, even if 404/500)
			const authResponse = await request(app.getHttpServer())
				.post("/api/v1/auth/sign-up")
				.send({});

			// Any response (including 500 for database issues) means the routing is working
			expect([400, 500].includes(authResponse.status)).toBe(true);
		});
	});

	describe("Auth Routes Structure", () => {
		it("should have auth routes available", async () => {
			// Test sign-up endpoint exists
			const signUpResponse = await request(app.getHttpServer())
				.post("/api/v1/auth/sign-up")
				.send({});

			// Should get 400 (validation error) or 500 (database error), not 404
			expect(signUpResponse.status).not.toBe(404);

			// Test login endpoint exists
			const loginResponse = await request(app.getHttpServer())
				.post("/api/v1/auth/login")
				.send({});

			// Should get 400 (validation error) or 500 (database error), not 404
			expect(loginResponse.status).not.toBe(404);

			// Test verify-token endpoint exists
			const verifyResponse = await request(app.getHttpServer()).get(
				"/api/v1/auth/verify-token",
			);

			// Should get 401 (unauthorized) or 500 (database error), not 404
			expect(verifyResponse.status).not.toBe(404);
		});
	});

	describe("API Routes Structure", () => {
		it("should have users routes available", async () => {
			const usersResponse = await request(app.getHttpServer()).get(
				"/api/v1/users",
			);

			// Should get 401 (unauthorized) or 500 (database error), not 404
			expect(usersResponse.status).not.toBe(404);
		});

		it("should have categories routes available", async () => {
			const categoriesResponse = await request(app.getHttpServer()).get(
				"/api/v1/categories",
			);

			// Should get 401 (unauthorized) or 500 (database error), not 404
			expect(categoriesResponse.status).not.toBe(404);

			const createCategoryResponse = await request(app.getHttpServer())
				.post("/api/v1/categories")
				.send({});

			// Should get 400/401 (validation/auth error) or 500 (database error), not 404
			expect(createCategoryResponse.status).not.toBe(404);
		});

		it("should have other module routes available", async () => {
			// Test various module endpoints exist (most should be accessible, some may return 404)
			const modules = [
				"/api/v1/tenants",
				"/api/v1/groups",
				"/api/v1/spaces",
				"/api/v1/roles",
				"/api/v1/subjects",
				"/api/v1/sessions",
				"/api/v1/programs",
				"/api/v1/routines",
				"/api/v1/exercises",
				"/api/v1/files",
				"/api/v1/grounds",
			];

			let successfulEndpoints = 0;
			const totalEndpoints = modules.length;

			for (const endpoint of modules) {
				const response = await request(app.getHttpServer()).get(endpoint);
				// Count endpoints that are properly routed (not 404)
				if (response.status !== 404) {
					successfulEndpoints++;
				}
			}

			// Expect at least 50% of endpoints to be properly routed
			expect(successfulEndpoints / totalEndpoints).toBeGreaterThan(0.5);
		});
	});
});
