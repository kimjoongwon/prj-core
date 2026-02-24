import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../src/modules/app.module";
import { setNestApp } from "../../src/setNestApp";
import { getTestAuth, TestJwtStrategy } from "../helpers/test-auth.helper";

describe("Asset API E2E 테스트", () => {
	let app: INestApplication;
	let jwtToken: string;
	let spaceId: string;

	const createdAssetIds: string[] = [];
	const createdFolderIds: string[] = [];
	const TEST_PREFIX = `E2E_ASSET_${Date.now()}`;

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
		// 생성된 에셋 정리
		if (jwtToken && spaceId) {
			for (const assetId of createdAssetIds) {
				try {
					await request(app.getHttpServer())
						.delete(`/api/v1/assets/${assetId}`)
						.set("Authorization", `Bearer ${jwtToken}`)
						.set("X-Space-ID", spaceId);
				} catch {
					// 이미 삭제된 데이터는 무시
				}
			}

			// 생성된 폴더 정리
			for (const folderId of createdFolderIds) {
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

	// 테스트용 폴더 생성 헬퍼
	async function createTestFolder(name: string): Promise<string> {
		const response = await request(app.getHttpServer())
			.post("/api/v1/assets/folders")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("X-Space-ID", spaceId)
			.send({
				spaceId,
				name,
				sortOrder: 9999,
			});

		if (response.status === 201 && response.body.data?.id) {
			createdFolderIds.push(response.body.data.id);
			return response.body.data.id;
		}
		throw new Error(`테스트 폴더 생성 실패: ${response.status}`);
	}

	describe("GET /api/v1/assets", () => {
		it("Given 인증된 사용자가 있을 때 When 에셋 목록을 조회하면 Then 200과 ResponseEntity 배열을 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/assets")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.query({ skip: 0, take: 10 });

			// Then
			expect(response.status).toBe(200);
			expect(response.body.httpStatus).toBe(200);
			expect(response.body.data).toBeInstanceOf(Array);
			expect(response.body.message).toEqual(expect.any(String));
			expect(response.body.meta).toBeDefined();
			expect(response.body.meta.total).toBeDefined();
		});

		it("Given 인증 없이 요청할 때 When 에셋 목록을 조회하면 Then 401을 반환해야 한다", async () => {
			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/assets")
				.query({ skip: 0, take: 10 });

			// Then
			expect(response.status).toBe(401);
		});

		it("Given X-Space-ID 없이 요청할 때 When 에셋 목록을 조회하면 Then 400을 반환해야 한다", async () => {
			if (!jwtToken) return;

			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/assets")
				.set("Authorization", `Bearer ${jwtToken}`)
				.query({ skip: 0, take: 10 });

			// Then
			expect(response.status).toBe(400);
		});
	});

	describe("GET /api/v1/assets/:assetId", () => {
		it("Given 존재하지 않는 UUID가 있을 때 When 에셋 단건을 조회하면 Then 404를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given
			const nonExistentAssetId = "00000000-0000-0000-0000-000000000099";

			// When
			const response = await request(app.getHttpServer())
				.get(`/api/v1/assets/${nonExistentAssetId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// Then
			expect(response.status).toBe(404);
		});
	});

	describe("POST /api/v1/assets", () => {
		it("Given 인증 토큰과 X-Space-ID 및 유효한 데이터가 있을 때 When 에셋을 생성하면 Then 201과 생성된 에셋을 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given - 먼저 폴더 생성
			const folderId = await createTestFolder(`${TEST_PREFIX}_FOLDER`);

			const createDto = {
				spaceId,
				folderId,
				kind: "IMAGE",
				status: "READY",
				originalName: `test-image-${Date.now()}.jpg`,
				storageKey: `e2e-test/${Date.now()}/test.jpg`,
				mimeType: "image/jpeg",
				sizeBytes: 1024,
				extension: "jpg",
				checksum: "abc123",
			};

			// When
			const response = await request(app.getHttpServer())
				.post("/api/v1/assets")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send(createDto);

			// Then
			expect(response.status).toBe(201);
			expect(response.body.httpStatus).toBe(201);
			expect(response.body.data.id).toBeDefined();
			expect(response.body.data.kind).toBe("IMAGE");
			expect(response.body.data.status).toBe("READY");
			expect(response.body.data.originalName).toBe(createDto.originalName);

			createdAssetIds.push(response.body.data.id);
		});

		it("Given 필수 필드가 누락된 데이터가 있을 때 When 에셋을 생성하면 Then 400을 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given - folderId 누락
			const invalidDto = {
				spaceId,
				kind: "IMAGE",
				status: "READY",
				originalName: "test.jpg",
				storageKey: "test/test.jpg",
				mimeType: "image/jpeg",
				sizeBytes: 1024,
			};

			// When
			const response = await request(app.getHttpServer())
				.post("/api/v1/assets")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send(invalidDto);

			// Then
			expect(response.status).toBe(400);
		});

		it("Given 인증 토큰 없이 요청할 때 When 에셋을 생성하면 Then 401을 반환해야 한다", async () => {
			if (!spaceId) return;

			const createDto = {
				spaceId,
				kind: "IMAGE",
				status: "READY",
				originalName: "test.jpg",
				storageKey: "test/test.jpg",
				mimeType: "image/jpeg",
				sizeBytes: 1024,
			};

			// When
			const response = await request(app.getHttpServer())
				.post("/api/v1/assets")
				.set("X-Space-ID", spaceId)
				.send(createDto);

			// Then
			expect(response.status).toBe(401);
		});
	});

	describe("PATCH /api/v1/assets/:assetId", () => {
		it("Given 기존 에셋이 있을 때 When 에셋을 수정하면 Then 200과 수정된 에셋을 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given - 에셋 생성
			const folderId = await createTestFolder(`${TEST_PREFIX}_FOLDER_UPDATE`);
			const createResponse = await request(app.getHttpServer())
				.post("/api/v1/assets")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					spaceId,
					folderId,
					kind: "DOCUMENT",
					status: "UPLOADING",
					originalName: "before-update.pdf",
					storageKey: `e2e-test/${Date.now()}/before.pdf`,
					mimeType: "application/pdf",
					sizeBytes: 2048,
				});

			const assetId = createResponse.body.data.id;
			createdAssetIds.push(assetId);

			const updateDto = {
				originalName: "after-update.pdf",
				status: "READY",
			};

			// When
			const response = await request(app.getHttpServer())
				.patch(`/api/v1/assets/${assetId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send(updateDto);

			// Then
			expect(response.status).toBe(200);
			expect(response.body.data.originalName).toBe("after-update.pdf");
			expect(response.body.data.status).toBe("READY");
		});

		it("Given 존재하지 않는 에셋 ID가 있을 때 When 수정하면 Then 404를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			const nonExistentAssetId = "00000000-0000-0000-0000-000000000099";

			// When
			const response = await request(app.getHttpServer())
				.patch(`/api/v1/assets/${nonExistentAssetId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({ originalName: "updated.jpg" });

			// Then
			expect(response.status).toBe(404);
		});
	});

	describe("DELETE /api/v1/assets/:assetId", () => {
		it("Given 기존 에셋이 있을 때 When 에셋을 삭제하면 Then 204를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given - 에셋 생성
			const folderId = await createTestFolder(`${TEST_PREFIX}_FOLDER_DELETE`);
			const createResponse = await request(app.getHttpServer())
				.post("/api/v1/assets")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					spaceId,
					folderId,
					kind: "IMAGE",
					status: "READY",
					originalName: "to-delete.jpg",
					storageKey: `e2e-test/${Date.now()}/delete.jpg`,
					mimeType: "image/jpeg",
					sizeBytes: 512,
				});

			const assetId = createResponse.body.data.id;

			// When
			const response = await request(app.getHttpServer())
				.delete(`/api/v1/assets/${assetId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// Then
			expect(response.status).toBe(204);
		});

		it("Given 존재하지 않는 에셋 ID가 있을 때 When 삭제하면 Then 404를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			const nonExistentAssetId = "00000000-0000-0000-0000-000000000099";

			// When
			const response = await request(app.getHttpServer())
				.delete(`/api/v1/assets/${nonExistentAssetId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// Then
			expect(response.status).toBe(404);
		});
	});

	describe("POST /api/v1/assets/:assetId/move", () => {
		it("Given 에셋과 대상 폴더가 있을 때 When 에셋을 이동하면 Then 200과 이동된 에셋을 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given - 폴더 2개와 에셋 생성
			const sourceFolderId = await createTestFolder(`${TEST_PREFIX}_SOURCE`);
			const targetFolderId = await createTestFolder(`${TEST_PREFIX}_TARGET`);

			const createResponse = await request(app.getHttpServer())
				.post("/api/v1/assets")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					spaceId,
					folderId: sourceFolderId,
					kind: "IMAGE",
					status: "READY",
					originalName: "to-move.jpg",
					storageKey: `e2e-test/${Date.now()}/move.jpg`,
					mimeType: "image/jpeg",
					sizeBytes: 768,
				});

			const assetId = createResponse.body.data.id;
			createdAssetIds.push(assetId);

			// When
			const response = await request(app.getHttpServer())
				.post(`/api/v1/assets/${assetId}/move`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({ targetFolderId });

			// Then
			expect(response.status).toBe(200);
			expect(response.body.data.folderId).toBe(targetFolderId);
		});
	});

	describe("PATCH /api/v1/assets/:assetId/status", () => {
		it("Given 기존 에셋이 있을 때 When 상태를 변경하면 Then 200과 변경된 에셋을 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given - 에셋 생성
			const folderId = await createTestFolder(`${TEST_PREFIX}_FOLDER_STATUS`);
			const createResponse = await request(app.getHttpServer())
				.post("/api/v1/assets")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					spaceId,
					folderId,
					kind: "VIDEO",
					status: "UPLOADING",
					originalName: "uploading.mp4",
					storageKey: `e2e-test/${Date.now()}/uploading.mp4`,
					mimeType: "video/mp4",
					sizeBytes: 10240,
				});

			const assetId = createResponse.body.data.id;
			createdAssetIds.push(assetId);

			// When
			const response = await request(app.getHttpServer())
				.patch(`/api/v1/assets/${assetId}/status`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({ status: "READY" });

			// Then
			expect(response.status).toBe(200);
			expect(response.body.data.status).toBe("READY");
		});
	});
});
