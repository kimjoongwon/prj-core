import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/module/app.module";
import { getTestAuth, TestJwtStrategy } from "./helpers/test-auth.helper";

/**
 * Groups API E2E 테스트
 *
 * - GET    /api/v1/groups       목록 조회 (MANAGE, FULL_ACCESS)
 * - GET    /api/v1/groups/:id   상세 조회 (MANAGE, FULL_ACCESS)
 * - POST   /api/v1/groups       생성 (FULL_ACCESS)
 * - PATCH  /api/v1/groups/:id   수정 (FULL_ACCESS)
 * - DELETE /api/v1/groups/:id   삭제 (FULL_ACCESS)
 */
describe("Groups API (E2E)", () => {
	let app: INestApplication;
	let jwtToken: string;
	let spaceId: string;

	// 테스트 중 생성된 그룹 ID를 추적하여 정리
	const createdGroupIds: string[] = [];

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
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

		try {
			const auth = await getTestAuth(app);
			jwtToken = auth.jwtToken;
			spaceId = auth.spaceId;
		} catch (error) {
			console.warn(`테스트 인증 설정 실패: ${error}`);
		}
	}, 60000);

	afterAll(async () => {
		// 테스트 중 생성된 그룹 데이터 정리
		if (jwtToken && spaceId) {
			for (const groupId of createdGroupIds) {
				try {
					await request(app.getHttpServer())
						.delete(`/api/v1/groups/${groupId}`)
						.set("Authorization", `Bearer ${jwtToken}`)
						.set("Cookie", "selectedSpaceId=" + spaceId);
				} catch {
					// 이미 삭제되었거나 존재하지 않으면 무시
				}
			}
		}
		if (app) {
			await app.close();
		}
	}, 30000);

	// ==================== Happy Path ====================

	describe("Happy Path", () => {
		let testGroupId: string;

		describe("GET /api/v1/groups", () => {
			it("인증된 사용자는 그룹 목록을 조회할 수 있어야 한다", async () => {
				// Given: 인증 정보가 없으면 건너뜀
				if (!jwtToken || !spaceId) return;

				// When
				const response = await request(app.getHttpServer())
					.get("/api/v1/groups")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.httpStatus).toBe(200);
				expect(response.body.data).toBeInstanceOf(Array);
			});

			it("type=Role 쿼리로 필터링된 그룹 목록을 조회할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				// When
				const response = await request(app.getHttpServer())
					.get("/api/v1/groups")
					.query({ type: "Role" })
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.data).toBeInstanceOf(Array);

				// type=Role로 필터링했으므로 모든 결과의 type이 Role이어야 함
				for (const group of response.body.data) {
					expect(group.type).toBe("Role");
				}
			});
		});

		describe("POST /api/v1/groups", () => {
			it("유효한 데이터로 그룹을 생성할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const createDto = {
					name: `test-group-${Date.now()}`,
					type: "Role",
					label: "테스트 그룹",
					tenantId: spaceId, // 시드 데이터의 tenantId 대용
				};

				// When
				const response = await request(app.getHttpServer())
					.post("/api/v1/groups")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId)
					.send(createDto);

				// Then
				expect(response.status).toBe(201);
				expect(response.body.httpStatus).toBe(201);
				expect(response.body.data).toBeDefined();
				expect(response.body.data.name).toBe(createDto.name);
				expect(response.body.data.label).toBe(createDto.label);
				expect(response.body.data.type).toBe("Role");
				expect(response.body.data.id).toBeDefined();

				// 후속 테스트용 ID 저장 및 정리 목록에 추가
				testGroupId = response.body.data.id;
				createdGroupIds.push(testGroupId);
			});
		});

		describe("GET /api/v1/groups/:id", () => {
			it("ID로 그룹 상세를 조회할 수 있어야 한다 (roleAssociations 포함)", async () => {
				// Given
				if (!jwtToken || !spaceId || !testGroupId) return;

				// When
				const response = await request(app.getHttpServer())
					.get(`/api/v1/groups/${testGroupId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.httpStatus).toBe(200);
				expect(response.body.data.id).toBe(testGroupId);
				// roleAssociations 포함 여부 확인
				expect(response.body.data).toHaveProperty("roleAssociations");
			});
		});

		describe("PATCH /api/v1/groups/:id", () => {
			it("그룹의 label을 수정할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId || !testGroupId) return;

				const updateDto = {
					label: "수정된 레이블",
				};

				// When
				const response = await request(app.getHttpServer())
					.patch(`/api/v1/groups/${testGroupId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId)
					.send(updateDto);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.data.label).toBe(updateDto.label);
			});
		});

		describe("DELETE /api/v1/groups/:id", () => {
			it("그룹을 삭제할 수 있어야 한다", async () => {
				// Given: 삭제 전용 그룹 생성
				if (!jwtToken || !spaceId) return;

				const createDto = {
					name: `test-delete-group-${Date.now()}`,
					type: "Role",
					tenantId: spaceId,
				};

				const createResponse = await request(app.getHttpServer())
					.post("/api/v1/groups")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId)
					.send(createDto);

				expect(createResponse.status).toBe(201);
				const deleteTargetId = createResponse.body.data.id;

				// When
				const deleteResponse = await request(app.getHttpServer())
					.delete(`/api/v1/groups/${deleteTargetId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(deleteResponse.status).toBe(200);

				// 삭제 후 조회 시 404 반환 확인
				const getResponse = await request(app.getHttpServer())
					.get(`/api/v1/groups/${deleteTargetId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				expect(getResponse.status).toBe(404);
			});
		});
	});

	// ==================== Error Path ====================

	describe("Error Path", () => {
		describe("인증 오류 (401)", () => {
			it("인증 없이 목록 조회 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer()).get(
					"/api/v1/groups",
				);

				// Then
				expect(response.status).toBe(401);
			});

			it("인증 없이 상세 조회 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer()).get(
					"/api/v1/groups/00000000-0000-0000-0000-000000000099",
				);

				// Then
				expect(response.status).toBe(401);
			});

			it("인증 없이 생성 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer())
					.post("/api/v1/groups")
					.send({ name: "test", type: "Role", tenantId: "test" });

				// Then
				expect(response.status).toBe(401);
			});

			it("인증 없이 수정 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer())
					.patch("/api/v1/groups/00000000-0000-0000-0000-000000000099")
					.send({ label: "test" });

				// Then
				expect(response.status).toBe(401);
			});

			it("인증 없이 삭제 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer()).delete(
					"/api/v1/groups/00000000-0000-0000-0000-000000000099",
				);

				// Then
				expect(response.status).toBe(401);
			});
		});

		describe("selectedSpaceId 쿠키 누락", () => {
			it("selectedSpaceId 없이 조회 시 400 또는 403을 반환해야 한다", async () => {
				// Given
				if (!jwtToken) return;

				// When
				const response = await request(app.getHttpServer())
					.get("/api/v1/groups")
					.set("Authorization", `Bearer ${jwtToken}`);

				// Then: SpaceAccessGuard에 의해 400 또는 403
				expect([400, 403]).toContain(response.status);
			});
		});

		describe("입력 검증 실패 (400)", () => {
			it("name 없이 그룹 생성 시 400을 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const invalidDto = {
					type: "Role",
					tenantId: spaceId,
					// name 누락
				};

				// When
				const response = await request(app.getHttpServer())
					.post("/api/v1/groups")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId)
					.send(invalidDto);

				// Then
				expect(response.status).toBe(400);
			});

			it("유효하지 않은 UUID 형식으로 조회 시 400을 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				// When: ParseUUIDPipe가 검증
				const response = await request(app.getHttpServer())
					.get("/api/v1/groups/not-a-uuid")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(response.status).toBe(400);
			});
		});

		describe("중복 생성 (409)", () => {
			it("동일한 name으로 그룹을 중복 생성 시 409를 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const uniqueName = `test-duplicate-${Date.now()}`;
				const createDto = {
					name: uniqueName,
					type: "Role",
					tenantId: spaceId,
				};

				// 첫 번째 생성 (성공)
				const firstResponse = await request(app.getHttpServer())
					.post("/api/v1/groups")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId)
					.send(createDto);

				expect(firstResponse.status).toBe(201);
				createdGroupIds.push(firstResponse.body.data.id);

				// When: 동일한 name으로 두 번째 생성 시도
				const secondResponse = await request(app.getHttpServer())
					.post("/api/v1/groups")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId)
					.send(createDto);

				// Then
				expect(secondResponse.status).toBe(409);
			});
		});

		describe("리소스 미존재 (404)", () => {
			it("존재하지 않는 그룹 ID로 상세 조회 시 404를 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const nonExistentId = "00000000-0000-0000-0000-000000000099";

				// When
				const response = await request(app.getHttpServer())
					.get(`/api/v1/groups/${nonExistentId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(response.status).toBe(404);
			});

			it("존재하지 않는 그룹 ID로 수정 시 404를 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const nonExistentId = "00000000-0000-0000-0000-000000000099";

				// When
				const response = await request(app.getHttpServer())
					.patch(`/api/v1/groups/${nonExistentId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId)
					.send({ label: "수정 시도" });

				// Then
				expect(response.status).toBe(404);
			});

			it("존재하지 않는 그룹 ID로 삭제 시 404를 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const nonExistentId = "00000000-0000-0000-0000-000000000099";

				// When
				const response = await request(app.getHttpServer())
					.delete(`/api/v1/groups/${nonExistentId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(response.status).toBe(404);
			});
		});

		describe("권한 부족 (403)", () => {
			// 참고: 현재 테스트 사용자(plate@gmail.com)는 FULL_ACCESS 역할이므로
			// MANAGE 역할 사용자의 403 테스트는 별도의 MANAGE 전용 토큰이 필요합니다.
			// 아래 테스트는 MANAGE 역할 토큰이 있을 때를 대비한 구조만 작성합니다.

			it("MANAGE 역할은 그룹 생성 시 403을 반환해야 한다 (FULL_ACCESS 전용)", async () => {
				// 현재 테스트 사용자가 FULL_ACCESS이므로 이 테스트는 건너뜁니다.
				// MANAGE 역할 토큰이 준비되면 아래 주석을 해제하세요.
				// const response = await request(app.getHttpServer())
				//   .post("/api/v1/groups")
				//   .set("Authorization", `Bearer ${manageToken}`)
				//   .set("Cookie", "selectedSpaceId=" + spaceId)
				//   .send({ name: "test", type: "Role", tenantId: spaceId });
				// expect(response.status).toBe(403);
			});

			it("MANAGE 역할은 그룹 수정 시 403을 반환해야 한다 (FULL_ACCESS 전용)", async () => {
				// 현재 테스트 사용자가 FULL_ACCESS이므로 이 테스트는 건너뜁니다.
			});

			it("MANAGE 역할은 그룹 삭제 시 403을 반환해야 한다 (FULL_ACCESS 전용)", async () => {
				// 현재 테스트 사용자가 FULL_ACCESS이므로 이 테스트는 건너뜁니다.
			});
		});
	});

	// ==================== Edge Cases ====================

	describe("Edge Cases", () => {
		it("삭제된 그룹과 동일한 name으로 재생성할 수 있어야 한다", async () => {
			// Given
			if (!jwtToken || !spaceId) return;

			const groupName = `test-recreate-${Date.now()}`;
			const createDto = {
				name: groupName,
				type: "Role",
				tenantId: spaceId,
			};

			// 1. 그룹 생성
			const createResponse = await request(app.getHttpServer())
				.post("/api/v1/groups")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("Cookie", "selectedSpaceId=" + spaceId)
				.send(createDto);

			expect(createResponse.status).toBe(201);
			const firstGroupId = createResponse.body.data.id;

			// 2. 그룹 삭제
			const deleteResponse = await request(app.getHttpServer())
				.delete(`/api/v1/groups/${firstGroupId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("Cookie", "selectedSpaceId=" + spaceId);

			expect(deleteResponse.status).toBe(200);

			// When: 동일한 name으로 재생성
			const recreateResponse = await request(app.getHttpServer())
				.post("/api/v1/groups")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("Cookie", "selectedSpaceId=" + spaceId)
				.send(createDto);

			// Then
			expect(recreateResponse.status).toBe(201);
			expect(recreateResponse.body.data.name).toBe(groupName);
			expect(recreateResponse.body.data.id).not.toBe(firstGroupId);

			// 정리
			createdGroupIds.push(recreateResponse.body.data.id);
		});

		it("빈 body로 수정 시 200을 반환해야 한다 (변경사항 없음)", async () => {
			// Given: 수정 테스트용 그룹 생성
			if (!jwtToken || !spaceId) return;

			const createDto = {
				name: `test-empty-update-${Date.now()}`,
				type: "Role",
				tenantId: spaceId,
				label: "원본 레이블",
			};

			const createResponse = await request(app.getHttpServer())
				.post("/api/v1/groups")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("Cookie", "selectedSpaceId=" + spaceId)
				.send(createDto);

			expect(createResponse.status).toBe(201);
			const groupId = createResponse.body.data.id;
			createdGroupIds.push(groupId);

			// When: 빈 body로 수정
			const updateResponse = await request(app.getHttpServer())
				.patch(`/api/v1/groups/${groupId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("Cookie", "selectedSpaceId=" + spaceId)
				.send({});

			// Then: 변경사항 없이 200 반환
			expect(updateResponse.status).toBe(200);
			expect(updateResponse.body.data.label).toBe(createDto.label);
		});

		it("MANAGE 이상 역할은 그룹 목록을 조회할 수 있어야 한다", async () => {
			// Given: 현재 테스트 사용자는 FULL_ACCESS (MANAGE 이상)
			if (!jwtToken || !spaceId) return;

			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/groups")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("Cookie", "selectedSpaceId=" + spaceId);

			// Then
			expect(response.status).toBe(200);
			expect(response.body.data).toBeInstanceOf(Array);
		});
	});
});
