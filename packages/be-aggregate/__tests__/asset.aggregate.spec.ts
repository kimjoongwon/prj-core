import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Readable } from "node:stream";
import { SpaceContext } from "@cocrepo/context";
import { AssetKind, AssetStatus } from "@cocrepo/prisma";
import { AssetsRepository, FoldersRepository } from "@cocrepo/repository";
import { ObjectStorageService } from "@cocrepo/service";
import { Test, type TestingModule } from "@nestjs/testing";
import { AssetAggregate } from "../src/asset/asset.aggregate";

const tenantId = 100n;
const spaceSeq = 101n;
const parentSpaceId = 102n;
const folderSeq = 201n;
const assetSeq = 301n;
const userSeq = 401n;

describe("AssetAggregate", () => {
	let service: AssetAggregate;
	let mockAssetsRepository: jest.Mocked<AssetsRepository>;
	let mockFoldersRepository: jest.Mocked<FoldersRepository>;
	let mockObjectStorageService: jest.Mocked<ObjectStorageService>;
	let mockSpaceContext: SpaceContext;

	beforeEach(async () => {
		mockAssetsRepository = {
			findMany: jest.fn(),
			findByIdWithRelations: jest.fn(),
			create: jest.fn(),
			updateById: jest.fn(),
			deleteById: jest.fn(),
		} as unknown as jest.Mocked<AssetsRepository>;

		mockFoldersRepository = {
			findById: jest.fn(),
		} as unknown as jest.Mocked<FoldersRepository>;

		mockObjectStorageService = {
			putObject: jest.fn(),
			getObject: jest.fn(),
			deleteObject: jest.fn(),
			getPublicUrl: jest.fn(),
		} as jest.Mocked<ObjectStorageService>;

		mockSpaceContext = {
			tenantId,
			spaceSeq,
		} as unknown as SpaceContext;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AssetAggregate,
				{ provide: AssetsRepository, useValue: mockAssetsRepository },
				{ provide: FoldersRepository, useValue: mockFoldersRepository },
				{
					provide: ObjectStorageService,
					useValue: mockObjectStorageService,
				},
				{ provide: SpaceContext, useValue: mockSpaceContext },
			],
		}).compile();

		service = module.get<AssetAggregate>(AssetAggregate);
	});

	it("PLATFORM_ADMIN 목록 조회는 spaceSeq 필터 없이 전체 에셋을 요청해야 한다", async () => {
		mockAssetsRepository.findMany.mockResolvedValue({
			assets: [],
			totalCount: 0,
		} as never);

		await service.getAssets(createAssetQuery());

		const findManyInput = mockAssetsRepository.findMany.mock.calls[0][0];
		expect(findManyInput.where).not.toHaveProperty("spaceSeq");
	});

	it("일반 권한 목록 조회는 접근 가능한 spaceIds로 에셋을 제한해야 한다", async () => {
		(mockSpaceContext as unknown as { spaceIds: bigint[] }).spaceIds = [
			spaceSeq,
			parentSpaceId,
		];
		mockAssetsRepository.findMany.mockResolvedValue({
			assets: [],
			totalCount: 0,
		} as never);

		await service.getAssets(createAssetQuery());

		const findManyInput = mockAssetsRepository.findMany.mock.calls[0][0];
		expect(findManyInput.where).toEqual(
			expect.objectContaining({
				space: { id: { in: [spaceSeq, parentSpaceId] } },
			}),
		);
	});

	it("업로드 시 object storage 업로드 후 asset metadata를 생성해야 한다", async () => {
		const file = {
			originalname: "photo.png",
			mimetype: "image/png",
			size: 11,
			buffer: Buffer.from("hello-world"),
		};
		const expectedChecksum = createHash("sha256")
			.update(file.buffer)
			.digest("hex");

		mockFoldersRepository.findById.mockResolvedValue({
			id: folderSeq,
			spaceSeq,
			removedAt: null,
		} as never);
		mockObjectStorageService.putObject.mockResolvedValue({
			key: "unused",
			publicUrl: null,
		});
		mockAssetsRepository.create.mockImplementation(
			async (data) =>
				({
					id: assetSeq,
					createdAt: new Date(),
					updatedAt: new Date(),
					removedAt: null,
					spaceSeq: data.spaceSeq,
					folderSeq: data.folderSeq,
					kind: data.kind,
					status: data.status,
					originalName: data.originalName,
					storageKey: data.storageKey,
					mimeType: data.mimeType,
					sizeBytes: data.sizeBytes as bigint,
					extension: data.extension as string | null,
					checksum: data.checksum as string | null,
					metadata: data.metadata ?? null,
					createdBySeq:
						data.createdBySeq == null ? null : BigInt(data.createdBySeq),
					space: { id: spaceSeq },
				}) as never,
		);

		const result = await service.uploadAsset({ folderSeq }, file, userSeq);

		expect(mockObjectStorageService.putObject).toHaveBeenCalledTimes(1);
		const putObjectInput = mockObjectStorageService.putObject.mock.calls[0][0];
		expect(putObjectInput).toEqual(
			expect.objectContaining({
				contentType: "image/png",
				contentLength: 11,
				checksum: expectedChecksum,
				metadata: {
					originalName: "photo.png",
				},
			}),
		);
		expect(putObjectInput.key).toMatch(/^spaces\/101\/assets\/image\/.+\.png$/);
		expect(mockAssetsRepository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				spaceSeq,
				folderSeq,
				kind: AssetKind.IMAGE,
				status: AssetStatus.READY,
				originalName: "photo.png",
				storageKey: putObjectInput.key,
				mimeType: "image/png",
				sizeBytes: BigInt(11),
				extension: "png",
				checksum: expectedChecksum,
				createdBySeq: userSeq,
			}),
		);
		expect(result).toEqual(
			expect.objectContaining({
				storageKey: putObjectInput.key,
				checksum: expectedChecksum,
				sizeBytes: 11,
			}),
		);
	});

	it("임시 디스크 업로드는 파일 내용을 메모리에 적재하지 않고 object storage로 스트리밍해야 한다", async () => {
		const temporaryDirectoryPath = await mkdtemp(
			join(tmpdir(), "cocrepo-asset-aggregate-"),
		);
		const temporaryFilePath = join(temporaryDirectoryPath, "photo.png");
		const uploadedFileContent = Buffer.from("streamed-file-content");
		const expectedChecksum = createHash("sha256")
			.update(uploadedFileContent)
			.digest("hex");
		let uploadedAssetBody: unknown;

		try {
			await writeFile(temporaryFilePath, uploadedFileContent);
			mockFoldersRepository.findById.mockResolvedValue({
				id: folderSeq,
				spaceSeq,
				removedAt: null,
			} as never);
			mockObjectStorageService.putObject.mockImplementation(async (input) => {
				uploadedAssetBody = input.body;
				if (input.body instanceof Readable) {
					for await (const _uploadedFileChunk of input.body) {
						// 스트림을 끝까지 소비해 실제 전송 경계를 검증한다.
					}
				}

				return { key: input.key, publicUrl: null };
			});
			mockAssetsRepository.create.mockImplementation(
				async (data) =>
					({
						id: assetSeq,
						createdAt: new Date(),
						updatedAt: new Date(),
						removedAt: null,
						spaceSeq: data.spaceSeq,
						folderSeq: data.folderSeq,
						kind: data.kind,
						status: data.status,
						originalName: data.originalName,
						storageKey: data.storageKey,
						mimeType: data.mimeType,
						sizeBytes: data.sizeBytes as bigint,
						extension: data.extension as string | null,
						checksum: data.checksum as string | null,
						metadata: data.metadata ?? null,
						createdBySeq:
							data.createdBySeq == null ? null : BigInt(data.createdBySeq),
						space: { id: spaceSeq },
					}) as never,
			);

			await service.uploadAsset(
				{ folderSeq },
				{
					originalname: "photo.png",
					mimetype: "image/png",
					size: uploadedFileContent.length,
					path: temporaryFilePath,
				},
				userSeq,
			);

			expect(uploadedAssetBody).toBeInstanceOf(Readable);
			expect(uploadedAssetBody).not.toBeInstanceOf(Buffer);
			expect(mockAssetsRepository.create).toHaveBeenCalledWith(
				expect.objectContaining({ checksum: expectedChecksum }),
			);
		} finally {
			await rm(temporaryDirectoryPath, { recursive: true, force: true });
		}
	});

	it("업로드 파일명이 latin1 모지바케면 UTF-8 파일명으로 복원해야 한다", async () => {
		const mojibakeName = "íê¸-ìë¡ë.png";
		const normalizedName = "한글-업로드.png";
		const file = {
			originalname: mojibakeName,
			mimetype: "image/png",
			size: 11,
			buffer: Buffer.from("hello-world"),
		};

		mockFoldersRepository.findById.mockResolvedValue({
			id: folderSeq,
			spaceSeq,
			removedAt: null,
		} as never);
		mockObjectStorageService.putObject.mockResolvedValue({
			key: "unused",
			publicUrl: null,
		});
		mockAssetsRepository.create.mockImplementation(
			async (data) =>
				({
					id: assetSeq,
					createdAt: new Date(),
					updatedAt: new Date(),
					removedAt: null,
					spaceSeq: data.spaceSeq,
					folderSeq: data.folderSeq,
					kind: data.kind,
					status: data.status,
					originalName: data.originalName,
					storageKey: data.storageKey,
					mimeType: data.mimeType,
					sizeBytes: data.sizeBytes as bigint,
					extension: data.extension as string | null,
					checksum: data.checksum as string | null,
					metadata: data.metadata ?? null,
					createdBySeq:
						data.createdBySeq == null ? null : BigInt(data.createdBySeq),
				}) as never,
		);

		const result = await service.uploadAsset({ folderSeq }, file, userSeq);

		expect(mockObjectStorageService.putObject).toHaveBeenCalledWith(
			expect.objectContaining({
				metadata: expect.objectContaining({
					originalName: normalizedName,
				}),
			}),
		);
		expect(mockAssetsRepository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				originalName: normalizedName,
				extension: "png",
			}),
		);
		expect(result).toEqual(
			expect.objectContaining({
				originalName: normalizedName,
				extension: "png",
			}),
		);
	});

	it("삭제 시 object storage 삭제 후 DB 삭제를 수행해야 한다", async () => {
		mockAssetsRepository.findByIdWithRelations.mockResolvedValue({
			id: assetSeq,
			createdAt: new Date(),
			updatedAt: new Date(),
			removedAt: null,
			tenantId,
			tenant: { id: tenantId, spaceSeq },
			spaceSeq,
			folderSeq,
			kind: AssetKind.IMAGE,
			status: AssetStatus.READY,
			originalName: "photo.png",
			storageKey: "spaces/space-123/assets/image/file.png",
			mimeType: "image/png",
			sizeBytes: BigInt(11),
			extension: "png",
			checksum: "checksum",
			metadata: null,
			createdBySeq: userSeq,
		} as never);
		mockObjectStorageService.deleteObject.mockResolvedValue(undefined);
		mockAssetsRepository.deleteById.mockResolvedValue({} as never);

		await service.deleteAsset(assetSeq);

		expect(mockObjectStorageService.deleteObject).toHaveBeenCalledWith(
			"spaces/space-123/assets/image/file.png",
		);
		expect(mockAssetsRepository.deleteById).toHaveBeenCalledWith(assetSeq);
		expect(
			mockObjectStorageService.deleteObject.mock.invocationCallOrder[0],
		).toBeLessThan(mockAssetsRepository.deleteById.mock.invocationCallOrder[0]);
	});

	it("상세 원본 조회 시 현재 space의 object content를 반환해야 한다", async () => {
		mockAssetsRepository.findByIdWithRelations.mockResolvedValue({
			id: assetSeq,
			createdAt: new Date(),
			updatedAt: new Date(),
			removedAt: null,
			tenantId,
			tenant: { id: tenantId, spaceSeq },
			spaceSeq,
			folderSeq,
			kind: AssetKind.DOCUMENT,
			status: AssetStatus.READY,
			originalName: "guide.pdf",
			storageKey: "spaces/space-123/assets/document/file.pdf",
			mimeType: "application/pdf",
			sizeBytes: BigInt(11),
			extension: "pdf",
			checksum: "checksum",
			metadata: null,
			createdBySeq: userSeq,
		} as never);
		mockObjectStorageService.getObject.mockResolvedValue({
			body: Buffer.from("pdf-body"),
			contentType: "application/pdf",
			contentLength: 8,
			etag: '"etag-123"',
			lastModified: new Date("2026-04-05T06:00:00.000Z"),
		});

		const result = await service.getAssetContent(assetSeq);

		expect(mockObjectStorageService.getObject).toHaveBeenCalledWith(
			"spaces/space-123/assets/document/file.pdf",
		);
		expect(result).toEqual({
			body: Buffer.from("pdf-body"),
			contentType: "application/pdf",
			contentLength: 8,
			etag: '"etag-123"',
			fileName: "guide.pdf",
			lastModified: new Date("2026-04-05T06:00:00.000Z"),
		});
	});

	it("object storage 삭제가 실패하면 DB 삭제를 중단해야 한다", async () => {
		mockAssetsRepository.findByIdWithRelations.mockResolvedValue({
			id: assetSeq,
			createdAt: new Date(),
			updatedAt: new Date(),
			removedAt: null,
			tenantId,
			tenant: { id: tenantId, spaceSeq },
			spaceSeq,
			folderSeq,
			kind: AssetKind.IMAGE,
			status: AssetStatus.READY,
			originalName: "photo.png",
			storageKey: "spaces/space-123/assets/image/file.png",
			mimeType: "image/png",
			sizeBytes: BigInt(11),
			extension: "png",
			checksum: "checksum",
			metadata: null,
			createdBySeq: userSeq,
		} as never);
		mockObjectStorageService.deleteObject.mockRejectedValue(
			new Error("storage delete failed"),
		);

		await expect(service.deleteAsset(assetSeq)).rejects.toThrow(
			"storage delete failed",
		);
		expect(mockAssetsRepository.deleteById).not.toHaveBeenCalled();
	});
});

function createAssetQuery(): Parameters<AssetAggregate["getAssets"]>[0] {
	return {
		sort: [],
		skip: 0,
		take: 20,
	};
}
