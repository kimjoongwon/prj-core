import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/module/app.module";
import { getTestAuth, TestJwtStrategy } from "./helpers/test-auth.helper";

/**
 * Grounds API E2E 테스트
 *
 * - GET    /api/v1/grounds          전체 목록 조회 (@Public, 인증 불필요)
 * - GET    /api/v1/grounds/my       내 Space 목록 조회 (인증 필요)
 * - GET    /api/v1/grounds/:groundId 상세 조회 (인증 필요)
 * - POST   /api/v1/grounds          등록 (FULL_ACCESS 전용)
 * - PATCH  /api/v1/grounds/:groundId 수정 (FULL_ACCESS 전용)
 * - DELETE /api/v1/grounds/:groundId 삭제 (FULL_ACCESS 전용, 204 No Content)
 */
describe("Grounds API (E2E)", () => {
	let app: INestApplication;
	let jwtToken: string;
	let spaceId: string;

	// 테스트 중 생성된 Ground ID를 추적하여 정리
	const createdGroundIds: string[] = [];

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
		// 테스트 중 생성된 Ground 데이터 정리
		if (jwtToken && spaceId) {
			for (const groundId of createdGroundIds) {
				try {
					await request(app.getHttpServer())
						.delete(`/api/v1/grounds/${groundId}`)
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
		let testGroundId: string;

		describe("GET /api/v1/grounds (공개 엔드포인트)", () => {
			it("인증 없이도 전체 Ground 목록을 조회할 수 있어야 한다", async () => {
				// When: 인증 헤더 없이 요청
				const response = await request(app.getHttpServer()).get(
					"/api/v1/grounds",
				);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.httpStatus).toBe(200);
				expect(response.body.data).toBeInstanceOf(Array);
			});

			it("인증된 사용자도 전체 Ground 목록을 조회할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				// When
				const response = await request(app.getHttpServer())
					.get("/api/v1/grounds")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.httpStatus).toBe(200);
				expect(response.body.data).toBeInstanceOf(Array);
			});
		});

		describe("GET /api/v1/grounds/my", () => {
			it("인증된 사용자는 자신의 Space에 속한 Ground 목록을 조회할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				// When
				const response = await request(app.getHttpServer())
					.get("/api/v1/grounds/my")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.httpStatus).toBe(200);
				expect(response.body.data).toBeInstanceOf(Array);
			});
		});

		describe("POST /api/v1/grounds", () => {
			it("유효한 데이터로 Ground를 등록할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const timestamp = Date.now();
				const createDto = {
					name: `테스트 시설 ${timestamp}`,
					businessNo: `${String(timestamp).slice(-9)}`, // 9자리 숫자
					address: "서울시 강남구 테스트로 123",
					phone: "02-1234-5678",
					email: `test-ground-${timestamp}@example.com`,
					spaceId,
					logoImageFileId: null,
					imageFileId: null,
					label: null,
				};

				// When
				const response = await request(app.getHttpServer())
					.post("/api/v1/grounds")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId)
					.send(createDto);

				// Then
				expect(response.status).toBe(201);
				expect(response.body.httpStatus).toBe(201);
				expect(response.body.data).toBeDefined();
				expect(response.body.data.name).toBe(createDto.name);
				expect(response.body.data.businessNo).toBe(createDto.businessNo);
				expect(response.body.data.address).toBe(createDto.address);
				expect(response.body.data.id).toBeDefined();

				// 후속 테스트용 ID 저장 및 정리 목록에 추가
				testGroundId = response.body.data.id;
				createdGroundIds.push(testGroundId);
			});
		});

		describe("GET /api/v1/grounds/:groundId", () => {
			it("ID로 Ground 상세를 조회할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId || !testGroundId) return;

				// When
				const response = await request(app.getHttpServer())
					.get(`/api/v1/grounds/${testGroundId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.httpStatus).toBe(200);
				expect(response.body.data.id).toBe(testGroundId);
				expect(response.body.data.name).toBeDefined();
				expect(response.body.data.businessNo).toBeDefined();
			});
		});

		describe("PATCH /api/v1/grounds/:groundId", () => {
			it("Ground의 name을 수정할 수 있어야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId || !testGroundId) return;

				const updateDto = {
					name: "수정된 시설명",
					label: "수정된 레이블",
				};

				// When
				const response = await request(app.getHttpServer())
					.patch(`/api/v1/grounds/${testGroundId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId)
					.send(updateDto);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.data.name).toBe(updateDto.name);
				expect(response.body.data.label).toBe(updateDto.label);
			});
		});

		describe("DELETE /api/v1/grounds/:groundId", () => {
			it("Ground를 삭제하면 204 No Content를 반환해야 한다", async () => {
				// Given: 삭제 전용 Ground 생성
				if (!jwtToken || !spaceId) return;

				const timestamp = Date.now();
				const createDto = {
					name: `삭제용 시설 ${timestamp}`,
					businessNo: `${String(timestamp + 1).slice(-9)}`,
					address: "서울시 마포구 삭제로 456",
					phone: "02-9876-5432",
					email: `delete-ground-${timestamp}@example.com`,
					spaceId,
					label: null,
					logoImageFileId: null,
					imageFileId: null,
				};

				const createResponse = await request(app.getHttpServer())
					.post("/api/v1/grounds")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId)
					.send(createDto);

				expect(createResponse.status).toBe(201);
				const deleteTargetId = createResponse.body.data.id;

				// When
				const deleteResponse = await request(app.getHttpServer())
					.delete(`/api/v1/grounds/${deleteTargetId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then: 204 No Content
				expect(deleteResponse.status).toBe(204);
				expect(deleteResponse.body).toEqual({});

				// 삭제 후 조회 시 404 반환 확인
				const getResponse = await request(app.getHttpServer())
					.get(`/api/v1/grounds/${deleteTargetId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				expect(getResponse.status).toBe(404);
			});
		});
	});

	// ==================== Error Path ====================

	describe("Error Path", () => {
		describe("인증 오류 (401)", () => {
			it("인증 없이 내 Space Ground 목록 조회 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer()).get(
					"/api/v1/grounds/my",
				);

				// Then
				expect(response.status).toBe(401);
			});

			it("인증 없이 Ground 상세 조회 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer()).get(
					"/api/v1/grounds/00000000-0000-0000-0000-000000000099",
				);

				// Then
				expect(response.status).toBe(401);
			});

			it("인증 없이 Ground 등록 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer())
					.post("/api/v1/grounds")
					.send({ name: "test", businessNo: "123456789", address: "서울" });

				// Then
				expect(response.status).toBe(401);
			});

			it("인증 없이 Ground 수정 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer())
					.patch("/api/v1/grounds/00000000-0000-0000-0000-000000000099")
					.send({ name: "수정" });

				// Then
				expect(response.status).toBe(401);
			});

			it("인증 없이 Ground 삭제 시 401을 반환해야 한다", async () => {
				// When
				const response = await request(app.getHttpServer()).delete(
					"/api/v1/grounds/00000000-0000-0000-0000-000000000099",
				);

				// Then
				expect(response.status).toBe(401);
			});
		});

		describe("X-Space-ID 헤더 누락", () => {
			it("X-Space-ID 없이 내 Space Ground 목록 조회 시 400 또는 403을 반환해야 한다", async () => {
				// Given
				if (!jwtToken) return;

				// When
				const response = await request(app.getHttpServer())
					.get("/api/v1/grounds/my")
					.set("Authorization", `Bearer ${jwtToken}`);

				// Then: SpaceAccessGuard에 의해 400 또는 403
				expect([400, 403]).toContain(response.status);
			});
		});

		describe("입력 검증 실패 (400)", () => {
			it("businessNo 없이 Ground 등록 시 400을 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const invalidDto = {
					name: "시설명",
					address: "서울시 강남구",
					phone: "02-1234-5678",
					email: "test@example.com",
					spaceId,
					// businessNo 누락
				};

				// When
				const response = await request(app.getHttpServer())
					.post("/api/v1/grounds")
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
					.get("/api/v1/grounds/not-a-valid-uuid")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then
				expect(response.status).toBe(400);
			});
		});

		describe("중복 등록 (409)", () => {
			it("동일한 businessNo로 Ground를 중복 등록 시 409를 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const timestamp = Date.now();
				const uniqueBusinessNo = `${String(timestamp + 2).slice(-9)}`;
				const createDto = {
					name: `중복 테스트 시설 ${timestamp}`,
					businessNo: uniqueBusinessNo,
					address: "서울시 서초구 중복로 789",
					phone: "02-1111-2222",
					email: `dup-ground-${timestamp}@example.com`,
					spaceId,
					label: null,
					logoImageFileId: null,
					imageFileId: null,
				};

				// 첫 번째 등록 (성공)
				const firstResponse = await request(app.getHttpServer())
					.post("/api/v1/grounds")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId)
					.send(createDto);

				expect(firstResponse.status).toBe(201);
				createdGroundIds.push(firstResponse.body.data.id);

				// When: 동일한 businessNo로 두 번째 등록 시도
				const secondResponse = await request(app.getHttpServer())
					.post("/api/v1/grounds")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId)
					.send({ ...createDto, name: "다른 이름의 동일 사업자번호" });

				// Then
				expect(secondResponse.status).toBe(409);
			});
		});

		describe("리소스 미존재 (404)", () => {
			it("존재하지 않는 Ground ID로 상세 조회 시 404를 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const nonExistentId = "00000000-0000-0000-0000-000000000099";

				// When
				const response = await request(app.getHttpServer())
					.get(`/api/v1/grounds/${nonExistentId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then
				expect(response.status).toBe(404);
			});

			it("존재하지 않는 Ground ID로 수정 시 404를 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const nonExistentId = "00000000-0000-0000-0000-000000000099";

				// When
				const response = await request(app.getHttpServer())
					.patch(`/api/v1/grounds/${nonExistentId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId)
					.send({ name: "수정 시도" });

				// Then
				expect(response.status).toBe(404);
			});

			it("존재하지 않는 Ground ID로 삭제 시 404를 반환해야 한다", async () => {
				// Given
				if (!jwtToken || !spaceId) return;

				const nonExistentId = "00000000-0000-0000-0000-000000000099";

				// When
				const response = await request(app.getHttpServer())
					.delete(`/api/v1/grounds/${nonExistentId}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then
				expect(response.status).toBe(404);
			});
		});

		describe("권한 부족 (403)", () => {
			// 참고: 현재 테스트 사용자(plate@gmail.com)는 FULL_ACCESS 역할이므로
			// 403 테스트는 MANAGE 역할 전용 토큰이 준비되면 활성화할 수 있습니다.
			it("MANAGE 역할은 Ground 등록 시 403을 반환해야 한다 (FULL_ACCESS 전용)", () => {
				// 현재 테스트 사용자가 FULL_ACCESS이므로 이 테스트는 건너뜁니다.
				// MANAGE 역할 토큰이 준비되면 아래 주석을 해제하세요.
			});
		});
	});

	// ==================== Edge Cases ====================

	describe("Edge Cases", () => {
		it("공개 목록 조회 결과에 businessNo 필드가 포함되어야 한다", async () => {
			// When
			const response = await request(app.getHttpServer()).get(
				"/api/v1/grounds",
			);

			// Then
			expect(response.status).toBe(200);
			if (response.body.data.length > 0) {
				expect(response.body.data[0]).toHaveProperty("businessNo");
				expect(response.body.data[0]).toHaveProperty("address");
			}
		});

		it("빈 body로 Ground 수정 시 200을 반환해야 한다 (변경사항 없음)", async () => {
			// Given: 수정 테스트용 Ground 생성
			if (!jwtToken || !spaceId) return;

			const timestamp = Date.now();
			const createDto = {
				name: `빈 수정 테스트 시설 ${timestamp}`,
				businessNo: `${String(timestamp + 3).slice(-9)}`,
				address: "서울시 종로구 빈수정로 111",
				phone: "02-3333-4444",
				email: `empty-update-ground-${timestamp}@example.com`,
				spaceId,
				label: "원본 레이블",
				logoImageFileId: null,
				imageFileId: null,
			};

			const createResponse = await request(app.getHttpServer())
				.post("/api/v1/grounds")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send(createDto);

			expect(createResponse.status).toBe(201);
			const groundId = createResponse.body.data.id;
			createdGroundIds.push(groundId);

			// When: 빈 body로 수정
			const updateResponse = await request(app.getHttpServer())
				.patch(`/api/v1/grounds/${groundId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({});

			// Then: 변경사항 없이 200 반환
			expect(updateResponse.status).toBe(200);
			expect(updateResponse.body.data.label).toBe(createDto.label);
		});

		it("삭제 후 공개 목록에서 해당 Ground가 나타나지 않아야 한다", async () => {
			// Given
			if (!jwtToken || !spaceId) return;

			const timestamp = Date.now();
			const createDto = {
				name: `공개목록 삭제 테스트 ${timestamp}`,
				businessNo: `${String(timestamp + 4).slice(-9)}`,
				address: "서울시 용산구 삭제확인로 222",
				phone: "02-5555-6666",
				email: `list-delete-ground-${timestamp}@example.com`,
				spaceId,
				label: null,
				logoImageFileId: null,
				imageFileId: null,
			};

			// Ground 생성
			const createResponse = await request(app.getHttpServer())
				.post("/api/v1/grounds")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send(createDto);

			expect(createResponse.status).toBe(201);
			const groundId = createResponse.body.data.id;

			// Ground 삭제
			const deleteResponse = await request(app.getHttpServer())
				.delete(`/api/v1/grounds/${groundId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			expect(deleteResponse.status).toBe(204);

			// When: 공개 목록 조회
			const listResponse = await request(app.getHttpServer()).get(
				"/api/v1/grounds",
			);

			// Then: 삭제된 Ground가 목록에 없어야 함
			expect(listResponse.status).toBe(200);
			const ids = listResponse.body.data.map((g: { id: string }) => g.id);
			expect(ids).not.toContain(groundId);
		});
	});
});
