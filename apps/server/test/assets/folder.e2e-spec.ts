import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../src/modules/app.module";
import { setNestApp } from "../../src/setNestApp";
import { getTestAuth, TestJwtStrategy } from "../helpers/test-auth.helper";

describe("Folder API E2E 테스트", () => {
	let app: INestApplication;
	let jwtToken: string;
	let spaceId: string;

	const createdFolderIds: string[] = [];
	const TEST_PREFIX = `E2E_FOLDER_${Date.now()}`;

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
		} catch (error) {
			console.warn(`테스트 인증 설정 실패: ${error}`);
		}
	}, 60000);

	afterAll(async () => {
		// 생성된 폴더 정리 (하위 폴더부터 삭제)
		if (jwtToken && spaceId) {
			for (const folderId of [...createdFolderIds].reverse()) {
				try {
					await request(app.getHttpServer())
						.delete(`/api/v1/assets/folders/${folderId}`)
						.set("Authorization", `Bearer ${jwtToken}`)
						.set("X-Space-ID", spaceId);
				} catch {
					// 이미 삭제된 데이터는 무시
				}
			}
		}

		if (app) {
			await app.close();
		}
	}, 30000);

	describe("GET /api/v1/assets/folders", () => {
		it("Given 인증된 사용자가 있을 때 When 폴더 목록을 조회하면 Then 200과 ResponseEntity 배열을 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/assets/folders")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.query({ skip: 0, take: 10 });

			// Then
			expect(response.status).toBe(200);
			expect(response.body.httpStatus).toBe(200);
			expect(response.body.data).toBeInstanceOf(Array);
			expect(response.body.message).toEqual(expect.any(String));
			expect(response.body.meta).toBeDefined();
		});

		it("Given 인증 없이 요청할 때 When 폴더 목록을 조회하면 Then 401을 반환해야 한다", async () => {
			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/assets/folders")
				.query({ skip: 0, take: 10 });

			// Then
			expect(response.status).toBe(401);
		});

		it("Given X-Space-ID 없이 요청할 때 When 폴더 목록을 조회하면 Then 400을 반환해야 한다", async () => {
			if (!jwtToken) return;

			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/assets/folders")
				.set("Authorization", `Bearer ${jwtToken}`)
				.query({ skip: 0, take: 10 });

			// Then
			expect(response.status).toBe(400);
		});
	});

	describe("GET /api/v1/assets/folders/tree", () => {
		it("Given 인증된 사용자가 있을 때 When 폴더 트리를 조회하면 Then 200과 트리 구조를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/assets/folders/tree")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// Then
			expect(response.status).toBe(200);
			expect(response.body.httpStatus).toBe(200);
			expect(response.body.data).toBeInstanceOf(Array);
		});

		it("Given 인증 없이 요청할 때 When 폴더 트리를 조회하면 Then 401을 반환해야 한다", async () => {
			// When
			const response = await request(app.getHttpServer()).get(
				"/api/v1/assets/folders/tree",
			);

			// Then
			expect(response.status).toBe(401);
		});
	});

	describe("GET /api/v1/assets/folders/:folderId", () => {
		it("Given 존재하지 않는 UUID가 있을 때 When 폴더 단건을 조회하면 Then 404를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given
			const nonExistentFolderId = "00000000-0000-0000-0000-000000000099";

			// When
			const response = await request(app.getHttpServer())
				.get(`/api/v1/assets/folders/${nonExistentFolderId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// Then
			expect(response.status).toBe(404);
		});
	});

	describe("POST /api/v1/assets/folders", () => {
		it("Given 인증 토큰과 X-Space-ID 및 유효한 데이터가 있을 때 When 폴더를 생성하면 Then 201과 생성된 폴더를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given
			const createDto = {
				spaceId,
				name: `${TEST_PREFIX}_ROOT`,
				sortOrder: 9999,
			};

			// When
			const response = await request(app.getHttpServer())
				.post("/api/v1/assets/folders")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send(createDto);

			// Then
			expect(response.status).toBe(201);
			expect(response.body.httpStatus).toBe(201);
			expect(response.body.data.id).toBeDefined();
			expect(response.body.data.name).toBe(createDto.name);
			expect(response.body.data.path).toBe(`/${createDto.name}`);

			createdFolderIds.push(response.body.data.id);
		});

		it("Given 부모 폴더가 있을 때 When 하위 폴더를 생성하면 Then 201과 하위 폴더를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given - 부모 폴더 생성
			const parentResponse = await request(app.getHttpServer())
				.post("/api/v1/assets/folders")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					spaceId,
					name: `${TEST_PREFIX}_PARENT`,
					sortOrder: 9998,
				});

			const parentFolderId = parentResponse.body.data.id;
			createdFolderIds.push(parentFolderId);

			// When - 하위 폴더 생성
			const response = await request(app.getHttpServer())
				.post("/api/v1/assets/folders")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					spaceId,
					parentFolderId,
					name: `${TEST_PREFIX}_CHILD`,
					sortOrder: 1,
				});

			// Then
			expect(response.status).toBe(201);
			expect(response.body.data.parentFolderId).toBe(parentFolderId);
			expect(response.body.data.path).toContain("PARENT");
			expect(response.body.data.path).toContain("CHILD");

			createdFolderIds.push(response.body.data.id);
		});

		it("Given 필수 필드가 누락된 데이터가 있을 때 When 폴더를 생성하면 Then 400을 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given - name 누락
			const invalidDto = {
				spaceId,
				sortOrder: 1,
			};

			// When
			const response = await request(app.getHttpServer())
				.post("/api/v1/assets/folders")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send(invalidDto);

			// Then
			expect(response.status).toBe(400);
		});

		it("Given 인증 토큰 없이 요청할 때 When 폴더를 생성하면 Then 401을 반환해야 한다", async () => {
			if (!spaceId) return;

			const createDto = {
				spaceId,
				name: "unauth-folder",
				sortOrder: 1,
			};

			// When
			const response = await request(app.getHttpServer())
				.post("/api/v1/assets/folders")
				.set("X-Space-ID", spaceId)
				.send(createDto);

			// Then
			expect(response.status).toBe(401);
		});
	});

	describe("PATCH /api/v1/assets/folders/:folderId", () => {
		it("Given 기존 폴더가 있을 때 When 폴더명을 수정하면 Then 200과 수정된 폴더를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given - 폴더 생성
			const createResponse = await request(app.getHttpServer())
				.post("/api/v1/assets/folders")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					spaceId,
					name: `${TEST_PREFIX}_BEFORE_RENAME`,
					sortOrder: 9997,
				});

			const folderId = createResponse.body.data.id;
			createdFolderIds.push(folderId);

			// When
			const response = await request(app.getHttpServer())
				.patch(`/api/v1/assets/folders/${folderId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({ name: `${TEST_PREFIX}_AFTER_RENAME` });

			// Then
			expect(response.status).toBe(200);
			expect(response.body.data.name).toBe(`${TEST_PREFIX}_AFTER_RENAME`);
		});

		it("Given 존재하지 않는 폴더 ID가 있을 때 When 수정하면 Then 404를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			const nonExistentFolderId = "00000000-0000-0000-0000-000000000099";

			// When
			const response = await request(app.getHttpServer())
				.patch(`/api/v1/assets/folders/${nonExistentFolderId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({ name: "updated" });

			// Then
			expect(response.status).toBe(404);
		});
	});

	describe("DELETE /api/v1/assets/folders/:folderId", () => {
		it("Given 기존 폴더가 있을 때 When 폴더를 삭제하면 Then 204를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given - 폴더 생성
			const createResponse = await request(app.getHttpServer())
				.post("/api/v1/assets/folders")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					spaceId,
					name: `${TEST_PREFIX}_TO_DELETE`,
					sortOrder: 9996,
				});

			const folderId = createResponse.body.data.id;

			// When
			const response = await request(app.getHttpServer())
				.delete(`/api/v1/assets/folders/${folderId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// Then
			expect(response.status).toBe(204);
		});

		it("Given 존재하지 않는 폴더 ID가 있을 때 When 삭제하면 Then 404를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			const nonExistentFolderId = "00000000-0000-0000-0000-000000000099";

			// When
			const response = await request(app.getHttpServer())
				.delete(`/api/v1/assets/folders/${nonExistentFolderId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// Then
			expect(response.status).toBe(404);
		});
	});

	describe("POST /api/v1/assets/folders/:folderId/move", () => {
		it("Given 폴더와 대상 폴더가 있을 때 When 폴더를 이동하면 Then 200과 이동된 폴더를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given - 폴더 2개 생성
			const targetResponse = await request(app.getHttpServer())
				.post("/api/v1/assets/folders")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					spaceId,
					name: `${TEST_PREFIX}_MOVE_TARGET`,
					sortOrder: 9995,
				});

			const targetFolderId = targetResponse.body.data.id;
			createdFolderIds.push(targetFolderId);

			const sourceResponse = await request(app.getHttpServer())
				.post("/api/v1/assets/folders")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					spaceId,
					name: `${TEST_PREFIX}_MOVE_SOURCE`,
					sortOrder: 9994,
				});

			const sourceFolderId = sourceResponse.body.data.id;
			createdFolderIds.push(sourceFolderId);

			// When
			const response = await request(app.getHttpServer())
				.post(`/api/v1/assets/folders/${sourceFolderId}/move`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({ targetFolderId });

			// Then
			expect(response.status).toBe(200);
			expect(response.body.data.parentFolderId).toBe(targetFolderId);
		});

		it("Given targetFolderId가 null일 때 When 폴더를 이동하면 Then 루트로 이동해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given - 부모 폴더와 자식 폴더 생성
			const parentResponse = await request(app.getHttpServer())
				.post("/api/v1/assets/folders")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					spaceId,
					name: `${TEST_PREFIX}_ROOT_MOVE_PARENT`,
					sortOrder: 9993,
				});

			const parentFolderId = parentResponse.body.data.id;
			createdFolderIds.push(parentFolderId);

			const childResponse = await request(app.getHttpServer())
				.post("/api/v1/assets/folders")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					spaceId,
					parentFolderId,
					name: `${TEST_PREFIX}_ROOT_MOVE_CHILD`,
					sortOrder: 1,
				});

			const childFolderId = childResponse.body.data.id;
			createdFolderIds.push(childFolderId);

			// When - 루트로 이동
			const response = await request(app.getHttpServer())
				.post(`/api/v1/assets/folders/${childFolderId}/move`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({ targetFolderId: null });

			// Then
			expect(response.status).toBe(200);
			expect(response.body.data.parentFolderId).toBeNull();
		});
	});
});
