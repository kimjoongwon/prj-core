import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../src/module/app.module";
import { setNestApp } from "../../src/setNestApp";
import { getTestAuth, TestJwtStrategy } from "../helpers/test-auth.helper";

describe("Album API E2E 테스트", () => {
	let app: INestApplication;
	let jwtToken: string;
	let spaceId: string;

	const createdAlbumIds: string[] = [];
	const createdAssetIds: string[] = [];
	const createdFolderIds: string[] = [];
	const TEST_PREFIX = `E2E_ALBUM_${Date.now()}`;

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
		// 생성된 앨범 정리
		if (jwtToken && spaceId) {
			for (const albumId of createdAlbumIds) {
				try {
					await request(app.getHttpServer())
						.delete(`/api/v1/assets/albums/${albumId}`)
						.set("Authorization", `Bearer ${jwtToken}`)
						.set("X-Space-ID", spaceId);
				} catch {
					// 이미 삭제된 데이터는 무시
				}
			}

			// 생성된 에셋 정리
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

	// 테스트용 에셋 생성 헬퍼
	async function createTestAsset(folderId: string, name: string): Promise<string> {
		const response = await request(app.getHttpServer())
			.post("/api/v1/assets")
			.set("Authorization", `Bearer ${jwtToken}`)
			.set("X-Space-ID", spaceId)
			.send({
				spaceId,
				folderId,
				kind: "IMAGE",
				status: "READY",
				originalName: name,
				storageKey: `e2e-test/${Date.now()}/${name}`,
				mimeType: "image/jpeg",
				sizeBytes: 1024,
			});

		if (response.status === 201 && response.body.data?.id) {
			createdAssetIds.push(response.body.data.id);
			return response.body.data.id;
		}
		throw new Error(`테스트 에셋 생성 실패: ${response.status}`);
	}

	describe("GET /api/v1/assets/albums", () => {
		it("Given 인증된 사용자가 있을 때 When 앨범 목록을 조회하면 Then 200과 ResponseEntity 배열을 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/assets/albums")
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

		it("Given 인증 없이 요청할 때 When 앨범 목록을 조회하면 Then 401을 반환해야 한다", async () => {
			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/assets/albums")
				.query({ skip: 0, take: 10 });

			// Then
			expect(response.status).toBe(401);
		});

		it("Given X-Space-ID 없이 요청할 때 When 앨범 목록을 조회하면 Then 400을 반환해야 한다", async () => {
			if (!jwtToken) return;

			// When
			const response = await request(app.getHttpServer())
				.get("/api/v1/assets/albums")
				.set("Authorization", `Bearer ${jwtToken}`)
				.query({ skip: 0, take: 10 });

			// Then
			expect(response.status).toBe(400);
		});
	});

	describe("GET /api/v1/assets/albums/:albumId", () => {
		it("Given 존재하지 않는 UUID가 있을 때 When 앨범 단건을 조회하면 Then 404를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given
			const nonExistentAlbumId = "00000000-0000-0000-0000-000000000099";

			// When
			const response = await request(app.getHttpServer())
				.get(`/api/v1/assets/albums/${nonExistentAlbumId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// Then
			expect(response.status).toBe(404);
		});
	});

	describe("POST /api/v1/assets/albums", () => {
		it("Given 인증 토큰과 X-Space-ID 및 유효한 데이터가 있을 때 When 앨범을 생성하면 Then 201과 생성된 앨범을 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given
			const createDto = {
				spaceId,
				name: `${TEST_PREFIX}_ALBUM`,
				description: "E2E 테스트용 앨범",
				sortOrder: 9999,
			};

			// When
			const response = await request(app.getHttpServer())
				.post("/api/v1/assets/albums")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send(createDto);

			// Then
			expect(response.status).toBe(201);
			expect(response.body.httpStatus).toBe(201);
			expect(response.body.data.id).toBeDefined();
			expect(response.body.data.name).toBe(createDto.name);
			expect(response.body.data.description).toBe(createDto.description);

			createdAlbumIds.push(response.body.data.id);
		});

		it("Given 필수 필드가 누락된 데이터가 있을 때 When 앨범을 생성하면 Then 400을 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given - name 누락
			const invalidDto = {
				spaceId,
				description: "이름 누락 테스트",
				sortOrder: 1,
			};

			// When
			const response = await request(app.getHttpServer())
				.post("/api/v1/assets/albums")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send(invalidDto);

			// Then
			expect(response.status).toBe(400);
		});

		it("Given 인증 토큰 없이 요청할 때 When 앨범을 생성하면 Then 401을 반환해야 한다", async () => {
			if (!spaceId) return;

			const createDto = {
				spaceId,
				name: "unauth-album",
				sortOrder: 1,
			};

			// When
			const response = await request(app.getHttpServer())
				.post("/api/v1/assets/albums")
				.set("X-Space-ID", spaceId)
				.send(createDto);

			// Then
			expect(response.status).toBe(401);
		});
	});

	describe("PATCH /api/v1/assets/albums/:albumId", () => {
		it("Given 기존 앨범이 있을 때 When 앨범을 수정하면 Then 200과 수정된 앨범을 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given - 앨범 생성
			const createResponse = await request(app.getHttpServer())
				.post("/api/v1/assets/albums")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					spaceId,
					name: `${TEST_PREFIX}_BEFORE_UPDATE`,
					description: "수정 전",
					sortOrder: 9998,
				});

			const albumId = createResponse.body.data.id;
			createdAlbumIds.push(albumId);

			// When
			const response = await request(app.getHttpServer())
				.patch(`/api/v1/assets/albums/${albumId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					name: `${TEST_PREFIX}_AFTER_UPDATE`,
					description: "수정 후",
				});

			// Then
			expect(response.status).toBe(200);
			expect(response.body.data.name).toBe(`${TEST_PREFIX}_AFTER_UPDATE`);
			expect(response.body.data.description).toBe("수정 후");
		});

		it("Given 존재하지 않는 앨범 ID가 있을 때 When 수정하면 Then 404를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			const nonExistentAlbumId = "00000000-0000-0000-0000-000000000099";

			// When
			const response = await request(app.getHttpServer())
				.patch(`/api/v1/assets/albums/${nonExistentAlbumId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({ name: "updated" });

			// Then
			expect(response.status).toBe(404);
		});
	});

	describe("DELETE /api/v1/assets/albums/:albumId", () => {
		it("Given 기존 앨범이 있을 때 When 앨범을 삭제하면 Then 204를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given - 앨범 생성
			const createResponse = await request(app.getHttpServer())
				.post("/api/v1/assets/albums")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					spaceId,
					name: `${TEST_PREFIX}_TO_DELETE`,
					sortOrder: 9997,
				});

			const albumId = createResponse.body.data.id;

			// When
			const response = await request(app.getHttpServer())
				.delete(`/api/v1/assets/albums/${albumId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// Then
			expect(response.status).toBe(204);
		});

		it("Given 존재하지 않는 앨범 ID가 있을 때 When 삭제하면 Then 404를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			const nonExistentAlbumId = "00000000-0000-0000-0000-000000000099";

			// When
			const response = await request(app.getHttpServer())
				.delete(`/api/v1/assets/albums/${nonExistentAlbumId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// Then
			expect(response.status).toBe(404);
		});
	});

	describe("POST /api/v1/assets/albums/:albumId/entries", () => {
		it("Given 앨범과 에셋이 있을 때 When 앨범에 에셋을 추가하면 Then 200과 업데이트된 앨범을 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given - 앨범 생성
			const albumResponse = await request(app.getHttpServer())
				.post("/api/v1/assets/albums")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					spaceId,
					name: `${TEST_PREFIX}_ENTRY_ALBUM`,
					sortOrder: 9996,
				});

			const albumId = albumResponse.body.data.id;
			createdAlbumIds.push(albumId);

			// Given - 폴더와 에셋 생성
			const folderId = await createTestFolder(`${TEST_PREFIX}_ENTRY_FOLDER`);
			const assetId1 = await createTestAsset(folderId, "entry-test-1.jpg");
			const assetId2 = await createTestAsset(folderId, "entry-test-2.jpg");

			// When
			const response = await request(app.getHttpServer())
				.post(`/api/v1/assets/albums/${albumId}/entries`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({ assetIds: [assetId1, assetId2] });

			// Then
			expect(response.status).toBe(200);
			expect(response.body.data.entries).toBeDefined();
			expect(response.body.data.entries.length).toBeGreaterThanOrEqual(2);
		});

		it("Given 존재하지 않는 앨범 ID가 있을 때 When 에셋을 추가하면 Then 404를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			const nonExistentAlbumId = "00000000-0000-0000-0000-000000000099";

			// When
			const response = await request(app.getHttpServer())
				.post(`/api/v1/assets/albums/${nonExistentAlbumId}/entries`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({ assetIds: ["00000000-0000-0000-0000-000000000001"] });

			// Then
			expect(response.status).toBe(404);
		});
	});

	describe("DELETE /api/v1/assets/albums/:albumId/entries/:assetId", () => {
		it("Given 앨범에 에셋이 추가되어 있을 때 When 에셋을 제거하면 Then 204를 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given - 앨범 생성
			const albumResponse = await request(app.getHttpServer())
				.post("/api/v1/assets/albums")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					spaceId,
					name: `${TEST_PREFIX}_REMOVE_ENTRY_ALBUM`,
					sortOrder: 9995,
				});

			const albumId = albumResponse.body.data.id;
			createdAlbumIds.push(albumId);

			// Given - 폴더와 에셋 생성 후 앨범에 추가
			const folderId = await createTestFolder(`${TEST_PREFIX}_REMOVE_FOLDER`);
			const assetId = await createTestAsset(folderId, "remove-entry-test.jpg");

			await request(app.getHttpServer())
				.post(`/api/v1/assets/albums/${albumId}/entries`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({ assetIds: [assetId] });

			// When
			const response = await request(app.getHttpServer())
				.delete(`/api/v1/assets/albums/${albumId}/entries/${assetId}`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId);

			// Then
			expect(response.status).toBe(204);
		});
	});

	describe("PATCH /api/v1/assets/albums/:albumId/entries/reorder", () => {
		it("Given 앨범에 여러 에셋이 있을 때 When 순서를 변경하면 Then 200을 반환해야 한다", async () => {
			if (!jwtToken || !spaceId) return;

			// Given - 앨범 생성
			const albumResponse = await request(app.getHttpServer())
				.post("/api/v1/assets/albums")
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					spaceId,
					name: `${TEST_PREFIX}_REORDER_ALBUM`,
					sortOrder: 9994,
				});

			const albumId = albumResponse.body.data.id;
			createdAlbumIds.push(albumId);

			// Given - 폴더와 에셋 3개 생성 후 앨범에 추가
			const folderId = await createTestFolder(`${TEST_PREFIX}_REORDER_FOLDER`);
			const assetId1 = await createTestAsset(folderId, "reorder-1.jpg");
			const assetId2 = await createTestAsset(folderId, "reorder-2.jpg");
			const assetId3 = await createTestAsset(folderId, "reorder-3.jpg");

			await request(app.getHttpServer())
				.post(`/api/v1/assets/albums/${albumId}/entries`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({ assetIds: [assetId1, assetId2, assetId3] });

			// When - 순서 변경
			const response = await request(app.getHttpServer())
				.patch(`/api/v1/assets/albums/${albumId}/entries/reorder`)
				.set("Authorization", `Bearer ${jwtToken}`)
				.set("X-Space-ID", spaceId)
				.send({
					entries: [
						{ entryId: assetId1, position: 3 },
						{ entryId: assetId2, position: 1 },
						{ entryId: assetId3, position: 2 },
					],
				});

			// Then
			expect(response.status).toBe(200);
		});
	});
});
