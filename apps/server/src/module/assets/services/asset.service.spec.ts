import { CONTEXT_KEYS } from "@cocrepo/constant";
import { Asset } from "@cocrepo/entity";
import type { AssetKind, AssetStatus } from "@cocrepo/prisma";
import {
	BadRequestException,
	NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ClsService } from "nestjs-cls";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { AssetRepository } from "../repositories/asset.repository";
import { AssetService } from "./asset.service";

// Prisma 타입 대신 로컬 타입 정의
type AssetUncheckedCreateInput = {
	spaceId: string;
	folderId: string;
	kind: AssetKind;
	status: AssetStatus;
	originalName: string;
	storageKey: string;
	mimeType: string;
	sizeBytes: bigint;
	extension?: string | null;
	checksum?: string | null;
	metadata?: any;
	creatorId?: string | null;
};

type AssetUncheckedUpdateInput = {
	originalName?: string;
	status?: AssetStatus;
	folderId?: string;
};

/**
 * 테스트용 Asset 엔티티 생성
 */
const createTestAsset = (overrides: Partial<Asset> = {}): Asset => {
	const asset = new Asset();
	Object.assign(asset, {
		id: "asset-test-id",
		spaceId: "space-test-id",
		folderId: "folder-test-id",
		kind: "IMAGE",
		status: "READY",
		originalName: "test-image.jpg",
		storageKey: "spaces/space-test-id/assets/test-image.jpg",
		mimeType: "image/jpeg",
		sizeBytes: BigInt(1024 * 1024),
		extension: ".jpg",
		checksum: "abc123",
		metadata: null,
		creatorId: null,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		removedAt: null,
		...overrides,
	});
	return asset;
};

/**
 * 테스트용 Tenant 생성 (ROOT 카테고리)
 */
const createTestTenantWithRootCategory = () => ({
	id: "tenant-test-id",
	spaceId: "space-test-id",
	roleId: "role-test-id",
	space: {
		id: "space-test-id",
		name: "Test Space",
		spaceClassification: {
			category: {
				name: "ROOT",
			},
		},
	},
});

/**
 * 테스트용 Tenant 생성 (일반 카테고리)
 */
const createTestTenantWithNormalCategory = () => ({
	id: "tenant-test-id",
	spaceId: "space-test-id",
	roleId: "role-test-id",
	space: {
		id: "space-test-id",
		name: "Test Space",
		spaceClassification: {
			category: {
				name: "NORMAL",
			},
		},
	},
});

/**
 * 테스트용 AssetQueryDto 생성 (Prisma 의존성 제거)
 */
const createTestAssetQueryDto = (overrides: Record<string, any> = {}) => {
	return {
		skip: 0,
		take: 10,
		spaceId: undefined,
		folderId: undefined,
		kind: undefined,
		status: undefined,
		search: undefined,
		statusFilter: undefined,
		sort: undefined,
		toPrismaWhere: jest.fn((baseWhere?: any) => ({
			...baseWhere,
			removedAt: null,
		})),
		toPrismaOrderBy: jest.fn(() => [{ createdAt: "desc" }]),
		...overrides,
	};
};

describe("AssetService", () => {
	let service: AssetService;
	let mockRepository: DeepMockProxy<AssetRepository>;
	let mockCls: DeepMockProxy<ClsService>;

	const testSpaceId = "space-test-id";
	const testAssetId = "asset-test-id";

	beforeEach(async () => {
		mockRepository = mockDeep<AssetRepository>();
		mockCls = mockDeep<ClsService>();

		// 기본적으로 Space ID 설정
		mockCls.get.calledWith(CONTEXT_KEYS.SPACE_ID).mockReturnValue(testSpaceId);
		mockCls.get.calledWith(CONTEXT_KEYS.TENANT).mockReturnValue(createTestTenantWithNormalCategory() as any);

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AssetService,
				{ provide: AssetRepository, useValue: mockRepository },
				{ provide: ClsService, useValue: mockCls },
			],
		}).compile();

		service = module.get<AssetService>(AssetService);
	});

	afterEach(() => {
		mockReset(mockRepository);
		mockReset(mockCls);
	});

	describe("getAssetsBySpace", () => {
		it("Space 내 에셋 목록을 조회해야 한다", async () => {
			// Given
			const query = createTestAssetQueryDto({ skip: 0, take: 10 });

			const mockAssets = [
				createTestAsset({ id: "asset-1" }),
				createTestAsset({ id: "asset-2" }),
			];

			mockRepository.findManyBySpaceId.mockResolvedValue({
				items: mockAssets,
				count: 2,
			});
			mockRepository.countBySpaceId.mockResolvedValue(2);

			// When
			const result = await service.getAssetsBySpace(query as any);

			// Then
			expect(mockRepository.findManyBySpaceId).toHaveBeenCalledWith(
				expect.objectContaining({
					spaceId: testSpaceId,
					skip: 0,
					take: 10,
				}),
			);
			expect(result.assets).toHaveLength(2);
			expect(result.totalCount).toBe(2);
			expect(result.stats).toBeDefined();
		});

		it("전체 접근 권한이 있고 query에 spaceId가 있으면 해당 spaceId를 사용해야 한다", async () => {
			// Given
			const query = createTestAssetQueryDto({
				spaceId: "other-space-id",
				skip: 0,
				take: 10,
			});

			// ROOT 카테고리로 설정 (전체 접근 권한)
			mockCls.get.calledWith(CONTEXT_KEYS.SPACE_ID).mockReturnValue(testSpaceId);
			mockCls.get.calledWith(CONTEXT_KEYS.TENANT).mockReturnValue(createTestTenantWithRootCategory() as any);

			mockRepository.findManyBySpaceId.mockResolvedValue({
				items: [],
				count: 0,
			});
			mockRepository.countBySpaceId.mockResolvedValue(0);

			// When
			await service.getAssetsBySpace(query as any);

			// Then
			expect(mockRepository.findManyBySpaceId).toHaveBeenCalledWith(
				expect.objectContaining({
					spaceId: "other-space-id",
				}),
			);
		});

		it("Space가 선택되지 않으면 BadRequestException을 던져야 한다", async () => {
			// Given
			mockCls.get.calledWith(CONTEXT_KEYS.SPACE_ID).mockReturnValue(undefined);

			const query = createTestAssetQueryDto();

			// When & Then
			await expect(service.getAssetsBySpace(query as any)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe("getAssetDetailById", () => {
		it("에셋 상세 정보를 조회해야 한다", async () => {
			// Given
			const mockAsset = createTestAsset({
				id: testAssetId,
				image: { width: 1920, height: 1080 } as any,
			});
			mockRepository.findByIdWithDetails.mockResolvedValue(mockAsset);

			// When
			const result = await service.getAssetDetailById(testAssetId);

			// Then
			expect(mockRepository.findByIdWithDetails).toHaveBeenCalledWith(
				testAssetId,
			);
			expect(result).toEqual(mockAsset);
		});

		it("존재하지 않는 에셋은 NotFoundException을 던져야 한다", async () => {
			// Given
			mockRepository.findByIdWithDetails.mockResolvedValue(null);

			// When & Then
			await expect(service.getAssetDetailById("non-existent")).rejects.toThrow(
				NotFoundException,
			);
		});

		it("다른 Space의 에셋은 NotFoundException을 던져야 한다", async () => {
			// Given
			const otherSpaceAsset = createTestAsset({
				id: testAssetId,
				spaceId: "other-space-id",
			});
			mockRepository.findByIdWithDetails.mockResolvedValue(otherSpaceAsset);

			// When & Then
			await expect(service.getAssetDetailById(testAssetId)).rejects.toThrow(
				NotFoundException,
			);
		});

		it("전체 접근 권한이 있으면 다른 Space의 에셋도 조회할 수 있다", async () => {
			// Given
			mockCls.get.calledWith(CONTEXT_KEYS.TENANT).mockReturnValue(createTestTenantWithRootCategory() as any);

			const otherSpaceAsset = createTestAsset({
				id: testAssetId,
				spaceId: "other-space-id",
			});
			mockRepository.findByIdWithDetails.mockResolvedValue(otherSpaceAsset);

			// When
			const result = await service.getAssetDetailById(testAssetId);

			// Then
			expect(result).toEqual(otherSpaceAsset);
		});
	});

	describe("createAsset", () => {
		it("에셋을 생성해야 한다", async () => {
			// Given
			const createData: AssetUncheckedCreateInput = {
				folderId: "folder-test-id",
				kind: "IMAGE",
				status: "READY",
				originalName: "test.jpg",
				storageKey: "test.jpg",
				mimeType: "image/jpeg",
				sizeBytes: BigInt(1024),
				spaceId: testSpaceId,
			};

			const mockAsset = createTestAsset(createData as any);
			mockRepository.create.mockResolvedValue(mockAsset);

			// When
			const result = await service.createAsset(createData as any);

			// Then
			expect(mockRepository.create).toHaveBeenCalledWith(
				expect.objectContaining({
					...createData,
					spaceId: testSpaceId,
				}),
			);
			expect(result).toEqual(mockAsset);
		});

		it("Space가 선택되지 않으면 BadRequestException을 던져야 한다", async () => {
			// Given
			mockCls.get.calledWith(CONTEXT_KEYS.SPACE_ID).mockReturnValue(undefined);

			// When & Then
			await expect(service.createAsset({} as any)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe("updateAsset", () => {
		it("에셋을 수정해야 한다", async () => {
			// Given
			const existingAsset = createTestAsset({ id: testAssetId });
			const updateData = { originalName: "updated-name.jpg" };
			const updatedAsset = createTestAsset({
				id: testAssetId,
				originalName: "updated-name.jpg",
			});

			mockRepository.findById.mockResolvedValue(existingAsset);
			mockRepository.updateById.mockResolvedValue(updatedAsset);

			// When
			const result = await service.updateAsset(testAssetId, updateData);

			// Then
			expect(mockRepository.findById).toHaveBeenCalledWith(testAssetId);
			expect(mockRepository.updateById).toHaveBeenCalledWith(
				testAssetId,
				updateData,
			);
			expect(result.originalName).toBe("updated-name.jpg");
		});

		it("존재하지 않는 에셋은 NotFoundException을 던져야 한다", async () => {
			// Given
			mockRepository.findById.mockResolvedValue(null);

			// When & Then
			await expect(
				service.updateAsset("non-existent", { originalName: "test" }),
			).rejects.toThrow(NotFoundException);
		});

		it("다른 Space의 에셋은 NotFoundException을 던져야 한다", async () => {
			// Given
			const otherSpaceAsset = createTestAsset({
				id: testAssetId,
				spaceId: "other-space-id",
			});
			mockRepository.findById.mockResolvedValue(otherSpaceAsset);

			// When & Then
			await expect(
				service.updateAsset(testAssetId, { originalName: "test" }),
			).rejects.toThrow(NotFoundException);
		});
	});

	describe("deleteAsset", () => {
		it("에셋을 소프트 삭제해야 한다", async () => {
			// Given
			const existingAsset = createTestAsset({ id: testAssetId });
			const deletedAsset = createTestAsset({
				id: testAssetId,
				removedAt: new Date(),
			});

			mockRepository.findById.mockResolvedValue(existingAsset);
			mockRepository.removeById.mockResolvedValue(deletedAsset);

			// When
			const result = await service.deleteAsset(testAssetId);

			// Then
			expect(mockRepository.removeById).toHaveBeenCalledWith(testAssetId);
			expect(result.removedAt).toBeDefined();
		});

		it("존재하지 않는 에셋은 NotFoundException을 던져야 한다", async () => {
			// Given
			mockRepository.findById.mockResolvedValue(null);

			// When & Then
			await expect(service.deleteAsset("non-existent")).rejects.toThrow(
				NotFoundException,
			);
		});

		it("다른 Space의 에셋은 NotFoundException을 던져야 한다", async () => {
			// Given
			const otherSpaceAsset = createTestAsset({
				id: testAssetId,
				spaceId: "other-space-id",
			});
			mockRepository.findById.mockResolvedValue(otherSpaceAsset);

			// When & Then
			await expect(service.deleteAsset(testAssetId)).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe("moveAsset", () => {
		it("에셋을 다른 폴더로 이동해야 한다", async () => {
			// Given
			const existingAsset = createTestAsset({
				id: testAssetId,
				folderId: "old-folder-id",
			});
			const targetFolderId = "new-folder-id";
			const movedAsset = createTestAsset({
				id: testAssetId,
				folderId: targetFolderId,
			});

			mockRepository.findById.mockResolvedValue(existingAsset);
			mockRepository.moveById.mockResolvedValue(movedAsset);

			// When
			const result = await service.moveAsset(testAssetId, targetFolderId);

			// Then
			expect(mockRepository.moveById).toHaveBeenCalledWith(
				testAssetId,
				targetFolderId,
			);
			expect(result.folderId).toBe(targetFolderId);
		});

		it("존재하지 않는 에셋은 NotFoundException을 던져야 한다", async () => {
			// Given
			mockRepository.findById.mockResolvedValue(null);

			// When & Then
			await expect(
				service.moveAsset("non-existent", "folder-id"),
			).rejects.toThrow(NotFoundException);
		});

		it("다른 Space의 에셋은 NotFoundException을 던져야 한다", async () => {
			// Given
			const otherSpaceAsset = createTestAsset({
				id: testAssetId,
				spaceId: "other-space-id",
			});
			mockRepository.findById.mockResolvedValue(otherSpaceAsset);

			// When & Then
			await expect(
				service.moveAsset(testAssetId, "new-folder-id"),
			).rejects.toThrow(NotFoundException);
		});
	});

	describe("restoreAsset", () => {
		it("전체 접근 권한이 있으면 에셋을 복원할 수 있다", async () => {
			// Given
			mockCls.get.calledWith(CONTEXT_KEYS.TENANT).mockReturnValue(createTestTenantWithRootCategory() as any);

			const restoredAsset = createTestAsset({
				id: testAssetId,
				removedAt: null,
			});
			mockRepository.restoreById.mockResolvedValue(restoredAsset);

			// When
			const result = await service.restoreAsset(testAssetId);

			// Then
			expect(mockRepository.restoreById).toHaveBeenCalledWith(testAssetId);
			expect(result.removedAt).toBeNull();
		});

		it("전체 접근 권한이 없으면 BadRequestException을 던져야 한다", async () => {
			// When & Then
			await expect(service.restoreAsset(testAssetId)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe("batchSoftDelete", () => {
		it("여러 에셋을 일괄 삭제해야 한다", async () => {
			// Given
			const assetIds = ["asset-1", "asset-2"];
			const assets = [
				createTestAsset({ id: "asset-1" }),
				createTestAsset({ id: "asset-2" }),
			];

			mockRepository.findByIds.mockResolvedValue(assets);
			mockRepository.removeById.mockResolvedValue(assets[0]);

			// When
			const result = await service.batchSoftDelete(assetIds);

			// Then
			expect(mockRepository.findByIds).toHaveBeenCalledWith(assetIds);
			expect(result).toBe(2);
		});

		it("다른 Space의 에셋이 포함되면 BadRequestException을 던져야 한다", async () => {
			// Given
			const assetIds = ["asset-1", "asset-2"];
			const assets = [
				createTestAsset({ id: "asset-1" }),
				createTestAsset({ id: "asset-2", spaceId: "other-space-id" }),
			];

			mockRepository.findByIds.mockResolvedValue(assets);

			// When & Then
			await expect(service.batchSoftDelete(assetIds)).rejects.toThrow(
				BadRequestException,
			);
		});

		it("전체 접근 권한이 있으면 다른 Space의 에셋도 삭제할 수 있다", async () => {
			// Given
			mockCls.get.calledWith(CONTEXT_KEYS.TENANT).mockReturnValue(createTestTenantWithRootCategory() as any);

			const assetIds = ["asset-1", "asset-2"];
			const assets = [
				createTestAsset({ id: "asset-1" }),
				createTestAsset({ id: "asset-2", spaceId: "other-space-id" }),
			];

			mockRepository.findByIds.mockResolvedValue(assets);
			mockRepository.removeById.mockResolvedValue(assets[0]);

			// When
			const result = await service.batchSoftDelete(assetIds);

			// Then
			expect(result).toBe(2);
		});
	});
});
