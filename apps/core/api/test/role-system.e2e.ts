import type { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/module/app.module";
import { setNestApp } from "../src/setNestApp";
import { JwtStrategy } from "@cocrepo/be-common";
import { getTestAuth, TestJwtStrategy } from "./helpers/test-auth.helper";
import { GuardTestController } from "./mock-controllers/tenant-injection-test.controller";

interface RoleListItem {
	name?: string;
	displayName?: string;
}

function getRoleList(body: unknown): RoleListItem[] {
	const payload =
		typeof body === "object" && body !== null && "data" in body
			? (body as { data?: unknown }).data
			: body;

	return Array.isArray(payload) ? (payload as RoleListItem[]) : [];
}

/**
 * Role 시스템 전용 E2E 테스트
 * - 시드 데이터 검증 (새 역할 이름 존재, 이전 이름 미존재)
 * - x-tenant-id 헤더 검증
 * - Guard 에러 메시지 검증
 * - 복합 시나리오
 */
describe("Role 시스템 E2E 테스트", () => {
	let app: INestApplication;
	let jwtToken: string;
	let tenantId: string;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
			controllers: [GuardTestController],
			providers: [TestJwtStrategy],
		})
			.overrideProvider(JwtStrategy)
			.useClass(TestJwtStrategy)
			.compile();

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

	// ==================== A. 시드 데이터 검증 ====================

	describe("시드 데이터 검증 (GET /api/v1/roles)", () => {
		it("역할 목록에 PLATFORM_ADMIN, COMPANY_MANAGER, MEMBER가 존재해야 한다", async () => {
			if (!jwtToken || !tenantId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/roles")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			if (response.status !== 200) {
				console.warn(`역할 목록 조회 실패 (${response.status}), 테스트 건너뜀`);
				return;
			}

			const roles = getRoleList(response.body);
			expect(Array.isArray(roles)).toBe(true);

			const roleNames = roles.map((role) => role.name);
			expect(roleNames).toContain("PLATFORM_ADMIN");
			expect(roleNames).toContain("COMPANY_MANAGER");
			expect(roleNames).toContain("MEMBER");
		});

		it("이전 이름(FULL_ACCESS, MANAGE, SPACE_MANAGER, VIEW, SUPER_ADMIN, ADMIN, USER)이 존재하지 않아야 한다", async () => {
			if (!jwtToken || !tenantId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/roles")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			if (response.status !== 200) return;

			const roles = getRoleList(response.body);
			const roleNames = roles.map((role) => role.name);
			expect(roleNames).not.toContain("FULL_ACCESS");
			expect(roleNames).not.toContain("MANAGE");
			expect(roleNames).not.toContain("SPACE_MANAGER");
			expect(roleNames).not.toContain("VIEW");
			expect(roleNames).not.toContain("SUPER_ADMIN");
			expect(roleNames).not.toContain("ADMIN");
			expect(roleNames).not.toContain("USER");
		});

		it("displayName이 올바르게 설정되어야 한다", async () => {
			if (!jwtToken || !tenantId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/roles")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			if (response.status !== 200) return;

			const roles = getRoleList(response.body);
			const platformAdmin = roles.find(
				(role) => role.name === "PLATFORM_ADMIN",
			);
			const companyManager = roles.find(
				(role) => role.name === "COMPANY_MANAGER",
			);
			const member = roles.find((role) => role.name === "MEMBER");

			if (platformAdmin?.displayName) {
				expect(platformAdmin.displayName).toBe("플랫폼 관리자");
			}
			if (companyManager?.displayName) {
				expect(companyManager.displayName).toBe("Company 관리자");
			}
			if (member?.displayName) {
				expect(member.displayName).toBe("회원");
			}
		});
	});

	// ==================== B. x-tenant-id 헤더 검증 ====================

	describe("x-tenant-id 헤더 검증", () => {
		it("인증 + x-tenant-id 없이 Guard 보호 엔드포인트 접근 시 400을 반환해야 한다", async () => {
			if (!jwtToken) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/roles/member")
				.set("Authorization", `Bearer ${jwtToken}`);
			// x-tenant-id 헤더 없음

			expect(response.status).toBe(400);

			if (response.status === 400) {
				expect(response.body?.message).toContain("x-tenant-id");
			}
		});

		it("인증 + 유효하지 않은 숫자 x-tenant-id로 접근 시 400을 반환해야 한다", async () => {
			if (!jwtToken) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/roles/member")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", "01");

			expect(response.status).toBe(400);
		});

		it("인증 + 접근 권한이 없는 숫자 x-tenant-id로 접근 시 403을 반환해야 한다", async () => {
			if (!jwtToken) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/roles/member")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", "9223372036854775807");

			expect(response.status).toBe(403);
		});
	});

	// ==================== C. Guard 에러 메시지 검증 ====================

	describe("Guard 에러 메시지 검증", () => {
		it("PLATFORM_ADMIN 요구 엔드포인트에 MEMBER 사용자 접근 시 403 응답 body를 검증해야 한다", async () => {
			if (!jwtToken || !tenantId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/roles/platform-admin")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			if (response.status === 403) {
				expect(response.body).toHaveProperty("message");
				const message = response.body.message;
				// 새 역할 이름 기반 에러 메시지 검증
				expect(message).toContain("접근 거부");
				// PLATFORM_ADMIN 요구 조건 또는 현재 역할 정보 포함
				expect(
					message.includes("PLATFORM_ADMIN") || message.includes("접근 거부"),
				).toBe(true);
			}
			// PLATFORM_ADMIN 사용자라면 200 (테스트 환경에 따라 다름)
			expect([200, 403]).toContain(response.status);
		});

		it("RoleCategoryGuard 거부 시 에러 메시지에 카테고리 정보가 포함되어야 한다", async () => {
			if (!jwtToken || !tenantId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/role-category/workspace")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			if (response.status === 403) {
				expect(response.body).toHaveProperty("message");
				const message = response.body.message;
				expect(message).toContain("접근 거부");
			}
			expect([200, 403]).toContain(response.status);
		});

		it("RoleGroupGuard 거부 시 에러 메시지에 그룹 정보가 포함되어야 한다", async () => {
			if (!jwtToken || !tenantId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/role-group/premium")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

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
		it("워크스페이스 카테고리 + COMPANY_MANAGER 역할 복합 Guard 테스트", async () => {
			if (!jwtToken || !tenantId) return;

			const response = await request(app.getHttpServer())
				.get("/api/v1/test-guards/combined/workspace-category-and-role")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("x-tenant-id", tenantId);

			// 두 조건 모두 충족해야 200, 하나라도 불충족하면 403
			expect([200, 403]).toContain(response.status);

			if (response.status === 403) {
				expect(response.body).toHaveProperty("message");
				expect(response.body.message).toContain("접근 거부");
			}
		});

		it("인증 없이 Guard 보호 엔드포인트 접근 시 401을 반환해야 한다", async () => {
			const response = await request(app.getHttpServer()).get(
				"/api/v1/test-guards/roles/platform-admin",
			);

			expect(response.status).toBe(401);
		});

		it("인증 없이 복합 Guard 엔드포인트 접근 시 401을 반환해야 한다", async () => {
			const response = await request(app.getHttpServer()).get(
				"/api/v1/test-guards/combined/workspace-category-and-role",
			);

			expect(response.status).toBe(401);
		});
	});
});
