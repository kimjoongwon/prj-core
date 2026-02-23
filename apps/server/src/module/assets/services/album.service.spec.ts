import { CONTEXT_KEYS } from "@cocrepo/constant";
import { Album, AlbumEntry } from "@cocrepo/entity";
import {
	BadRequestException,
	NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ClsService } from "nestjs-cls";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { AlbumRepository } from "../repositories/album.repository";
import { AlbumService } from "./album.service";

// 로컬 타입 정의 (Prisma 의존성 제거)
type AlbumUncheckedCreateInput = {
	spaceId: string;
	name: string;
	description?: string | null;
	sortOrder?: number;
	coverAssetId?: string | null;
	creatorId?: string | null;
};

type AlbumUncheckedUpdateInput = {
	name?: string;
	description?: string | null;
	sortOrder?: number;
	coverAssetId?: string | null;
};

/**
 * 테스트용 Album 엔티티 생성
 */
const createTestAlbum = (overrides: Partial<Album> = {}): Album => {
	const album = new Album();
	Object.assign(album, {
		id: "album-test-id",
		spaceId: "space-test-id",
		name: "Test Album",
		description: "Test album description",
		sortOrder: 0,
		coverAssetId: null,
		creatorId: null,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		removedAt: null,
		entries: [],
		...overrides,
	});
	return album;
};

/**
 * 테스트용 AlbumEntry 엔티티 생성
 */
const createTestAlbumEntry = (
	overrides: Partial<AlbumEntry> = {},
): AlbumEntry => {
	const entry = new AlbumEntry();
	Object.assign(entry, {
		albumId: "album-test-id",
		assetId: "asset-test-id",
		spaceId: "space-test-id",
		position: 0,
		caption: null,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		removedAt: null,
		...overrides,
	});
	return entry;
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
 * 테스트용 AlbumQueryDto 생성 (Prisma 의존성 제거)
 */
const createTestAlbumQueryDto = (overrides: Record<string, any> = {}) => {
	return {
		skip: 0,
		take: 10,
		spaceId: undefined,
		search: undefined,
		sort: undefined,
		toPrismaWhere: jest.fn((baseWhere?: any) => ({
			...baseWhere,
			removedAt: null,
		})),
		toPrismaOrderBy: jest.fn(() => [{ sortOrder: "asc" }]),
		...overrides,
	};
};

describe("AlbumService", () => {
	let service: AlbumService;
	let mockRepository: DeepMockProxy<AlbumRepository>;
	let mockCls: DeepMockProxy<ClsService>;

	const testSpaceId = "space-test-id";
	const testAlbumId = "album-test-id";
	const testAssetId = "asset-test-id";

	beforeEach(async () => {
		mockRepository = mockDeep<AlbumRepository>();
		mockCls = mockDeep<ClsService>();

		// 기본적으로 Space ID 설정
		mockCls.get.calledWith(CONTEXT_KEYS.SPACE_ID).mockReturnValue(testSpaceId);
		mockCls.get.calledWith(CONTEXT_KEYS.TENANT).mockReturnValue(createTestTenantWithNormalCategory() as any);

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AlbumService,
				{ provide: AlbumRepository, useValue: mockRepository },
				{ provide: ClsService, useValue: mockCls },
			],
		}).compile();

		service = module.get<AlbumService>(AlbumService);
	});

	afterEach(() => {
		mockReset(mockRepository);
		mockReset(mockCls);
	});

	describe("getAlbumsBySpace", () => {
		it("Space 내 앨범 목록을 조회해야 한다", async () => {
			// Given
			const query = createTestAlbumQueryDto({ skip: 0, take: 10 });

			const mockAlbums = [
				createTestAlbum({ id: "album-1" }),
				createTestAlbum({ id: "album-2" }),
			];

			mockRepository.findManyBySpaceId.mockResolvedValue({
				items: mockAlbums,
				count: 2,
			});

			// When
			const result = await service.getAlbumsBySpace(query as any);

			// Then
			expect(mockRepository.findManyBySpaceId).toHaveBeenCalledWith(
				expect.objectContaining({
					spaceId: testSpaceId,
					skip: 0,
					take: 10,
				}),
			);
			expect(result.albums).toHaveLength(2);
			expect(result.totalCount).toBe(2);
		});

		it("전체 접근 권한이 있고 query에 spaceId가 있으면 해당 spaceId를 사용해야 한다", async () => {
			// Given
			const query = createTestAlbumQueryDto({
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

			// When
			await service.getAlbumsBySpace(query as any);

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

			const query = createTestAlbumQueryDto();

			// When & Then
			await expect(service.getAlbumsBySpace(query as any)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe("getAlbumDetailById", () => {
		it("앨범 상세 정보를 조회해야 한다", async () => {
			// Given
			const mockAlbum = createTestAlbum({
				id: testAlbumId,
				entries: [createTestAlbumEntry({ albumId: testAlbumId })],
			});
			mockRepository.findById.mockResolvedValue(mockAlbum);
			mockRepository.findByIdWithEntries.mockResolvedValue(mockAlbum);

			// When
			const result = await service.getAlbumDetailById(testAlbumId);

			// Then
			expect(mockRepository.findByIdWithEntries).toHaveBeenCalledWith(
				testAlbumId,
			);
			expect(result).toEqual(mockAlbum);
		});

		it("존재하지 않는 앨범은 NotFoundException을 던져야 한다", async () => {
			// Given
			mockRepository.findById.mockResolvedValue(null);

			// When & Then
			await expect(service.getAlbumDetailById("non-existent")).rejects.toThrow(
				NotFoundException,
			);
		});

		it("다른 Space의 앨범은 NotFoundException을 던져야 한다", async () => {
			// Given
			const otherSpaceAlbum = createTestAlbum({
				id: testAlbumId,
				spaceId: "other-space-id",
			});
			mockRepository.findById.mockResolvedValue(otherSpaceAlbum);

			// When & Then
			await expect(service.getAlbumDetailById(testAlbumId)).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe("createAlbum", () => {
		it("앨범을 생성해야 한다", async () => {
			// Given
			const createData: AlbumUncheckedCreateInput = {
				name: "New Album",
				description: "New album description",
				spaceId: testSpaceId,
				sortOrder: 0,
			};

			mockRepository.countBySpaceId.mockResolvedValue(0);
			mockRepository.create.mockImplementation(
				async (data) => createTestAlbum({ ...(data as any) }),
			);

			// When
			const result = await service.createAlbum(createData as any);

			// Then
			expect(mockRepository.create).toHaveBeenCalledWith(
				expect.objectContaining({
					name: "New Album",
					description: "New album description",
					spaceId: testSpaceId,
					sortOrder: 0,
				}),
			);
			expect(result.name).toBe("New Album");
		});

		it("sortOrder를 지정하지 않으면 마지막 순서 + 1로 설정해야 한다", async () => {
			// Given
			const createData: AlbumUncheckedCreateInput = {
				name: "New Album",
				spaceId: testSpaceId,
			};

			mockRepository.countBySpaceId.mockResolvedValue(5);
			mockRepository.create.mockImplementation(
				async (data) => createTestAlbum({ ...(data as any) }),
			);

			// When
			await service.createAlbum(createData as any);

			// Then
			expect(mockRepository.create).toHaveBeenCalledWith(
				expect.objectContaining({
					sortOrder: 5,
				}),
			);
		});

		it("Space가 선택되지 않으면 BadRequestException을 던져야 한다", async () => {
			// Given
			mockCls.get.calledWith(CONTEXT_KEYS.SPACE_ID).mockReturnValue(undefined);

			// When & Then
			await expect(
				service.createAlbum({ name: "Test", spaceId: testSpaceId } as any),
			).rejects.toThrow(BadRequestException);
		});
	});

	describe("updateAlbum", () => {
		it("앨범을 수정해야 한다", async () => {
			// Given
			const existingAlbum = createTestAlbum({ id: testAlbumId });
			const updateData: AlbumUncheckedUpdateInput = {
				name: "Updated Album",
			};
			const updatedAlbum = createTestAlbum({
				id: testAlbumId,
				name: "Updated Album",
			});

			mockRepository.findById.mockResolvedValue(existingAlbum);
			mockRepository.updateById.mockResolvedValue(updatedAlbum);

			// When
			const result = await service.updateAlbum(testAlbumId, updateData);

			// Then
			expect(mockRepository.updateById).toHaveBeenCalledWith(
				testAlbumId,
				updateData,
			);
			expect(result.name).toBe("Updated Album");
		});

		it("존재하지 않는 앨범은 NotFoundException을 던져야 한다", async () => {
			// Given
			mockRepository.findById.mockResolvedValue(null);

			// When & Then
			await expect(
				service.updateAlbum("non-existent", { name: "Test" }),
			).rejects.toThrow(NotFoundException);
		});

		it("다른 Space의 앨범은 NotFoundException을 던져야 한다", async () => {
			// Given
			const otherSpaceAlbum = createTestAlbum({
				id: testAlbumId,
				spaceId: "other-space-id",
			});
			mockRepository.findById.mockResolvedValue(otherSpaceAlbum);

			// When & Then
			await expect(
				service.updateAlbum(testAlbumId, { name: "Test" }),
			).rejects.toThrow(NotFoundException);
		});
	});

	describe("deleteAlbum", () => {
		it("앨범을 소프트 삭제해야 한다", async () => {
			// Given
			const existingAlbum = createTestAlbum({ id: testAlbumId });
			const deletedAlbum = createTestAlbum({
				id: testAlbumId,
				removedAt: new Date(),
			});

			mockRepository.findById.mockResolvedValue(existingAlbum);
			mockRepository.removeById.mockResolvedValue(deletedAlbum);

			// When
			const result = await service.deleteAlbum(testAlbumId);

			// Then
			expect(mockRepository.removeById).toHaveBeenCalledWith(testAlbumId);
			expect(result.removedAt).toBeDefined();
		});

		it("존재하지 않는 앨범은 NotFoundException을 던져야 한다", async () => {
			// Given
			mockRepository.findById.mockResolvedValue(null);

			// When & Then
			await expect(service.deleteAlbum("non-existent")).rejects.toThrow(
				NotFoundException,
			);
		});

		it("다른 Space의 앨범은 NotFoundException을 던져야 한다", async () => {
			// Given
			const otherSpaceAlbum = createTestAlbum({
				id: testAlbumId,
				spaceId: "other-space-id",
			});
			mockRepository.findById.mockResolvedValue(otherSpaceAlbum);

			// When & Then
			await expect(service.deleteAlbum(testAlbumId)).rejects.toThrow(
				NotFoundException,
			);
		});
	});

	describe("restoreAlbum", () => {
		it("전체 접근 권한이 있으면 앨범을 복원할 수 있다", async () => {
			// Given
			mockCls.get.calledWith(CONTEXT_KEYS.TENANT).mockReturnValue(createTestTenantWithRootCategory() as any);

			const restoredAlbum = createTestAlbum({
				id: testAlbumId,
				removedAt: null,
			});
			mockRepository.restoreById.mockResolvedValue(restoredAlbum);

			// When
			const result = await service.restoreAlbum(testAlbumId);

			// Then
			expect(mockRepository.restoreById).toHaveBeenCalledWith(testAlbumId);
			expect(result.removedAt).toBeNull();
		});

		it("전체 접근 권한이 없으면 BadRequestException을 던져야 한다", async () => {
			// When & Then
			await expect(service.restoreAlbum(testAlbumId)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe("addAssetToAlbum", () => {
		it("앨범에 에셋을 추가해야 한다", async () => {
			// Given
			const mockAlbum = createTestAlbum({ id: testAlbumId });
			const mockEntry = createTestAlbumEntry({
				albumId: testAlbumId,
				assetId: testAssetId,
			});

			mockRepository.findById.mockResolvedValue(mockAlbum);
			mockRepository.findEntryByAlbumIdAndAssetId.mockResolvedValue(null);
			mockRepository.findNextPosition.mockResolvedValue(0);
			mockRepository.addEntry.mockResolvedValue(mockEntry);

			// When
			const result = await service.addAssetToAlbum(testAlbumId, testAssetId);

			// Then
			expect(mockRepository.addEntry).toHaveBeenCalledWith(
				expect.objectContaining({
					albumId: testAlbumId,
					assetId: testAssetId,
					position: 0,
				}),
			);
			expect(result.albumId).toBe(testAlbumId);
			expect(result.assetId).toBe(testAssetId);
		});

		it("캡션과 함께 에셋을 추가할 수 있다", async () => {
			// Given
			const mockAlbum = createTestAlbum({ id: testAlbumId });
			const mockEntry = createTestAlbumEntry({
				albumId: testAlbumId,
				assetId: testAssetId,
				caption: "Test caption",
			});

			mockRepository.findById.mockResolvedValue(mockAlbum);
			mockRepository.findEntryByAlbumIdAndAssetId.mockResolvedValue(null);
			mockRepository.findNextPosition.mockResolvedValue(0);
			mockRepository.addEntry.mockResolvedValue(mockEntry);

			// When
			const result = await service.addAssetToAlbum(
				testAlbumId,
				testAssetId,
				"Test caption",
			);

			// Then
			expect(mockRepository.addEntry).toHaveBeenCalledWith(
				expect.objectContaining({
					caption: "Test caption",
				}),
			);
		});

		it("이미 추가된 에셋이면 BadRequestException을 던져야 한다", async () => {
			// Given
			const mockAlbum = createTestAlbum({ id: testAlbumId });
			const existingEntry = createTestAlbumEntry({
				albumId: testAlbumId,
				assetId: testAssetId,
			});

			mockRepository.findById.mockResolvedValue(mockAlbum);
			mockRepository.findEntryByAlbumIdAndAssetId.mockResolvedValue(
				existingEntry,
			);

			// When & Then
			await expect(
				service.addAssetToAlbum(testAlbumId, testAssetId),
			).rejects.toThrow(BadRequestException);
		});

		it("다른 Space의 앨범이면 NotFoundException을 던져야 한다", async () => {
			// Given
			const otherSpaceAlbum = createTestAlbum({
				id: testAlbumId,
				spaceId: "other-space-id",
			});
			mockRepository.findById.mockResolvedValue(otherSpaceAlbum);

			// When & Then
			await expect(
				service.addAssetToAlbum(testAlbumId, testAssetId),
			).rejects.toThrow(NotFoundException);
		});
	});

	describe("removeAssetFromAlbum", () => {
		it("앨범에서 에셋을 제거해야 한다", async () => {
			// Given
			const mockAlbum = createTestAlbum({ id: testAlbumId });
			const mockEntry = createTestAlbumEntry({
				albumId: testAlbumId,
				assetId: testAssetId,
			});

			mockRepository.findById.mockResolvedValue(mockAlbum);
			mockRepository.findEntryByAlbumIdAndAssetId.mockResolvedValue(mockEntry);
			mockRepository.removeEntry.mockResolvedValue(mockEntry);

			// When
			const result = await service.removeAssetFromAlbum(
				testAlbumId,
				testAssetId,
			);

			// Then
			expect(mockRepository.removeEntry).toHaveBeenCalledWith(
				testAlbumId,
				testAssetId,
			);
			expect(result).toEqual(mockEntry);
		});

		it("앨범에 없는 에셋이면 NotFoundException을 던져야 한다", async () => {
			// Given
			const mockAlbum = createTestAlbum({ id: testAlbumId });

			mockRepository.findById.mockResolvedValue(mockAlbum);
			mockRepository.findEntryByAlbumIdAndAssetId.mockResolvedValue(null);

			// When & Then
			await expect(
				service.removeAssetFromAlbum(testAlbumId, testAssetId),
			).rejects.toThrow(NotFoundException);
		});
	});

	describe("getAlbumEntries", () => {
		it("앨범 엔트리 목록을 조회해야 한다", async () => {
			// Given
			const mockAlbum = createTestAlbum({ id: testAlbumId });
			const mockEntries = [
				createTestAlbumEntry({ albumId: testAlbumId, position: 0 }),
				createTestAlbumEntry({ albumId: testAlbumId, position: 1 }),
			];

			mockRepository.findById.mockResolvedValue(mockAlbum);
			mockRepository.findEntriesByAlbumId.mockResolvedValue(mockEntries);

			// When
			const result = await service.getAlbumEntries(testAlbumId);

			// Then
			expect(mockRepository.findEntriesByAlbumId).toHaveBeenCalledWith(
				testAlbumId,
			);
			expect(result).toHaveLength(2);
		});
	});

	describe("countAlbumEntries", () => {
		it("앨범 엔트리 수를 조회해야 한다", async () => {
			// Given
			const mockAlbum = createTestAlbum({ id: testAlbumId });
			mockRepository.findById.mockResolvedValue(mockAlbum);
			mockRepository.countEntriesByAlbumId.mockResolvedValue(5);

			// When
			const result = await service.countAlbumEntries(testAlbumId);

			// Then
			expect(mockRepository.countEntriesByAlbumId).toHaveBeenCalledWith(
				testAlbumId,
			);
			expect(result).toBe(5);
		});
	});

	describe("setCoverImage", () => {
		it("커버 이미지를 설정해야 한다", async () => {
			// Given
			const mockAlbum = createTestAlbum({ id: testAlbumId });
			const updatedAlbum = createTestAlbum({
				id: testAlbumId,
				coverAssetId: testAssetId,
			});

			mockRepository.findById.mockResolvedValue(mockAlbum);
			mockRepository.updateById.mockResolvedValue(updatedAlbum);

			// When
			const result = await service.setCoverImage(testAlbumId, testAssetId);

			// Then
			expect(mockRepository.updateById).toHaveBeenCalledWith(testAlbumId, {
				coverAssetId: testAssetId,
			});
			expect(result.coverAssetId).toBe(testAssetId);
		});
	});

	describe("removeCoverImage", () => {
		it("커버 이미지를 제거해야 한다", async () => {
			// Given
			const mockAlbum = createTestAlbum({
				id: testAlbumId,
				coverAssetId: testAssetId,
			});
			const updatedAlbum = createTestAlbum({
				id: testAlbumId,
				coverAssetId: null,
			});

			mockRepository.findById.mockResolvedValue(mockAlbum);
			mockRepository.updateById.mockResolvedValue(updatedAlbum);

			// When
			const result = await service.removeCoverImage(testAlbumId);

			// Then
			expect(mockRepository.updateById).toHaveBeenCalledWith(testAlbumId, {
				coverAssetId: null,
			});
			expect(result.coverAssetId).toBeNull();
		});
	});

	describe("reorderAlbumEntries", () => {
		it("앨범 엔트리 순서를 변경해야 한다", async () => {
			// Given
			const mockAlbum = createTestAlbum({ id: testAlbumId });
			const entryPositions = [
				{ assetId: "asset-1", position: 0 },
				{ assetId: "asset-2", position: 1 },
			];

			mockRepository.findById.mockResolvedValue(mockAlbum);
			mockRepository.reorderEntries.mockResolvedValue(2);

			// When
			const result = await service.reorderAlbumEntries(
				testAlbumId,
				entryPositions,
			);

			// Then
			expect(mockRepository.reorderEntries).toHaveBeenCalledWith(
				testAlbumId,
				entryPositions,
			);
			expect(result).toBe(2);
		});
	});

	describe("updateEntryCaption", () => {
		it("엔트리 캡션을 수정해야 한다", async () => {
			// Given
			const mockAlbum = createTestAlbum({ id: testAlbumId });
			const mockEntry = createTestAlbumEntry({
				albumId: testAlbumId,
				assetId: testAssetId,
			});
			const updatedEntry = createTestAlbumEntry({
				albumId: testAlbumId,
				assetId: testAssetId,
				caption: "New caption",
			});

			mockRepository.findById.mockResolvedValue(mockAlbum);
			mockRepository.findEntryByAlbumIdAndAssetId.mockResolvedValue(mockEntry);
			mockRepository.updateEntryCaption.mockResolvedValue(updatedEntry);

			// When
			const result = await service.updateEntryCaption(
				testAlbumId,
				testAssetId,
				"New caption",
			);

			// Then
			expect(mockRepository.updateEntryCaption).toHaveBeenCalledWith(
				testAlbumId,
				testAssetId,
				"New caption",
			);
			expect(result.caption).toBe("New caption");
		});

		it("앨범에 없는 에셋이면 NotFoundException을 던져야 한다", async () => {
			// Given
			const mockAlbum = createTestAlbum({ id: testAlbumId });

			mockRepository.findById.mockResolvedValue(mockAlbum);
			mockRepository.findEntryByAlbumIdAndAssetId.mockResolvedValue(null);

			// When & Then
			await expect(
				service.updateEntryCaption(testAlbumId, testAssetId, "New caption"),
			).rejects.toThrow(NotFoundException);
		});
	});

	describe("findAlbumIdsContainingAsset", () => {
		it("에셋이 포함된 앨범 ID 목록을 조회해야 한다", async () => {
			// Given
			const albumIds = ["album-1", "album-2"];
			mockRepository.findAlbumIdsByAssetId.mockResolvedValue(albumIds);

			// When
			const result = await service.findAlbumIdsContainingAsset(testAssetId);

			// Then
			expect(mockRepository.findAlbumIdsByAssetId).toHaveBeenCalledWith(
				testAssetId,
			);
			expect(result).toEqual(albumIds);
		});
	});

	describe("addAssetsToAlbum", () => {
		it("여러 에셋을 앨범에 일괄 추가해야 한다", async () => {
			// Given
			const assetIds = ["asset-1", "asset-2"];
			const mockAlbum = createTestAlbum({ id: testAlbumId });

			mockRepository.findById.mockResolvedValue(mockAlbum);
			mockRepository.findEntryByAlbumIdAndAssetId.mockResolvedValue(null);
			mockRepository.findNextPosition.mockResolvedValue(0);
			mockRepository.addEntry.mockImplementation(
				async (params) => createTestAlbumEntry(params as any),
			);

			// When
			const result = await service.addAssetsToAlbum(testAlbumId, assetIds);

			// Then
			expect(result).toHaveLength(2);
		});

		it("일부 에셋 추가에 실패해도 성공한 것만 반환해야 한다", async () => {
			// Given
			const assetIds = ["asset-1", "asset-2"];
			const mockAlbum = createTestAlbum({ id: testAlbumId });

			mockRepository.findById.mockResolvedValue(mockAlbum);
			mockRepository.findEntryByAlbumIdAndAssetId
				.mockResolvedValueOnce(null) // asset-1: 없음 (추가 가능)
				.mockResolvedValueOnce(createTestAlbumEntry({ assetId: "asset-2" })); // asset-2: 이미 있음
			mockRepository.findNextPosition.mockResolvedValue(0);
			mockRepository.addEntry.mockImplementation(
				async (params) => createTestAlbumEntry(params as any),
			);

			// When
			const result = await service.addAssetsToAlbum(testAlbumId, assetIds);

			// Then
			expect(result).toHaveLength(1);
			expect(result[0].assetId).toBe("asset-1");
		});
	});

	describe("removeAssetsFromAlbum", () => {
		it("여러 에셋을 앨범에서 일괄 제거해야 한다", async () => {
			// Given
			const assetIds = ["asset-1", "asset-2"];
			const mockAlbum = createTestAlbum({ id: testAlbumId });
			const mockEntry = createTestAlbumEntry();

			mockRepository.findById.mockResolvedValue(mockAlbum);
			mockRepository.findEntryByAlbumIdAndAssetId.mockResolvedValue(mockEntry);
			mockRepository.removeEntry.mockResolvedValue(mockEntry);

			// When
			const result = await service.removeAssetsFromAlbum(testAlbumId, assetIds);

			// Then
			expect(result).toBe(2);
		});

		it("일부 에셋 제거에 실패해도 성공한 수를 반환해야 한다", async () => {
			// Given
			const assetIds = ["asset-1", "asset-2"];
			const mockAlbum = createTestAlbum({ id: testAlbumId });
			const mockEntry = createTestAlbumEntry();

			mockRepository.findById.mockResolvedValue(mockAlbum);
			mockRepository.findEntryByAlbumIdAndAssetId
				.mockResolvedValueOnce(mockEntry) // asset-1: 있음 (제거 가능)
				.mockResolvedValueOnce(null); // asset-2: 없음
			mockRepository.removeEntry.mockResolvedValue(mockEntry);

			// When
			const result = await service.removeAssetsFromAlbum(testAlbumId, assetIds);

			// Then
			expect(result).toBe(1);
		});
	});
});
