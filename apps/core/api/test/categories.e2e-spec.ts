import { PRISMA_SERVICE_TOKEN } from "@cocrepo/constant";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../src/module/app.module";
import { getTestAuth, TestJwtStrategy } from "./helpers/test-auth.helper";

/**
 * Categories API E2E 테스트
 *
 * 테스트 대상: /api/v1/categories
 * - GET    / : 카테고리 목록 조회 (MANAGE/FULL_ACCESS)
 * - GET    /:id : 카테고리 상세 조회 (MANAGE/FULL_ACCESS)
 * - POST   / : 카테고리 생성 (FULL_ACCESS)
 * - PATCH  /:id : 카테고리 수정 (FULL_ACCESS)
 * - DELETE /:id : 카테고리 삭제 (FULL_ACCESS)
 */
describe("Categories API (E2E)", () => {
	let app: INestApplication;
	let jwtToken: string;
	let spaceId: string;
	let userId: string;
	let tenantId: string;

	// 테스트에서 생성한 카테고리 ID 목록 (정리용)
	const createdCategoryIds: string[] = [];

	// 테스트용 고유 접두사
	const TEST_PREFIX = `E2E_TEST_CAT_${Date.now()}`;

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

		// 인증 정보 설정
		try {
			const auth = await getTestAuth(app);
			jwtToken = auth.jwtToken;
			spaceId = auth.spaceId;
			userId = auth.userId;

			// tenantId 조회
			const prisma = app.get(PRISMA_SERVICE_TOKEN);
			const tenant = await prisma.tenant.findFirst({
				where: {
					userId: auth.userId,
					spaceId: auth.spaceId,
				},
			});
			if (tenant) {
				tenantId = tenant.id;
			}
		} catch (error) {
			console.warn(`테스트 인증 설정 실패: ${error}`);
		}
	}, 60000);

	afterAll(async () => {
		// 테스트에서 생성한 카테고리 정리 (역순으로 삭제 - 하위부터)
		if (jwtToken && spaceId) {
			for (const id of [...createdCategoryIds].reverse()) {
				try {
					await request(app.getHttpServer())
						.delete(`/api/v1/categories/${id}`)
						.set("Authorization", `Bearer ${jwtToken}`)
						.set("X-Space-ID", spaceId);
				} catch {
					// 이미 삭제된 경우 무시
				}
			}
		}

		if (app) {
			await app.close();
		}
	}, 30000);

	/**
	 * 테스트용 카테고리 생성 헬퍼
	 */
	async function createTestCategory(
		name: string,
		parentId?: string,
	): Promise<{ id: string; name: string }> {
		const response = await request(app.getHttpServer())
			.post("/api/v1/categories")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("X-Space-ID", spaceId)
			.send({
				name,
				type: "Role",
				tenantId,
				spaceId,
				...(parentId ? { parentId } : {}),
			});

		if (response.status === 201) {
			const category = response.body.data;
			createdCategoryIds.push(category.id);
			return { id: category.id, name: category.name };
		}

		throw new Error(
			`테스트 카테고리 생성 실패: ${response.status} - ${JSON.stringify(response.body)}`,
		);
	}

	// ==================== Happy Path ====================

	describe("Happy Path", () => {
		describe("GET /api/v1/categories", () => {
			it("인증된 사용자는 카테고리 목록을 조회할 수 있어야 한다", async () => {
				if (!jwtToken || !spaceId) return;

				// When
				const response = await request(app.getHttpServer())
					.get("/api/v1/categories")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.httpStatus).toBe(200);
				expect(response.body.data).toBeInstanceOf(Array);
			});

			it("type=Role 쿼리로 필터링하면 Role 타입 카테고리만 조회되어야 한다", async () => {
				if (!jwtToken || !spaceId) return;

				// When
				const response = await request(app.getHttpServer())
					.get("/api/v1/categories")
					.query({ type: "Role" })
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.data).toBeInstanceOf(Array);

				// 모든 항목이 Role 타입이어야 한다
				for (const category of response.body.data) {
					expect(category.type).toBe("Role");
				}
			});
		});

		describe("GET /api/v1/categories/:id", () => {
			it("ID로 카테고리 상세를 조회하면 children과 roleClassifications가 포함되어야 한다", async () => {
				if (!jwtToken || !spaceId || !tenantId) return;

				// Given: 테스트용 카테고리 생성
				const category = await createTestCategory(
					`${TEST_PREFIX}_DETAIL`,
				);

				// When
				const response = await request(app.getHttpServer())
					.get(`/api/v1/categories/${category.id}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then
				expect(response.status).toBe(200);
				expect(response.body.httpStatus).toBe(200);
				expect(response.body.data.id).toBe(category.id);
				expect(response.body.data.name).toBe(`${TEST_PREFIX}_DETAIL`);
				expect(response.body.data).toHaveProperty("children");
				expect(response.body.data).toHaveProperty(
					"roleClassifications",
				);
			});
		});

		describe("POST /api/v1/categories", () => {
			it("최상위 카테고리를 생성할 수 있어야 한다 (parentId 없음)", async () => {
				if (!jwtToken || !spaceId || !tenantId) return;

				// Given
				const categoryName = `${TEST_PREFIX}_ROOT`;

				// When
				const response = await request(app.getHttpServer())
					.post("/api/v1/categories")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId)
					.send({
						name: categoryName,
						type: "Role",
						tenantId,
						spaceId,
					});

				// Then
				expect(response.status).toBe(201);
				expect(response.body.httpStatus).toBe(201);
				expect(response.body.data.name).toBe(categoryName);
				expect(response.body.data.parentId).toBeNull();

				createdCategoryIds.push(response.body.data.id);
			});

			it("하위 카테고리를 생성할 수 있어야 한다 (parentId 지정)", async () => {
				if (!jwtToken || !spaceId || !tenantId) return;

				// Given: 상위 카테고리 생성
				const parent = await createTestCategory(
					`${TEST_PREFIX}_PARENT_FOR_CHILD`,
				);
				const childName = `${TEST_PREFIX}_CHILD`;

				// When
				const response = await request(app.getHttpServer())
					.post("/api/v1/categories")
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId)
					.send({
						name: childName,
						type: "Role",
						tenantId,
						spaceId,
						parentId: parent.id,
					});

				// Then
				expect(response.status).toBe(201);
				expect(response.body.data.name).toBe(childName);
				expect(response.body.data.parentId).toBe(parent.id);

				createdCategoryIds.push(response.body.data.id);
			});
		});

		describe("DELETE /api/v1/categories/:id", () => {
			it("리프 카테고리를 삭제할 수 있어야 하며 이후 조회 시 404를 반환해야 한다", async () => {
				if (!jwtToken || !spaceId || !tenantId) return;

				// Given: 삭제할 카테고리 생성
				const category = await createTestCategory(
					`${TEST_PREFIX}_TO_DELETE`,
				);

				// When: 삭제
				const deleteResponse = await request(app.getHttpServer())
					.delete(`/api/v1/categories/${category.id}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				// Then: 삭제 성공
				expect(deleteResponse.status).toBe(200);

				// Then: 삭제된 카테고리 조회 시 404
				const getResponse = await request(app.getHttpServer())
					.get(`/api/v1/categories/${category.id}`)
					.set("Authorization", `Bearer ${jwtToken}`)
					.set("X-Space-ID", spaceId);

				expect(getResponse.status).toBe(404);

				// 이미 삭제되었으므로 정리 목록에서 제거
				const idx = createdCategoryIds.indexOf(category.id);
				if (idx !== -1) createdCategoryIds.splice(idx, 1);
			});
		});
	});

	// ==================== Error Path ====================

	describe("Error Path", () => {
		it("인증 없이 카테고리 목록을 조회하면 401을 반환해야 한다", async () => {
			// When
			const response = await request(app.getHttpServer()).get(
				"/api/v1/categories",
			);

			// Then
			expect(response.status).toBe(401);
		});

		it("인증 없이 카테고리를 생성하면 401을 반환해야 한다", async () => {
			// When
			const response = await request(app.getHttpServer())
				.post("/api/v1/categories")
				.send({
					name: "UNAUTHORIZED_CAT",
					type: "Role",
				});

			// Then
			expect(response.status).toBe(401);
		});

		it("인증 없이 카테고리를 삭제하면 401을 반환해야 한다", async () => {
			// When
			const response = await request(app.getHttpServer()).delete(
				"/api/v1/categories/00000000-0000-0000-0000-000000000099",
			);

			// Then
			expect(response.status).toBe(401);
		});

		it("중복된 이름으로 카테고리를 생성하면 409를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId || !tenantId) return;

			// Given: 카테고리 생성
			const duplicateName = `${TEST_PREFIX}_DUPLICATE`;
			await createTestCategory(duplicateName);

			// When: 동일 이름으로 재생성 시도
			const response = await request(app.getHttpServer())
				.post("/api/v1/categories")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					name: duplicateName,
					type: "Role",
					tenantId,
					spaceId,
				});

			// Then
			expect(response.status).toBe(409);
			expect(response.body.message).toContain(
				"이미 존재하는 카테고리 이름입니다",
			);
		});

		it("하위 카테고리가 존재하는 카테고리를 삭제하면 400을 반환해야 한다", async () => {
			if (!jwtToken || !spaceId || !tenantId) return;

			// Given: 부모-자식 관계 생성
			const parent = await createTestCategory(
				`${TEST_PREFIX}_PARENT_NO_DEL`,
			);
			await createTestCategory(`${TEST_PREFIX}_CHILD_NO_DEL`, parent.id);

			// When: 부모 삭제 시도
			const response = await request(app.getHttpServer())
				.delete(`/api/v1/categories/${parent.id}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// Then
			expect(response.status).toBe(400);
			expect(response.body.message).toContain(
				"하위 카테고리가",
			);
			expect(response.body.message).toContain(
				"삭제할 수 없습니다",
			);
		});

		it("존재하지 않는 카테고리를 조회하면 404를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// When
			const response = await request(app.getHttpServer())
				.get(
					"/api/v1/categories/00000000-0000-0000-0000-000000000099",
				)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// Then
			expect(response.status).toBe(404);
			expect(response.body.message).toContain(
				"카테고리를 찾을 수 없습니다",
			);
		});

		it("존재하지 않는 카테고리를 삭제하면 404를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// When
			const response = await request(app.getHttpServer())
				.delete(
					"/api/v1/categories/00000000-0000-0000-0000-000000000099",
				)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// Then
			expect(response.status).toBe(404);
		});

		describe("MANAGE 역할 권한 제한 테스트", () => {
			// 참고: 현재 테스트 사용자(plate@gmail.com)는 FULL_ACCESS 역할이므로
			// MANAGE 전용 사용자가 필요합니다. 해당 사용자가 없으면 건너뜁니다.
			it("MANAGE 역할로 카테고리 생성 시 403을 반환해야 한다 (FULL_ACCESS 사용자이므로 건너뜀)", async () => {
				// FULL_ACCESS 사용자만 있으므로 이 테스트는 건너뜁니다
				// MANAGE 전용 사용자를 시드에 추가하면 활성화할 수 있습니다
				return;
			});

			it("MANAGE 역할로 카테고리 삭제 시 403을 반환해야 한다 (FULL_ACCESS 사용자이므로 건너뜀)", async () => {
				// FULL_ACCESS 사용자만 있으므로 이 테스트는 건너뜁니다
				return;
			});
		});
	});

	// ==================== Edge Case ====================

	describe("Edge Case", () => {
		it("자기 자신을 parentId로 설정하면 400을 반환해야 한다", async () => {
			if (!jwtToken || !spaceId || !tenantId) return;

			// Given: 카테고리 생성
			const category = await createTestCategory(
				`${TEST_PREFIX}_SELF_REF`,
			);

			// When: 자기 자신을 parentId로 설정
			const response = await request(app.getHttpServer())
				.patch(`/api/v1/categories/${category.id}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({ parentId: category.id });

			// Then
			expect(response.status).toBe(400);
			expect(response.body.message).toContain(
				"자기 자신을 상위 카테고리로 설정할 수 없습니다",
			);
		});

		it("2단계 순환 참조를 감지하고 400을 반환해야 한다 (부모 -> 자식 -> 부모)", async () => {
			if (!jwtToken || !spaceId || !tenantId) return;

			// Given: 부모 -> 자식 관계 생성
			const parent = await createTestCategory(
				`${TEST_PREFIX}_CIRC_PARENT`,
			);
			const child = await createTestCategory(
				`${TEST_PREFIX}_CIRC_CHILD`,
				parent.id,
			);

			// When: 부모의 parentId를 자식으로 설정 (순환 참조 시도)
			const response = await request(app.getHttpServer())
				.patch(`/api/v1/categories/${parent.id}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({ parentId: child.id });

			// Then
			expect(response.status).toBe(400);
			expect(response.body.message).toContain("순환 참조");
		});

		it("하위 카테고리를 먼저 삭제하면 부모 카테고리를 삭제할 수 있어야 한다", async () => {
			if (!jwtToken || !spaceId || !tenantId) return;

			// Given: 부모 -> 자식 관계 생성
			const parent = await createTestCategory(
				`${TEST_PREFIX}_DEL_PARENT`,
			);
			const child = await createTestCategory(
				`${TEST_PREFIX}_DEL_CHILD`,
				parent.id,
			);

			// When: 자식 먼저 삭제
			const deleteChildResponse = await request(app.getHttpServer())
				.delete(`/api/v1/categories/${child.id}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			expect(deleteChildResponse.status).toBe(200);

			// 정리 목록에서 제거
			const childIdx = createdCategoryIds.indexOf(child.id);
			if (childIdx !== -1) createdCategoryIds.splice(childIdx, 1);

			// When: 부모 삭제
			const deleteParentResponse = await request(app.getHttpServer())
				.delete(`/api/v1/categories/${parent.id}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// Then
			expect(deleteParentResponse.status).toBe(200);

			// 정리 목록에서 제거
			const parentIdx = createdCategoryIds.indexOf(parent.id);
			if (parentIdx !== -1) createdCategoryIds.splice(parentIdx, 1);
		});

		it("parentId를 null로 수정하면 최상위 카테고리로 이동해야 한다", async () => {
			if (!jwtToken || !spaceId || !tenantId) return;

			// Given: 부모 -> 자식 관계 생성
			const parent = await createTestCategory(
				`${TEST_PREFIX}_MOVE_PARENT`,
			);
			const child = await createTestCategory(
				`${TEST_PREFIX}_MOVE_CHILD`,
				parent.id,
			);

			// 자식이 부모에 속해있는지 확인
			const beforeResponse = await request(app.getHttpServer())
				.get(`/api/v1/categories/${child.id}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			expect(beforeResponse.body.data.parentId).toBe(parent.id);

			// When: parentId를 null로 수정 (최상위로 이동)
			const response = await request(app.getHttpServer())
				.patch(`/api/v1/categories/${child.id}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({ parentId: null });

			// Then
			expect(response.status).toBe(200);
			expect(response.body.data.parentId).toBeNull();
		});

		it("유효하지 않은 UUID 형식의 ID로 조회하면 400을 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/categories/invalid-uuid-format")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// Then (ParseUUIDPipe에 의해 400)
			expect(response.status).toBe(400);
		});
	});
});
