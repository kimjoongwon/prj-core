import { createHash } from "node:crypto";
import { SpaceContext } from "@cocrepo/context";
import { AssetKind, AssetStatus } from "@cocrepo/prisma";
import { AssetsRepository, FoldersRepository } from "@cocrepo/repository";
import { ObjectStorageService } from "@cocrepo/service";
import { Test, type TestingModule } from "@nestjs/testing";
import { AssetAggregateRoot } from "../src/asset/asset.aggregate-root";

describe("AssetAggregateRoot", () => {
	let service: AssetAggregateRoot;
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
			spaceId: "space-123",
		} as SpaceContext;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AssetAggregateRoot,
				{ provide: AssetsRepository, useValue: mockAssetsRepository },
				{ provide: FoldersRepository, useValue: mockFoldersRepository },
				{
					provide: ObjectStorageService,
					useValue: mockObjectStorageService,
				},
				{ provide: SpaceContext, useValue: mockSpaceContext },
			],
		}).compile();

		service = module.get<AssetAggregateRoot>(AssetAggregateRoot);
	});

	it("FULL_ACCESS 목록 조회는 spaceId 필터 없이 전체 에셋을 요청해야 한다", async () => {
		mockAssetsRepository.findMany.mockResolvedValue({
			assets: [],
			totalCount: 0,
		} as never);

		await service.getAssets(createAssetQuery());

		const findManyInput = mockAssetsRepository.findMany.mock.calls[0][0];
		expect(findManyInput.where).not.toHaveProperty("spaceId");
	});

	it("일반 권한 목록 조회는 접근 가능한 spaceIds로 에셋을 제한해야 한다", async () => {
		(mockSpaceContext as SpaceContext & { spaceIds: string[] }).spaceIds = [
			"space-123",
			"space-parent",
		];
		mockAssetsRepository.findMany.mockResolvedValue({
			assets: [],
			totalCount: 0,
		} as never);

		await service.getAssets(createAssetQuery());

		const findManyInput = mockAssetsRepository.findMany.mock.calls[0][0];
		expect(findManyInput.where).toEqual(
			expect.objectContaining({
				spaceId: { in: ["space-123", "space-parent"] },
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
			id: "folder-123",
			spaceId: "space-123",
			removedAt: null,
		} as never);
		mockObjectStorageService.putObject.mockResolvedValue({
			key: "unused",
			publicUrl: null,
		});
		mockAssetsRepository.create.mockImplementation(
			async (data) =>
				({
					id: "asset-123",
					createdAt: new Date(),
					updatedAt: new Date(),
					removedAt: null,
					spaceId: data.spaceId,
					folderId: data.folderId,
					kind: data.kind,
					status: data.status,
					originalName: data.originalName,
					storageKey: data.storageKey,
					mimeType: data.mimeType,
					sizeBytes: data.sizeBytes as bigint,
					extension: data.extension as string | null,
					checksum: data.checksum as string | null,
					metadata: data.metadata ?? null,
					creatorId: data.creatorId as string | null,
				}) as never,
		);

		const result = await service.uploadAsset(
			{ folderId: "folder-123" },
			file,
			"user-123",
		);

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
		expect(putObjectInput.key).toMatch(
			/^spaces\/space-123\/assets\/image\/.+\.png$/,
		);
		expect(mockAssetsRepository.create).toHaveBeenCalledWith(
			expect.objectContaining({
				spaceId: "space-123",
				folderId: "folder-123",
				kind: AssetKind.IMAGE,
				status: AssetStatus.READY,
				originalName: "photo.png",
				storageKey: putObjectInput.key,
				mimeType: "image/png",
				sizeBytes: BigInt(11),
				extension: "png",
				checksum: expectedChecksum,
				creatorId: "user-123",
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
			id: "folder-123",
			spaceId: "space-123",
			removedAt: null,
		} as never);
		mockObjectStorageService.putObject.mockResolvedValue({
			key: "unused",
			publicUrl: null,
		});
		mockAssetsRepository.create.mockImplementation(
			async (data) =>
				({
					id: "asset-123",
					createdAt: new Date(),
					updatedAt: new Date(),
					removedAt: null,
					spaceId: data.spaceId,
					folderId: data.folderId,
					kind: data.kind,
					status: data.status,
					originalName: data.originalName,
					storageKey: data.storageKey,
					mimeType: data.mimeType,
					sizeBytes: data.sizeBytes as bigint,
					extension: data.extension as string | null,
					checksum: data.checksum as string | null,
					metadata: data.metadata ?? null,
					creatorId: data.creatorId as string | null,
				}) as never,
		);

		const result = await service.uploadAsset(
			{ folderId: "folder-123" },
			file,
			"user-123",
		);

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
			id: "asset-123",
			createdAt: new Date(),
			updatedAt: new Date(),
			removedAt: null,
			spaceId: "space-123",
			folderId: "folder-123",
			kind: AssetKind.IMAGE,
			status: AssetStatus.READY,
			originalName: "photo.png",
			storageKey: "spaces/space-123/assets/image/file.png",
			mimeType: "image/png",
			sizeBytes: BigInt(11),
			extension: "png",
			checksum: "checksum",
			metadata: null,
			creatorId: "user-123",
		} as never);
		mockObjectStorageService.deleteObject.mockResolvedValue(undefined);
		mockAssetsRepository.deleteById.mockResolvedValue({} as never);

		await service.deleteAsset("asset-123");

		expect(mockObjectStorageService.deleteObject).toHaveBeenCalledWith(
			"spaces/space-123/assets/image/file.png",
		);
		expect(mockAssetsRepository.deleteById).toHaveBeenCalledWith("asset-123");
		expect(
			mockObjectStorageService.deleteObject.mock.invocationCallOrder[0],
		).toBeLessThan(mockAssetsRepository.deleteById.mock.invocationCallOrder[0]);
	});

	it("상세 원본 조회 시 현재 space의 object content를 반환해야 한다", async () => {
		mockAssetsRepository.findByIdWithRelations.mockResolvedValue({
			id: "asset-123",
			createdAt: new Date(),
			updatedAt: new Date(),
			removedAt: null,
			spaceId: "space-123",
			folderId: "folder-123",
			kind: AssetKind.DOCUMENT,
			status: AssetStatus.READY,
			originalName: "guide.pdf",
			storageKey: "spaces/space-123/assets/document/file.pdf",
			mimeType: "application/pdf",
			sizeBytes: BigInt(11),
			extension: "pdf",
			checksum: "checksum",
			metadata: null,
			creatorId: "user-123",
		} as never);
		mockObjectStorageService.getObject.mockResolvedValue({
			body: Buffer.from("pdf-body"),
			contentType: "application/pdf",
			contentLength: 8,
			etag: '"etag-123"',
			lastModified: new Date("2026-04-05T06:00:00.000Z"),
		});

		const result = await service.getAssetContent("asset-123");

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
			id: "asset-123",
			createdAt: new Date(),
			updatedAt: new Date(),
			removedAt: null,
			spaceId: "space-123",
			folderId: "folder-123",
			kind: AssetKind.IMAGE,
			status: AssetStatus.READY,
			originalName: "photo.png",
			storageKey: "spaces/space-123/assets/image/file.png",
			mimeType: "image/png",
			sizeBytes: BigInt(11),
			extension: "png",
			checksum: "checksum",
			metadata: null,
			creatorId: "user-123",
		} as never);
		mockObjectStorageService.deleteObject.mockRejectedValue(
			new Error("storage delete failed"),
		);

		await expect(service.deleteAsset("asset-123")).rejects.toThrow(
			"storage delete failed",
		);
		expect(mockAssetsRepository.deleteById).not.toHaveBeenCalled();
	});
});

function createAssetQuery(): Parameters<AssetAggregateRoot["getAssets"]>[0] {
	return {
		toPrismaWhere: (baseWhere = {}) => ({
			...baseWhere,
			removedAt: null,
		}),
		toPrismaOrderBy: () => [],
		sort: [],
		skip: 0,
		take: 20,
	} as Parameters<AssetAggregateRoot["getAssets"]>[0];
}
