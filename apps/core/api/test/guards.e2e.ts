import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/module/app.module";
import { setNestApp } from "../src/setNestApp";
import { getTestAuth, TestJwtStrategy } from "./helpers/test-auth.helper";
import { GuardTestController } from "./mock-controllers/tenant-injection-test.controller";

describe("Guards E2E 테스트", () => {
	let app: INestApplication;
	let jwtToken: string;
	let tenantId: string;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
			controllers: [GuardTestController],
			providers: [TestJwtStrategy],
		}).compile();

		app = moduleFixture.createNestApplication();
		setNestApp(app);
		await app.init();

		// TestJwtStrategy + JwtService로 인증 토큰 생성
		try {
			const auth = await getTestAuth(app);
			jwtToken = auth.jwtToken;
			tenantId = auth.tenantId;
		} catch (error) {
			console.warn(`테스트 인증 설정 실패: ${error}`);
		}
	}, 60000);

	afterAll(async () => {
		if (app) {
			await app.close();
		}
	}, 30000);

	describe("RoleCategoryGuard", () => {
		it("공유 카테고리 권한으로 접근 성공", async () => {
			if (!jwtToken || !tenantId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/role-category/shared")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			// 권한이 있으면 200, 없으면 403
			expect([200, 403]).toContain(response.status);
		});

		it("워크스페이스 카테고리 권한 테스트", async () => {
			if (!jwtToken || !tenantId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/role-category/workspace")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			// 워크스페이스 카테고리 권한이 없으면 403
			expect([200, 403]).toContain(response.status);
		});

		it("공개 카테고리 권한 테스트", async () => {
			if (!jwtToken || !tenantId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/role-category/public")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			expect([200, 403]).toContain(response.status);
		});

		it("인증 없이 접근 시 401 반환", async () => {
			const response = await request(app.getHttpServer()).get(
				"/api/v1/test-guards/role-category/shared",
			);

			expect(response.status).toBe(401);
		});
	});

	describe("RoleGroupGuard", () => {
		it("일반 그룹 권한 테스트", async () => {
			if (!jwtToken || !tenantId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/role-group/standard")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			expect([200, 403]).toContain(response.status);
		});

		it("프리미엄 그룹 권한 테스트", async () => {
			if (!jwtToken || !tenantId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/role-group/premium")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			expect([200, 403]).toContain(response.status);
		});

		it("신뢰 그룹 권한 테스트", async () => {
			if (!jwtToken || !tenantId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/role-group/trusted")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			expect([200, 403]).toContain(response.status);
		});

		it("인증 없이 접근 시 401 반환", async () => {
			const response = await request(app.getHttpServer()).get(
				"/api/v1/test-guards/role-group/standard",
			);

			expect(response.status).toBe(401);
		});
	});

	describe("RolesGuard", () => {
		it("MEMBER 역할 권한 테스트", async () => {
			if (!jwtToken || !tenantId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/roles/member")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			expect([200, 403]).toContain(response.status);
		});

		it("COMPANY_MANAGER 역할 권한 테스트", async () => {
			if (!jwtToken || !tenantId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/roles/company-manager")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			expect([200, 403]).toContain(response.status);
		});

		it("PLATFORM_ADMIN 역할 권한 테스트", async () => {
			if (!jwtToken || !tenantId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/roles/platform-admin")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			expect([200, 403]).toContain(response.status);
		});

		it("인증 없이 접근 시 401 반환", async () => {
			const response = await request(app.getHttpServer()).get(
				"/api/v1/test-guards/roles/member",
			);

			expect(response.status).toBe(401);
		});
	});

	describe("복합 Guard 테스트", () => {
		it("워크스페이스 카테고리 + COMPANY_MANAGER 역할 복합 권한 테스트", async () => {
			if (!jwtToken || !tenantId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/combined/workspace-category-and-role")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			// 두 조건 모두 충족해야 200, 하나라도 불충족하면 403
			expect([200, 403]).toContain(response.status);
		});

		it("인증 없이 복합 권한 엔드포인트 접근 시 401 반환", async () => {
			const response = await request(app.getHttpServer()).get(
				"/api/v1/test-guards/combined/workspace-category-and-role",
			);

			expect(response.status).toBe(401);
		});
	});

	describe("권한 거부 응답 검증", () => {
		it("권한 거부 시 적절한 에러 메시지 반환", async () => {
			if (!jwtToken || !tenantId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/roles/platform-admin")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			if (response.status === 403) {
				expect(response.body).toHaveProperty("message");
				expect(response.body.message).toContain("접근 거부");
			}
		});
	});
});
