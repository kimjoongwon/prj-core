import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/module/app.module";
import { TenantInjectionTestController } from "./mock-controllers/tenant-injection-test.controller";

describe("앱 E2E 테스트", () => {
	let app: INestApplication;
	let jwtToken: string;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
			controllers: [TenantInjectionTestController], // 테스트용 모킹 컨트롤러 추가
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

	describe("인증", () => {
		it("기존 사용자 등록 후 로그인하고 JWT 토큰을 반환해야 함", async () => {
			const userData = {
				nickname: "testuser",
				spaceId: "00000000-0000-0000-0000-000000000000", // 임시 UUID
				email: "plate@gmail.com",
				name: "Test User",
				password: "rkdmf12!@",
				phone: "+8201012345678",
			};

			// Try to register first (might fail if user already exists, which is okay)
			try {
				await request(app.getHttpServer())
					.post("/api/v1/auth/sign-up")
					.send(userData);
			} catch (error) {
				// User might already exist, continue with login
			}

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

	describe("카테고리", () => {
		it("새 카테고리를 생성하고 201과 생성된 데이터를 반환해야 함", async () => {
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

		it("카테고리 목록을 가져오고 생성된 카테고리가 포함되어 있는지 확인해야 함", async () => {
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

	describe("테넌트 ID 주입", () => {
		let authToken: string;

		beforeEach(async () => {
			// Use the existing JWT token from global authentication setup
			authToken = jwtToken;
			expect(authToken).toBeDefined();
		});

		it("injectTenant이 true일 때(기본값) GET 요청 쿼리에 tenantId를 주입해야 함", async () => {
			try {
				console.log("=== Starting test ===");
				console.log("Using JWT token:", authToken ? "present" : "missing");

				const response = await request(app.getHttpServer())
					.get("/api/v1/test-tenant-injection/debug-query?testParam=value")
					.set("Authorization", `Bearer ${authToken}`);

				console.log("Response received:");
				console.log("Status:", response.status);
				console.log("Body:", JSON.stringify(response.body, null, 2));

				expect(response.status).toBe(200);

				// Check if tenantId was injected
				if (response.body.data.hasTenantId) {
					expect(response.body.data.hasTenantId).toBe(true);
					expect(response.body.data.tenantId).toBeDefined();
					expect(typeof response.body.data.tenantId).toBe("string");
					expect(response.body.data.receivedQuery).toEqual({
						testParam: "value",
						tenantId: response.body.data.tenantId,
					});
				} else {
					console.log(
						"TenantId was NOT injected. Current query:",
						response.body.data.receivedQuery,
					);
					throw new Error(
						`tenantId was not injected to query. Expected hasTenantId: true, but got: false`,
					);
				}
			} catch (error) {
				console.log("Test error:", error);
				throw error;
			}
		});

		it("injectTenant이 false일 때 GET 요청 쿼리에 tenantId를 주입하지 않아야 함", async () => {
			const response = await request(app.getHttpServer())
				.get(
					"/api/v1/test-tenant-injection/debug-query-no-injection?testParam=value",
				)
				.set("Authorization", `Bearer ${jwtToken}`)
				.expect(200);

			// Check that tenantId was not injected
			expect(response.body.data.hasTenantId).toBe(false);
			expect(response.body.data.tenantId).toBeUndefined();
			expect(response.body.data.receivedQuery).toEqual({
				testParam: "value",
			});
		});

		it("GET 요청 쿼리에 tenantId를 주입하고 기능을 확인해야 함", async () => {
			const response = await request(app.getHttpServer())
				.get(
					"/api/v1/test-tenant-injection/debug-query?param1=value1&param2=value2",
				)
				.set("Authorization", `Bearer ${jwtToken}`)
				.expect(200);

			// Verify that tenantId was injected along with other parameters
			expect(response.body.data.hasTenantId).toBe(true);
			expect(response.body.data.tenantId).toBeDefined();
			expect(response.body.data.receivedQuery).toEqual({
				param1: "value1",
				param2: "value2",
				tenantId: response.body.data.tenantId,
			});
			expect(response.body.message).toBe("Debug query parameters");
		});

		it("이미 존재하는 tenantId가 쿼리에 있다면 유지해야 함", async () => {
			const existingTenantId = "existing-tenant-id";
			const response = await request(app.getHttpServer())
				.get(
					`/api/v1/test-tenant-injection/debug-query?testParam=value&tenantId=${existingTenantId}`,
				)
				.set("Authorization", `Bearer ${jwtToken}`)
				.expect(200);

			// tenantId injection should not override existing tenantId
			expect(response.body.data.hasTenantId).toBe(true);
			expect(response.body.data.tenantId).toBe(existingTenantId);
			expect(response.body.data.receivedQuery).toEqual({
				testParam: "value",
				tenantId: existingTenantId,
			});
		});

		it("다른 쿼리 파라미터가 있어도 injectTenant이 false이면 tenantId를 주입하지 않아야 함", async () => {
			const response = await request(app.getHttpServer())
				.get(
					"/api/v1/test-tenant-injection/debug-query-no-injection?param1=value1&param2=value2",
				)
				.set("Authorization", `Bearer ${jwtToken}`)
				.expect(200);

			// Verify no tenantId injection
			expect(response.body.data.hasTenantId).toBe(false);
			expect(response.body.data.tenantId).toBeUndefined();
			expect(response.body.data.receivedQuery).toEqual({
				param1: "value1",
				param2: "value2",
			});
		});
	});

	describe("Role Category 권한 테스트", () => {
		let authToken: string;

		beforeEach(async () => {
			// Use the existing JWT token from global authentication setup
			authToken = jwtToken;
			expect(authToken).toBeDefined();
		});

		it("Role Category Guard가 제대로 작동하는지 테스트 - 카테고리가 없는 사용자는 접근이 거부되어야 함", async () => {
			const response = await request(app.getHttpServer())
				.get("/api/v1/test-tenant-injection/test-role-category-common")
				.set("Authorization", `Bearer ${authToken}`)
				.expect(403);

			expect(response.body).toHaveProperty("message");
			expect(response.body.message).toContain(
				"다음 역할 카테고리 중 하나에 속해야 합니다",
			);
			expect(response.body.message).toContain("공통");
			expect(response.body.message).toContain(
				"현재 사용자의 역할 카테고리 계층",
			);
		});

		it("Role Category Guard가 제대로 작동하는지 테스트 - 관리자 카테고리도 접근이 거부되어야 함", async () => {
			const response = await request(app.getHttpServer())
				.get("/api/v1/test-tenant-injection/test-role-category-admin")
				.set("Authorization", `Bearer ${authToken}`)
				.expect(403);

			expect(response.body).toHaveProperty("message");
			expect(response.body.message).toContain(
				"다음 역할 카테고리 중 하나에 속해야 합니다",
			);
			expect(response.body.message).toContain("관리자");
			expect(response.body.message).toContain(
				"현재 사용자의 역할 카테고리 계층",
			);
		});
	});

	describe("Role Group 권한 테스트", () => {
		let authToken: string;

		beforeEach(async () => {
			// Use the existing JWT token from global authentication setup
			authToken = jwtToken;
			expect(authToken).toBeDefined();
		});

		it("Role Group Guard가 제대로 작동하는지 테스트 - 일반 그룹 접근 테스트", async () => {
			const response = await request(app.getHttpServer())
				.get("/api/v1/test-tenant-injection/test-role-group-normal")
				.set("Authorization", `Bearer ${authToken}`)
				.expect(403);

			expect(response.body).toHaveProperty("message");
			expect(response.body.message).toContain(
				"다음 역할 그룹 중 하나에 속해야 합니다",
			);
			expect(response.body.message).toContain("일반");
			expect(response.body.message).toContain("현재 사용자의 역할 그룹");
		});

		it("Role Group Guard가 제대로 작동하는지 테스트 - VIP 그룹 접근 테스트", async () => {
			const response = await request(app.getHttpServer())
				.get("/api/v1/test-tenant-injection/test-role-group-vip")
				.set("Authorization", `Bearer ${authToken}`)
				.expect(403);

			expect(response.body).toHaveProperty("message");
			expect(response.body.message).toContain(
				"다음 역할 그룹 중 하나에 속해야 합니다",
			);
			expect(response.body.message).toContain("VIP");
			expect(response.body.message).toContain("현재 사용자의 역할 그룹");
		});
	});
});
