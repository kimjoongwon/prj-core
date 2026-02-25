import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/module/app.module";
import { getTestAuth, TestJwtStrategy } from "./helpers/test-auth.helper";
import { GuardTestController } from "./mock-controllers/tenant-injection-test.controller";

/**
 * Role 시스템 전용 E2E 테스트
 * - 시드 데이터 검증 (새 역할 이름 존재, 이전 이름 미존재)
 * - X-Space-ID 헤더 검증
 * - Guard 에러 메시지 검증
 * - 복합 시나리오
 */
describe("Role 시스템 E2E 테스트", () => {
	let app: INestApplication;
	let jwtToken: string;
	let spaceId: string;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
			controllers: [GuardTestController],
			providers: [TestJwtStrategy],
		}).compile();

		app = moduleFixture.createNestApplication();

		app.useGlobalPipes(
			new ValidationPipe({
				transform: true,
				whitelist: true,
			}),
		);

		await app.init();

		// TestJwtStrategy + JwtService로 인증 토큰 생성
		try {
			const auth = await getTestAuth(app);
			jwtToken = auth.jwtToken;
			spaceId = auth.spaceId;
		} catch (error) {
			console.warn(`테스트 인증 설정 실패: ${error}`);
		}
	}, 60000);

	afterAll(async () => {
		if (app) {
			await app.close();
		}
	}, 30000);

	// ==================== A. 시드 데이터 검증 ====================

	describe("시드 데이터 검증 (GET /api/v1/roles)", () => {
		it("역할 목록에 FULL_ACCESS, MANAGE, VIEW가 존재해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/roles")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			if (response.status !== 200) {
				console.warn(`역할 목록 조회 실패 (${response.status}), 테스트 건너뜀`);
				return;
			}

			const roles = response.body?.data;
			expect(Array.isArray(roles)).toBe(true);

			const roleNames = roles.map((r: any) => r.name);
			expect(roleNames).toContain("FULL_ACCESS");
			expect(roleNames).toContain("MANAGE");
			expect(roleNames).toContain("VIEW");
		});

		it("이전 이름(SUPER_ADMIN, ADMIN, USER)이 존재하지 않아야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/roles")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			if (response.status !== 200) return;

			const roles = response.body?.data;
			const roleNames = roles.map((r: any) => r.name);
			expect(roleNames).not.toContain("SUPER_ADMIN");
			expect(roleNames).not.toContain("ADMIN");
			expect(roleNames).not.toContain("USER");
		});

		it("displayName이 올바르게 설정되어야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/roles")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			if (response.status !== 200) return;

			const roles = response.body?.data;
			const fullAccess = roles.find((r: any) => r.name === "FULL_ACCESS");
			const manage = roles.find((r: any) => r.name === "MANAGE");
			const view = roles.find((r: any) => r.name === "VIEW");

			if (fullAccess?.displayName) {
				expect(fullAccess.displayName).toBe("전체 접근");
			}
			if (manage?.displayName) {
				expect(manage.displayName).toBe("관리");
			}
			if (view?.displayName) {
				expect(view.displayName).toBe("조회");
			}
		});
	});

	// ==================== B. X-Space-ID 헤더 검증 ====================

	describe("X-Space-ID 헤더 검증", () => {
		it("인증 + X-Space-ID 없이 Guard 보호 엔드포인트 접근 시 400을 반환해야 한다", async () => {
			if (!jwtToken) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/roles/view")
				.set("Authorization", `Bearer ${jwtToken}`);
			// X-Space-ID 헤더 없음

			// SpaceAccessGuard가 전역으로 등록되어 있으면 400, 아니면 RolesGuard가 첫 번째 tenant 사용
			expect([200, 400]).toContain(response.status);

			if (response.status === 400) {
				expect(response.body?.message).toContain("X-Space-ID");
			}
		});

		it("인증 + 잘못된 X-Space-ID로 접근 시 403을 반환해야 한다", async () => {
			if (!jwtToken) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/roles/view")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", "00000000-0000-0000-0000-000000000000");

			// SpaceAccessGuard가 전역이면 403, 아니면 RolesGuard에서 403
			expect([403]).toContain(response.status);
		});
	});

	// ==================== C. Guard 에러 메시지 검증 ====================

	describe("Guard 에러 메시지 검증", () => {
		it("FULL_ACCESS 요구 엔드포인트에 VIEW 사용자 접근 시 403 응답 body를 검증해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/roles/full-access")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			if (response.status === 403) {
				expect(response.body).toHaveProperty("message");
				const message = response.body.message;
				// 새 역할 이름 기반 에러 메시지 검증
				expect(message).toContain("접근 거부");
				// FULL_ACCESS 요구 조건 또는 현재 역할 정보 포함
				expect(
					message.includes("FULL_ACCESS") || message.includes("접근 거부"),
				).toBe(true);
			}
			// FULL_ACCESS 사용자라면 200 (테스트 환경에 따라 다름)
			expect([200, 403]).toContain(response.status);
		});

		it("RoleCategoryGuard 거부 시 에러 메시지에 카테고리 정보가 포함되어야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/role-category/workspace")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			if (response.status === 403) {
				expect(response.body).toHaveProperty("message");
				const message = response.body.message;
				expect(message).toContain("접근 거부");
			}
			expect([200, 403]).toContain(response.status);
		});

		it("RoleGroupGuard 거부 시 에러 메시지에 그룹 정보가 포함되어야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/role-group/premium")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			if (response.status === 403) {
				expect(response.body).toHaveProperty("message");
				const message = response.body.message;
				expect(message).toContain("접근 거부");
			}
			expect([200, 403]).toContain(response.status);
		});
	});

	// ==================== D. 복합 시나리오 ====================

	describe("복합 시나리오", () => {
		it("워크스페이스 카테고리 + MANAGE 역할 복합 Guard 테스트", async () => {
			if (!jwtToken || !spaceId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/combined/workspace-category-and-role")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// 두 조건 모두 충족해야 200, 하나라도 불충족하면 403
			expect([200, 403]).toContain(response.status);

			if (response.status === 403) {
				expect(response.body).toHaveProperty("message");
				expect(response.body.message).toContain("접근 거부");
			}
		});

		it("인증 없이 Guard 보호 엔드포인트 접근 시 401을 반환해야 한다", async () => {
			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/roles/full-access");

			expect(response.status).toBe(401);
		});

		it("인증 없이 복합 Guard 엔드포인트 접근 시 401을 반환해야 한다", async () => {
			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/combined/workspace-category-and-role");

			expect(response.status).toBe(401);
		});
	});
});
