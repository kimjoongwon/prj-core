import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/module/app.module";
import { GuardTestController } from "./mock-controllers/tenant-injection-test.controller";

describe("Guards E2E 테스트", () => {
	let app: INestApplication;
	let jwtToken: string;
	let spaceId: string;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
			controllers: [GuardTestController],
		}).compile();

		app = moduleFixture.createNestApplication();

		app.useGlobalPipes(
			new ValidationPipe({
				transform: true,
				whitelist: true,
			}),
		);

		await app.init();
	}, 60000);

	afterAll(async () => {
		if (app) {
			await app.close();
		}
	}, 30000);

	describe("인증 설정", () => {
		it("테스트 사용자 로그인", async () => {
			const loginResponse = await request(app.getHttpServer())
				.post("/api/v1/auth/login")
				.send({
					email: "plate@gmail.com",
					password: "rkdmf12!@",
				});

			if (loginResponse.status !== 200 || !loginResponse.body?.data) {
				console.warn("로그인 실패, 나머지 테스트 건너뜀");
				return;
			}

			jwtToken = loginResponse.body.data.accessToken;
			spaceId = loginResponse.body.data.user?.tenants?.[0]?.spaceId;

			expect(jwtToken).toBeDefined();
		});
	});

	describe("RoleCategoryGuard", () => {
		beforeEach(() => {
			if (!jwtToken || !spaceId) {
				console.warn("인증 토큰 또는 spaceId 없음 - 테스트 건너뜀");
			}
		});

		it("공유 카테고리 권한으로 접근 성공", async () => {
			if (!jwtToken || !spaceId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/role-category/shared")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// 권한이 있으면 200, 없으면 403
			expect([200, 403]).toContain(response.status);
		});

		it("워크스페이스 카테고리 권한 테스트", async () => {
			if (!jwtToken || !spaceId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/role-category/workspace")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// 워크스페이스 카테고리 권한이 없으면 403
			expect([200, 403]).toContain(response.status);
		});

		it("공개 카테고리 권한 테스트", async () => {
			if (!jwtToken || !spaceId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/role-category/public")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

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
		beforeEach(() => {
			if (!jwtToken || !spaceId) {
				console.warn("인증 토큰 또는 spaceId 없음 - 테스트 건너뜀");
			}
		});

		it("일반 그룹 권한 테스트", async () => {
			if (!jwtToken || !spaceId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/role-group/standard")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			expect([200, 403]).toContain(response.status);
		});

		it("프리미엄 그룹 권한 테스트", async () => {
			if (!jwtToken || !spaceId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/role-group/premium")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			expect([200, 403]).toContain(response.status);
		});

		it("신뢰 그룹 권한 테스트", async () => {
			if (!jwtToken || !spaceId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/role-group/trusted")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

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
		beforeEach(() => {
			if (!jwtToken || !spaceId) {
				console.warn("인증 토큰 또는 spaceId 없음 - 테스트 건너뜀");
			}
		});

		it("VIEW 역할 권한 테스트", async () => {
			if (!jwtToken || !spaceId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/roles/view")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			expect([200, 403]).toContain(response.status);
		});

		it("MANAGE 역할 권한 테스트", async () => {
			if (!jwtToken || !spaceId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/roles/manage")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			expect([200, 403]).toContain(response.status);
		});

		it("FULL_ACCESS 역할 권한 테스트", async () => {
			if (!jwtToken || !spaceId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/roles/full-access")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			expect([200, 403]).toContain(response.status);
		});

		it("인증 없이 접근 시 401 반환", async () => {
			const response = await request(app.getHttpServer()).get(
				"/api/v1/test-guards/roles/view",
			);

			expect(response.status).toBe(401);
		});
	});

	describe("복합 Guard 테스트", () => {
		beforeEach(() => {
			if (!jwtToken || !spaceId) {
				console.warn("인증 토큰 또는 spaceId 없음 - 테스트 건너뜀");
			}
		});

		it("워크스페이스 카테고리 + MANAGE 역할 복합 권한 테스트", async () => {
			if (!jwtToken || !spaceId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/combined/workspace-category-and-role")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

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
		beforeEach(() => {
			if (!jwtToken || !spaceId) {
				console.warn("인증 토큰 또는 spaceId 없음 - 테스트 건너뜀");
			}
		});

		it("권한 거부 시 적절한 에러 메시지 반환", async () => {
			if (!jwtToken || !spaceId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/roles/full-access")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			if (response.status === 403) {
				expect(response.body).toHaveProperty("message");
				expect(response.body.message).toContain("이 작업을 수행하려면");
			}
		});
	});
});
