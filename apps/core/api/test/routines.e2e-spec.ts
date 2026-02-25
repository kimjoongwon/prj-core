import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/module/app.module";
import { setNestApp } from "../src/setNestApp";
import { getTestAuth, TestJwtStrategy } from "./helpers/test-auth.helper";

/**
 * Routines API E2E 테스트
 *
 * - GET    /api/v1/routines              목록 조회 (인증 필요)
 * - GET    /api/v1/routines/:routineId   상세 조회 (인증 필요)
 * - POST   /api/v1/routines              등록 (MANAGE/FULL_ACCESS)
 * - PATCH  /api/v1/routines/:routineId   수정 (MANAGE/FULL_ACCESS)
 * - DELETE /api/v1/routines/:routineId   삭제 (MANAGE/FULL_ACCESS, 204 No Content)
 */
describe("Routines API (E2E)", () => {
	let app: INestApplication;
	let jwtToken: string;
	let spaceId: string;
	let userId: string;

	// 테스트 중 생성된 Routine ID를 추적하여 정리
	const createdRoutineIds: string[] = [];

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
			spaceId = auth.spaceId;
			userId = auth.userId;
		} catch (error) {
			console.warn(`테스트 인증 설정 실패: ${error}`);
		}
	}, 60000);

	afterAll(async () => {
		// 테스트 중 생성된 Routine 데이터 정리
		if (jwtToken && spaceId) {
			for (const routineId of createdRoutineIds) {
				try {
					await request(app.getHttpServer())
						.delete(`/api/v1/routines/${routineId}`)
						.set("Authorization", `Bearer ${jwtToken}`)
						.set("X-Space-ID", spaceId);
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
		let testRoutineId: string;

		describe("GET /api/v1/routines", () => {
			it("인증된 사용자는 루틴 목록을 조회할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				// When
				const response = await request(app.getHttpServer())
					.get("/api/v1/routines")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.httpStatus).toBe(200);
				expect(response.body.data).toBeInstanceOf(Array);
			});

			it("페이지네이션 파라미터로 루틴 목록을 조회할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				// When
				const response = await request(app.getHttpServer())
					.get("/api/v1/routines")
					.query({ skip: 0, take: 5 })
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.data).toBeInstanceOf(Array);
				expect(response.body.data.length).toBeLessThanOrEqual(5);
				expect(response.body.meta).toBeDefined();
				expect(response.body.meta.total).toBeGreaterThanOrEqual(0);
			});

			it("검색어로 루틴 목록을 필터링할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				// When
				const response = await request(app.getHttpServer())
					.get("/api/v1/routines")
					.query({ search: "테스트" })
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.data).toBeInstanceOf(Array);
			});
		});

		describe("POST /api/v1/routines", () => {
			it("유효한 데이터로 루틴을 등록할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId || !userId) return;

				const createDto = {
					name: `테스트 루틴 ${Date.now()}`,
					label: "테스트 레이블",
					spaceId,
					creatorId: userId,
				};

				// When
				const response = await request(app.getHttpServer())
					.post("/api/v1/routines")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId)
					.send(createDto);

				// Then
				expect(response.status).toBe(201);
				expect(response.body.httpStatus).toBe(201);
				expect(response.body.data).toBeDefined();
				expect(response.body.data.name).toBe(createDto.name);
				expect(response.body.data.label).toBe(createDto.label);
				expect(response.body.data.spaceId).toBe(spaceId);
				expect(response.body.data.id).toBeDefined();

				// 후속 테스트용 ID 저장 및 정리 목록에 추가
				testRoutineId = response.body.data.id;
				createdRoutineIds.push(testRoutineId);
			});
		});

		describe("GET /api/v1/routines/:routineId", () => {
			it("ID로 루틴 상세를 조회할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId || !testRoutineId) return;

				// When
				const response = await request(app.getHttpServer())
					.get(`/api/v1/routines/${testRoutineId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.httpStatus).toBe(200);
				expect(response.body.data.id).toBe(testRoutineId);
				expect(response.body.data.name).toBeDefined();
				expect(response.body.data.spaceId).toBeDefined();
			});
		});

		describe("PATCH /api/v1/routines/:routineId", () => {
			it("루틴의 name을 수정할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId || !testRoutineId) return;

				const updateDto = {
					name: "수정된 루틴명",
					label: "수정된 레이블",
				};

				// When
				const response = await request(app.getHttpServer())
					.patch(`/api/v1/routines/${testRoutineId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId)
					.send(updateDto);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.data.name).toBe(updateDto.name);
				expect(response.body.data.label).toBe(updateDto.label);
			});
		});

		describe("DELETE /api/v1/routines/:routineId", () => {
			it("루틴을 삭제하면 204 No Content를 반환해야 한다", async () => {
				// Given: 삭제 전용 루틴 생성
				if (!jwtToken || !spaceId || !userId) return;

				const createDto = {
					name: `삭제용 루틴 ${Date.now()}`,
					label: "삭제 테스트",
					spaceId,
					creatorId: userId,
				};

				const createResponse = await request(app.getHttpServer())
					.post("/api/v1/routines")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId)
					.send(createDto);

				expect(createResponse.status).toBe(201);
				const deleteTargetId = createResponse.body.data.id;

				// When
				const deleteResponse = await request(app.getHttpServer())
					.delete(`/api/v1/routines/${deleteTargetId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then: 204 No Content
				expect(deleteResponse.status).toBe(204);
				expect(deleteResponse.body).toEqual({});

				// 삭제 후 조회 시 404 반환 확인
				const getResponse = await request(app.getHttpServer())
					.get(`/api/v1/routines/${deleteTargetId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

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
					"/api/v1/routines",
				);

				// Then
				expect(response.status).toBe(401);
			});

			it("인증 없이 상세 조회 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer()).get(
					"/api/v1/routines/00000000-0000-0000-0000-000000000099",
				);

				// Then
				expect(response.status).toBe(401);
			});

			it("인증 없이 등록 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer())
					.post("/api/v1/routines")
					.send({ name: "test", label: "test", spaceId: "test" });

				// Then
				expect(response.status).toBe(401);
			});

			it("인증 없이 수정 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer())
					.patch("/api/v1/routines/00000000-0000-0000-0000-000000000099")
					.send({ name: "수정" });

				// Then
				expect(response.status).toBe(401);
			});

			it("인증 없이 삭제 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer()).delete(
					"/api/v1/routines/00000000-0000-0000-0000-000000000099",
				);

				// Then
				expect(response.status).toBe(401);
			});
		});

		describe("X-Space-ID 헤더 누락", () => {
			it("X-Space-ID 없이 목록 조회 시 400 또는 403을 반환해야 한다", async () => {
				// Given
				if (!jwtToken) return;

				// When
				const response = await request(app.getHttpServer())
					.get("/api/v1/routines")
					.set("Authorization", `Bearer ${jwtToken}`);

				// Then: SpaceAccessGuard에 의해 400 또는 403
				expect([400, 403]).toContain(response.status);
			});
		});

		describe("입력 검증 실패 (400)", () => {
			it("name 없이 루틴 등록 시 400을 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const invalidDto = {
					label: "레이블만 있음",
					spaceId,
					// name 누락
				};

				// When
				const response = await request(app.getHttpServer())
					.post("/api/v1/routines")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId)
					.send(invalidDto);

				// Then
				expect(response.status).toBe(400);
			});

			it("유효하지 않은 UUID로 상세 조회 시 400을 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				// When
				const response = await request(app.getHttpServer())
					.get("/api/v1/routines/not-a-valid-uuid")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then
				expect(response.status).toBe(400);
			});
		});

		describe("리소스 미존재 (404)", () => {
			it("존재하지 않는 루틴 ID로 상세 조회 시 404를 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const nonExistentId = "00000000-0000-0000-0000-000000000099";

				// When
				const response = await request(app.getHttpServer())
					.get(`/api/v1/routines/${nonExistentId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then
				expect(response.status).toBe(404);
			});

			it("존재하지 않는 루틴 ID로 수정 시 404를 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const nonExistentId = "00000000-0000-0000-0000-000000000099";

				// When
				const response = await request(app.getHttpServer())
					.patch(`/api/v1/routines/${nonExistentId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId)
					.send({ name: "수정 시도" });

				// Then
				expect(response.status).toBe(404);
			});

			it("존재하지 않는 루틴 ID로 삭제 시 404를 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const nonExistentId = "00000000-0000-0000-0000-000000000099";

				// When
				const response = await request(app.getHttpServer())
					.delete(`/api/v1/routines/${nonExistentId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then
				expect(response.status).toBe(404);
			});
		});
	});

	// ==================== Edge Cases ====================

	describe("Edge Cases", () => {
		it("목록 조회 응답에 meta(페이지네이션) 정보가 포함되어야 한다", async () => {
			// Given
			if (!jwtToken || !spaceId) return;

			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/routines")
				.query({ skip: 0, take: 10 })
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// Then
			expect(response.status).toBe(200);
			expect(response.body.meta).toBeDefined();
			expect(response.body.meta.total).toBeGreaterThanOrEqual(0);
			expect(response.body.meta.skip).toBe(0);
			expect(response.body.meta.take).toBe(10);
			expect(response.body.meta.totalPages).toBeGreaterThanOrEqual(0);
		});

		it("빈 body로 루틴 수정 시 200을 반환해야 한다 (변경사항 없음)", async () => {
			// Given: 수정 테스트용 루틴 생성
			if (!jwtToken || !spaceId || !userId) return;

			const createDto = {
				name: `빈 수정 테스트 루틴 ${Date.now()}`,
				label: "원본 레이블",
				spaceId,
				creatorId: userId,
			};

			const createResponse = await request(app.getHttpServer())
				.post("/api/v1/routines")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send(createDto);

			expect(createResponse.status).toBe(201);
			const routineId = createResponse.body.data.id;
			createdRoutineIds.push(routineId);

			// When: 빈 body로 수정
			const updateResponse = await request(app.getHttpServer())
				.patch(`/api/v1/routines/${routineId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({});

			// Then: 변경사항 없이 200 반환
			expect(updateResponse.status).toBe(200);
			expect(updateResponse.body.data.label).toBe(createDto.label);
		});

		it("루틴 상세 조회 결과에 programs 필드가 포함되어야 한다", async () => {
			// Given
			if (!jwtToken || !spaceId || !userId) return;

			const createDto = {
				name: `programs 포함 확인 루틴 ${Date.now()}`,
				label: "테스트 레이블",
				spaceId,
				creatorId: userId,
			};

			const createResponse = await request(app.getHttpServer())
				.post("/api/v1/routines")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send(createDto);

			expect(createResponse.status).toBe(201);
			const routineId = createResponse.body.data.id;
			createdRoutineIds.push(routineId);

			// When
			const response = await request(app.getHttpServer())
				.get(`/api/v1/routines/${routineId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// Then
			expect(response.status).toBe(200);
			// programs 또는 activities 필드 확인
			expect(
				response.body.data.programs !== undefined ||
					response.body.data.activities !== undefined,
			).toBe(true);
		});
	});
});
