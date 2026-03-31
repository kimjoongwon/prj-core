import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/module/app.module";
import { setNestApp } from "../src/setNestApp";
import { getTestAuth, TestJwtStrategy } from "./helpers/test-auth.helper";

/**
 * Timelines API E2E 테스트
 *
 * Timeline CRUD:
 * - GET    /api/v1/timelines              목록 조회 (인증 필요)
 * - GET    /api/v1/timelines/:timelineId  상세 조회 (인증 필요)
 * - POST   /api/v1/timelines              등록 (인증 필요)
 * - PATCH  /api/v1/timelines/:timelineId  수정 (인증 필요)
 * - DELETE /api/v1/timelines/:timelineId  삭제 (인증 필요, 204 No Content)
 *
 * Session CRUD (중첩 리소스):
 * - GET    /api/v1/timelines/:timelineId/sessions              목록 조회
 * - GET    /api/v1/timelines/:timelineId/sessions/:sessionId   상세 조회
 * - POST   /api/v1/timelines/:timelineId/sessions              등록
 * - PATCH  /api/v1/timelines/:timelineId/sessions/:sessionId   수정
 * - DELETE /api/v1/timelines/:timelineId/sessions/:sessionId   삭제 (204)
 *
 * Program CRUD (중첩 리소스):
 * - GET    /api/v1/timelines/:timelineId/sessions/:sessionId/programs              목록 조회
 * - POST   /api/v1/timelines/:timelineId/sessions/:sessionId/programs              등록
 * - PATCH  /api/v1/timelines/:timelineId/sessions/:sessionId/programs/:programId   수정
 * - DELETE /api/v1/timelines/:timelineId/sessions/:sessionId/programs/:programId   삭제 (204)
 */
describe("Timelines API (E2E)", () => {
	let app: INestApplication;
	let jwtToken: string;
	let spaceId: string;
	let userId: string;

	// 테스트 중 생성된 리소스 ID를 추적하여 정리
	const createdTimelineIds: string[] = [];

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
		// 테스트 중 생성된 Timeline 데이터 정리 (세션/프로그램은 cascade로 삭제됨)
		if (jwtToken && spaceId) {
			for (const timelineId of createdTimelineIds) {
				try {
					// 세션이 있는 경우 먼저 세션 목록을 조회하여 세션 삭제
					const sessionsRes = await request(app.getHttpServer())
						.get(`/api/v1/timelines/${timelineId}/sessions`)
						.set("Authorization", `Bearer ${jwtToken}`)
						.set("Cookie", "selectedSpaceId=" + spaceId);

					if (sessionsRes.status === 200 && sessionsRes.body.data?.length > 0) {
						for (const session of sessionsRes.body.data) {
							// 세션 내 프로그램 먼저 삭제
							const programsRes = await request(app.getHttpServer())
								.get(
									`/api/v1/timelines/${timelineId}/sessions/${session.id}/programs`,
								)
								.set("Authorization", `Bearer ${jwtToken}`)
								.set("Cookie", "selectedSpaceId=" + spaceId);

							if (
								programsRes.status === 200 &&
								programsRes.body.data?.length > 0
							) {
								for (const program of programsRes.body.data) {
									await request(app.getHttpServer())
										.delete(
											`/api/v1/timelines/${timelineId}/sessions/${session.id}/programs/${program.id}`,
										)
										.set("Authorization", `Bearer ${jwtToken}`)
										.set("Cookie", "selectedSpaceId=" + spaceId);
								}
							}

							// 세션 삭제
							await request(app.getHttpServer())
								.delete(
									`/api/v1/timelines/${timelineId}/sessions/${session.id}`,
								)
								.set("Authorization", `Bearer ${jwtToken}`)
								.set("Cookie", "selectedSpaceId=" + spaceId);
						}
					}

					// 타임라인 삭제
					await request(app.getHttpServer())
						.delete(`/api/v1/timelines/${timelineId}`)
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
		let testTimelineId: string;
		let testSessionId: string;
		let testProgramId: string;
		let testRoutineId: string;
		let testInstructorId: string;

		// 공유 상태: Timeline → Session → Program 순서로 생성

		describe("GET /api/v1/timelines", () => {
			it("인증된 사용자는 타임라인 목록을 조회할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				// When
				const response = await request(app.getHttpServer())
					.get("/api/v1/timelines")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.httpStatus).toBe(200);
				expect(response.body.data).toBeInstanceOf(Array);
				expect(response.body.meta).toBeDefined();
			});

			it("페이지네이션 파라미터로 타임라인 목록을 조회할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				// When
				const response = await request(app.getHttpServer())
					.get("/api/v1/timelines")
					.query({ skip: 0, take: 5 })
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.data).toBeInstanceOf(Array);
				expect(response.body.data.length).toBeLessThanOrEqual(5);
				expect(response.body.meta.total).toBeGreaterThanOrEqual(0);
			});
		});

		describe("POST /api/v1/timelines", () => {
			it("유효한 데이터로 타임라인을 등록할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const createDto = {
					name: `테스트 타임라인 ${Date.now()}`,
					description: "E2E 테스트용 타임라인",
				};

				// When
				const response = await request(app.getHttpServer())
					.post("/api/v1/timelines")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId)
					.send(createDto);

				// Then
				expect(response.status).toBe(201);
				expect(response.body.httpStatus).toBe(201);
				expect(response.body.data).toBeDefined();
				expect(response.body.data.name).toBe(createDto.name);
				expect(response.body.data.description).toBe(createDto.description);
				expect(response.body.data.id).toBeDefined();
				expect(response.body.data.spaceId).toBe(spaceId);

				// 후속 테스트용 ID 저장 및 정리 목록에 추가
				testTimelineId = response.body.data.id;
				createdTimelineIds.push(testTimelineId);
			});
		});

		describe("GET /api/v1/timelines/:timelineId", () => {
			it("ID로 타임라인 상세를 조회할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId || !testTimelineId) return;

				// When
				const response = await request(app.getHttpServer())
					.get(`/api/v1/timelines/${testTimelineId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.httpStatus).toBe(200);
				expect(response.body.data.id).toBe(testTimelineId);
				expect(response.body.data.name).toBeDefined();
				expect(response.body.data.spaceId).toBe(spaceId);
			});
		});

		describe("PATCH /api/v1/timelines/:timelineId", () => {
			it("타임라인의 name을 수정할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId || !testTimelineId) return;

				const updateDto = {
					name: "수정된 타임라인명",
					description: "수정된 설명",
				};

				// When
				const response = await request(app.getHttpServer())
					.patch(`/api/v1/timelines/${testTimelineId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId)
					.send(updateDto);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.data.name).toBe(updateDto.name);
				expect(response.body.data.description).toBe(updateDto.description);
			});
		});

		// ---- Session 중첩 리소스 테스트 ----

		describe("POST /api/v1/timelines/:timelineId/sessions", () => {
			it("타임라인에 세션을 등록할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId || !testTimelineId) return;

				const createDto = {
					name: `테스트 세션 ${Date.now()}`,
					type: "ONE_TIME",
					timelineId: testTimelineId,
					description: "E2E 테스트용 세션",
					startDateTime: new Date(
						Date.now() + 1000 * 60 * 60 * 24,
					).toISOString(), // 내일
					endDateTime: new Date(
						Date.now() + 1000 * 60 * 60 * 25,
					).toISOString(), // 내일 + 1시간
					repeatCycleType: null,
					recurringDayOfWeek: null,
				};

				// When
				const response = await request(app.getHttpServer())
					.post(`/api/v1/timelines/${testTimelineId}/sessions`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId)
					.send(createDto);

				// Then
				expect(response.status).toBe(201);
				expect(response.body.httpStatus).toBe(201);
				expect(response.body.data).toBeDefined();
				expect(response.body.data.name).toBe(createDto.name);
				expect(response.body.data.timelineId).toBe(testTimelineId);
				expect(response.body.data.id).toBeDefined();

				testSessionId = response.body.data.id;
			});
		});

		describe("GET /api/v1/timelines/:timelineId/sessions", () => {
			it("타임라인의 세션 목록을 조회할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId || !testTimelineId) return;

				// When
				const response = await request(app.getHttpServer())
					.get(`/api/v1/timelines/${testTimelineId}/sessions`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.httpStatus).toBe(200);
				expect(response.body.data).toBeInstanceOf(Array);
				expect(response.body.meta).toBeDefined();

				// 앞서 등록한 세션이 목록에 포함되어야 함
				if (testSessionId) {
					const ids = response.body.data.map((s: { id: string }) => s.id);
					expect(ids).toContain(testSessionId);
				}
			});
		});

		describe("GET /api/v1/timelines/:timelineId/sessions/:sessionId", () => {
			it("ID로 세션 상세를 조회할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId || !testTimelineId || !testSessionId)
					return;

				// When
				const response = await request(app.getHttpServer())
					.get(
						`/api/v1/timelines/${testTimelineId}/sessions/${testSessionId}`,
					)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.httpStatus).toBe(200);
				expect(response.body.data.id).toBe(testSessionId);
				expect(response.body.data.timelineId).toBe(testTimelineId);
			});
		});

		describe("PATCH /api/v1/timelines/:timelineId/sessions/:sessionId", () => {
			it("세션의 name을 수정할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId || !testTimelineId || !testSessionId)
					return;

				const updateDto = {
					name: "수정된 세션명",
					description: "수정된 세션 설명",
				};

				// When
				const response = await request(app.getHttpServer())
					.patch(
						`/api/v1/timelines/${testTimelineId}/sessions/${testSessionId}`,
					)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId)
					.send(updateDto);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.data.name).toBe(updateDto.name);
			});
		});

		// ---- Program 중첩 리소스 테스트 ----

		describe("POST /api/v1/timelines/:timelineId/sessions/:sessionId/programs", () => {
			it("세션에 프로그램을 등록할 수 있어야 한다 (루틴/강사 조회 후 등록)", async () => {
				// Given: 등록을 위해 기존 Routine ID와 Instructor(User) ID가 필요
				if (!jwtToken || !spaceId || !testTimelineId || !testSessionId)
					return;

				// Routine 목록에서 첫 번째 루틴 조회
				const routinesRes = await request(app.getHttpServer())
					.get("/api/v1/routines")
					.query({ skip: 0, take: 1 })
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				if (routinesRes.body.data?.length === 0) {
					console.warn("루틴 데이터가 없어 프로그램 등록 테스트를 건너뜁니다.");
					return;
				}

				testRoutineId = routinesRes.body.data[0].id;
				testInstructorId = userId; // 현재 테스트 사용자를 강사로 사용

				const createDto = {
					name: `테스트 프로그램 ${Date.now()}`,
					routineId: testRoutineId,
					instructorId: testInstructorId,
					capacity: 20,
					level: "초급",
				};

				// When
				const response = await request(app.getHttpServer())
					.post(
						`/api/v1/timelines/${testTimelineId}/sessions/${testSessionId}/programs`,
					)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId)
					.send(createDto);

				// Then
				expect(response.status).toBe(201);
				expect(response.body.httpStatus).toBe(201);
				expect(response.body.data).toBeDefined();
				expect(response.body.data.name).toBe(createDto.name);
				expect(response.body.data.sessionId).toBe(testSessionId);
				expect(response.body.data.capacity).toBe(createDto.capacity);
				expect(response.body.data.id).toBeDefined();

				testProgramId = response.body.data.id;
			});
		});

		describe("GET /api/v1/timelines/:timelineId/sessions/:sessionId/programs", () => {
			it("세션의 프로그램 목록을 조회할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId || !testTimelineId || !testSessionId)
					return;

				// When
				const response = await request(app.getHttpServer())
					.get(
						`/api/v1/timelines/${testTimelineId}/sessions/${testSessionId}/programs`,
					)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.httpStatus).toBe(200);
				expect(response.body.data).toBeInstanceOf(Array);
				expect(response.body.meta).toBeDefined();
			});
		});

		describe("PATCH /api/v1/timelines/:timelineId/sessions/:sessionId/programs/:programId", () => {
			it("프로그램의 capacity를 수정할 수 있어야 한다", async () => {
				// Given
				if (
					!jwtToken ||
					!spaceId ||
					!testTimelineId ||
					!testSessionId ||
					!testProgramId
				)
					return;

				const updateDto = {
					capacity: 30,
					level: "중급",
				};

				// When
				const response = await request(app.getHttpServer())
					.patch(
						`/api/v1/timelines/${testTimelineId}/sessions/${testSessionId}/programs/${testProgramId}`,
					)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId)
					.send(updateDto);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.data.capacity).toBe(updateDto.capacity);
				expect(response.body.data.level).toBe(updateDto.level);
			});
		});

		describe("DELETE /api/v1/timelines/:timelineId/sessions/:sessionId/programs/:programId", () => {
			it("프로그램을 삭제하면 204 No Content를 반환해야 한다", async () => {
				// Given
				if (
					!jwtToken ||
					!spaceId ||
					!testTimelineId ||
					!testSessionId ||
					!testProgramId
				)
					return;

				// When
				const deleteResponse = await request(app.getHttpServer())
					.delete(
						`/api/v1/timelines/${testTimelineId}/sessions/${testSessionId}/programs/${testProgramId}`,
					)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then: 204 No Content
				expect(deleteResponse.status).toBe(204);
				expect(deleteResponse.body).toEqual({});

				// 프로그램이 목록에서 제거되었는지 확인
				const listResponse = await request(app.getHttpServer())
					.get(
						`/api/v1/timelines/${testTimelineId}/sessions/${testSessionId}/programs`,
					)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				expect(listResponse.status).toBe(200);
				const ids = listResponse.body.data.map((p: { id: string }) => p.id);
				expect(ids).not.toContain(testProgramId);

				// 정리 후 프로그램 ID 초기화
				testProgramId = "";
			});
		});

		describe("DELETE /api/v1/timelines/:timelineId/sessions/:sessionId", () => {
			it("세션을 삭제하면 204 No Content를 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId || !testTimelineId || !testSessionId)
					return;

				// When
				const deleteResponse = await request(app.getHttpServer())
					.delete(
						`/api/v1/timelines/${testTimelineId}/sessions/${testSessionId}`,
					)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then: 204 No Content
				expect(deleteResponse.status).toBe(204);
				expect(deleteResponse.body).toEqual({});

				// 삭제 후 조회 시 404 반환 확인
				const getResponse = await request(app.getHttpServer())
					.get(
						`/api/v1/timelines/${testTimelineId}/sessions/${testSessionId}`,
					)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				expect(getResponse.status).toBe(404);

				// 정리 후 세션 ID 초기화
				testSessionId = "";
			});
		});

		describe("DELETE /api/v1/timelines/:timelineId", () => {
			it("세션이 없는 타임라인을 삭제하면 204 No Content를 반환해야 한다", async () => {
				// Given: 삭제 전용 타임라인 생성 (세션 없음)
				if (!jwtToken || !spaceId) return;

				const createDto = {
					name: `삭제용 타임라인 ${Date.now()}`,
					description: "삭제 테스트용",
				};

				const createResponse = await request(app.getHttpServer())
					.post("/api/v1/timelines")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId)
					.send(createDto);

				expect(createResponse.status).toBe(201);
				const deleteTargetId = createResponse.body.data.id;

				// When
				const deleteResponse = await request(app.getHttpServer())
					.delete(`/api/v1/timelines/${deleteTargetId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then: 204 No Content
				expect(deleteResponse.status).toBe(204);
				expect(deleteResponse.body).toEqual({});

				// 삭제 후 조회 시 404 반환 확인
				const getResponse = await request(app.getHttpServer())
					.get(`/api/v1/timelines/${deleteTargetId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				expect(getResponse.status).toBe(404);
			});
		});
	});

	// ==================== Error Path ====================

	describe("Error Path", () => {
		describe("인증 오류 (401) - Timeline", () => {
			it("인증 없이 타임라인 목록 조회 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer()).get(
					"/api/v1/timelines",
				);

				// Then
				expect(response.status).toBe(401);
			});

			it("인증 없이 타임라인 상세 조회 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer()).get(
					"/api/v1/timelines/00000000-0000-0000-0000-000000000099",
				);

				// Then
				expect(response.status).toBe(401);
			});

			it("인증 없이 타임라인 등록 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer())
					.post("/api/v1/timelines")
					.send({ name: "test" });

				// Then
				expect(response.status).toBe(401);
			});

			it("인증 없이 타임라인 수정 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer())
					.patch("/api/v1/timelines/00000000-0000-0000-0000-000000000099")
					.send({ name: "수정" });

				// Then
				expect(response.status).toBe(401);
			});

			it("인증 없이 타임라인 삭제 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer()).delete(
					"/api/v1/timelines/00000000-0000-0000-0000-000000000099",
				);

				// Then
				expect(response.status).toBe(401);
			});
		});

		describe("인증 오류 (401) - Session", () => {
			it("인증 없이 세션 목록 조회 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer()).get(
					"/api/v1/timelines/00000000-0000-0000-0000-000000000099/sessions",
				);

				// Then
				expect(response.status).toBe(401);
			});

			it("인증 없이 세션 등록 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer())
					.post(
						"/api/v1/timelines/00000000-0000-0000-0000-000000000099/sessions",
					)
					.send({ name: "test", type: "ONE_TIME" });

				// Then
				expect(response.status).toBe(401);
			});
		});

		describe("인증 오류 (401) - Program", () => {
			it("인증 없이 프로그램 목록 조회 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer()).get(
					"/api/v1/timelines/00000000-0000-0000-0000-000000000099/sessions/00000000-0000-0000-0000-000000000099/programs",
				);

				// Then
				expect(response.status).toBe(401);
			});

			it("인증 없이 프로그램 등록 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer())
					.post(
						"/api/v1/timelines/00000000-0000-0000-0000-000000000099/sessions/00000000-0000-0000-0000-000000000099/programs",
					)
					.send({ name: "test" });

				// Then
				expect(response.status).toBe(401);
			});
		});

		describe("selectedSpaceId 쿠키 누락", () => {
			it("selectedSpaceId 없이 타임라인 목록 조회 시 400 또는 403을 반환해야 한다", async () => {
				// Given
				if (!jwtToken) return;

				// When
				const response = await request(app.getHttpServer())
					.get("/api/v1/timelines")
					.set("Authorization", `Bearer ${jwtToken}`);

				// Then: SpaceAccessGuard에 의해 400 또는 403
				expect([400, 403]).toContain(response.status);
			});
		});

		describe("입력 검증 실패 (400)", () => {
			it("name 없이 타임라인 등록 시 400을 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const invalidDto = {
					description: "이름이 없는 타임라인",
					// name 누락
				};

				// When
				const response = await request(app.getHttpServer())
					.post("/api/v1/timelines")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId)
					.send(invalidDto);

				// Then
				expect(response.status).toBe(400);
			});

			it("유효하지 않은 UUID로 타임라인 상세 조회 시 400을 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				// When
				const response = await request(app.getHttpServer())
					.get("/api/v1/timelines/not-a-valid-uuid")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(response.status).toBe(400);
			});

			it("유효하지 않은 UUID로 세션 목록 조회 시 400을 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				// When
				const response = await request(app.getHttpServer())
					.get("/api/v1/timelines/not-a-uuid/sessions")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(response.status).toBe(400);
			});
		});

		describe("리소스 미존재 (404)", () => {
			it("존재하지 않는 타임라인 ID로 상세 조회 시 404를 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const nonExistentId = "00000000-0000-0000-0000-000000000099";

				// When
				const response = await request(app.getHttpServer())
					.get(`/api/v1/timelines/${nonExistentId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(response.status).toBe(404);
			});

			it("존재하지 않는 타임라인 ID로 수정 시 404를 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const nonExistentId = "00000000-0000-0000-0000-000000000099";

				// When
				const response = await request(app.getHttpServer())
					.patch(`/api/v1/timelines/${nonExistentId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId)
					.send({ name: "수정 시도" });

				// Then
				expect(response.status).toBe(404);
			});

			it("존재하지 않는 타임라인 ID로 삭제 시 404를 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const nonExistentId = "00000000-0000-0000-0000-000000000099";

				// When
				const response = await request(app.getHttpServer())
					.delete(`/api/v1/timelines/${nonExistentId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(response.status).toBe(404);
			});

			it("존재하지 않는 타임라인의 세션 목록 조회 시 404를 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const nonExistentId = "00000000-0000-0000-0000-000000000099";

				// When
				const response = await request(app.getHttpServer())
					.get(`/api/v1/timelines/${nonExistentId}/sessions`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(response.status).toBe(404);
			});

			it("존재하지 않는 세션 ID로 상세 조회 시 404를 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				// 유효한 타임라인 생성 후 존재하지 않는 세션 ID로 조회
				const timelineRes = await request(app.getHttpServer())
					.post("/api/v1/timelines")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId)
					.send({ name: `404 세션 테스트 타임라인 ${Date.now()}` });

				if (timelineRes.status !== 201) return;
				const tempTimelineId = timelineRes.body.data.id;
				createdTimelineIds.push(tempTimelineId);

				const nonExistentSessionId = "00000000-0000-0000-0000-000000000099";

				// When
				const response = await request(app.getHttpServer())
					.get(
						`/api/v1/timelines/${tempTimelineId}/sessions/${nonExistentSessionId}`,
					)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("Cookie", "selectedSpaceId=" + spaceId);

				// Then
				expect(response.status).toBe(404);
			});
		});
	});

	// ==================== Edge Cases ====================

	describe("Edge Cases", () => {
		it("타임라인 목록 응답에 stats(통계) 정보가 포함되어야 한다", async () => {
			// Given
			if (!jwtToken || !spaceId) return;

			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/timelines")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("Cookie", "selectedSpaceId=" + spaceId);

			// Then
			expect(response.status).toBe(200);
			expect(response.body.stats).toBeDefined();
			expect(response.body.stats.total).toBeGreaterThanOrEqual(0);
		});

		it("빈 body로 타임라인 수정 시 200을 반환해야 한다 (변경사항 없음)", async () => {
			// Given: 수정 테스트용 타임라인 생성
			if (!jwtToken || !spaceId) return;

			const createDto = {
				name: `빈 수정 테스트 타임라인 ${Date.now()}`,
				description: "원본 설명",
			};

			const createResponse = await request(app.getHttpServer())
				.post("/api/v1/timelines")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("Cookie", "selectedSpaceId=" + spaceId)
				.send(createDto);

			expect(createResponse.status).toBe(201);
			const timelineId = createResponse.body.data.id;
			createdTimelineIds.push(timelineId);

			// When: 빈 body로 수정
			const updateResponse = await request(app.getHttpServer())
				.patch(`/api/v1/timelines/${timelineId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("Cookie", "selectedSpaceId=" + spaceId)
				.send({});

			// Then: 변경사항 없이 200 반환
			expect(updateResponse.status).toBe(200);
			expect(updateResponse.body.data.description).toBe(createDto.description);
		});

		it("검색어로 타임라인 목록을 필터링할 수 있어야 한다", async () => {
			// Given
			if (!jwtToken || !spaceId) return;

			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/timelines")
				.query({ search: "테스트" })
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("Cookie", "selectedSpaceId=" + spaceId);

			// Then
			expect(response.status).toBe(200);
			expect(response.body.data).toBeInstanceOf(Array);
		});

		it("세션 목록 조회 응답에 meta(페이지네이션) 정보가 포함되어야 한다", async () => {
			// Given: 세션을 가진 타임라인 생성
			if (!jwtToken || !spaceId) return;

			const createTimelineRes = await request(app.getHttpServer())
				.post("/api/v1/timelines")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("Cookie", "selectedSpaceId=" + spaceId)
				.send({
					name: `세션 페이지네이션 테스트 타임라인 ${Date.now()}`,
				});

			if (createTimelineRes.status !== 201) return;
			const tempTimelineId = createTimelineRes.body.data.id;
			createdTimelineIds.push(tempTimelineId);

			// When: 세션 목록 조회 (페이지네이션 파라미터 포함)
			const response = await request(app.getHttpServer())
				.get(`/api/v1/timelines/${tempTimelineId}/sessions`)
				.query({ skip: 0, take: 10 })
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("Cookie", "selectedSpaceId=" + spaceId);

			// Then
			expect(response.status).toBe(200);
			expect(response.body.meta).toBeDefined();
			expect(response.body.meta.total).toBeGreaterThanOrEqual(0);
			expect(response.body.meta.skip).toBe(0);
			expect(response.body.meta.take).toBe(10);
		});
	});
});
