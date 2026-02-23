import { CONTEXT_KEYS } from "@cocrepo/constant";
import { Folder } from "@cocrepo/entity";
import {
	BadRequestException,
	NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ClsService } from "nestjs-cls";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { FolderRepository } from "../repositories/folder.repository";
import { FolderService } from "./folder.service";

// 로컬 타입 정의 (Prisma 의존성 제거)
type FolderUncheckedCreateInput = {
	spaceId: string;
	parentFolderId?: string | null;
	name: string;
	path: string;
	sortOrder?: number;
	creatorId?: string | null;
};

type FolderUncheckedUpdateInput = {
	name?: string;
	path?: string;
	sortOrder?: number;
	parentFolderId?: string | null;
};

/**
 * 테스트용 Folder 엔티티 생성
 */
const createTestFolder = (overrides: Partial<Folder> = {}): Folder => {
	const folder = new Folder();
	Object.assign(folder, {
		id: "folder-test-id",
		spaceId: "space-test-id",
		parentFolderId: null,
		name: "Test Folder",
		path: "/Test Folder",
		sortOrder: 0,
		creatorId: null,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
		removedAt: null,
		children: [],
		...overrides,
	});
	return folder;
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
 * 테스트용 FolderQueryDto 생성 (Prisma 의존성 제거)
 */
const createTestFolderQueryDto = (overrides: Record<string, any> = {}) => {
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

/**
 * 테스트용 CreateFolderDto 생성
 */
const createTestCreateFolderDto = (overrides: Record<string, any> = {}) => {
	return {
		name: "New Folder",
		parentFolderId: null,
		sortOrder: 0,
		creatorId: null,
		...overrides,
	};
};

/**
 * 테스트용 UpdateFolderDto 생성
 */
const createTestUpdateFolderDto = (overrides: Record<string, any> = {}) => {
	return {
		name: undefined,
		sortOrder: undefined,
		...overrides,
	};
};

describe("FolderService", () => {
	let service: FolderService;
	let mockRepository: DeepMockProxy<FolderRepository>;
	let mockCls: DeepMockProxy<ClsService>;

	const testSpaceId = "space-test-id";
	const testFolderId = "folder-test-id";

	beforeEach(async () => {
		mockRepository = mockDeep<FolderRepository>();
		mockCls = mockDeep<ClsService>();

		// 기본적으로 Space ID 설정
		mockCls.get.calledWith(CONTEXT_KEYS.SPACE_ID).mockReturnValue(testSpaceId);
		mockCls.get.calledWith(CONTEXT_KEYS.TENANT).mockReturnValue(createTestTenantWithNormalCategory() as any);

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FolderService,
				{ provide: FolderRepository, useValue: mockRepository },
				{ provide: ClsService, useValue: mockCls },
			],
		}).compile();

		service = module.get<FolderService>(FolderService);
	});

	afterEach(() => {
		mockReset(mockRepository);
		mockReset(mockCls);
	});

	describe("getFoldersBySpace", () => {
		it("Space 내 폴더 목록을 조회해야 한다", async () => {
			// Given
			const query = createTestFolderQueryDto({ skip: 0, take: 10 });

			const mockFolders = [
				createTestFolder({ id: "folder-1" }),
				createTestFolder({ id: "folder-2" }),
			];

			mockRepository.findManyBySpaceId.mockResolvedValue({
				items: mockFolders,
				count: 2,
			});

			// When
			const result = await service.getFoldersBySpace(query as any);

			// Then
			expect(mockRepository.findManyBySpaceId).toHaveBeenCalledWith(
				expect.objectContaining({
					spaceId: testSpaceId,
					skip: 0,
					take: 10,
				}),
			);
			expect(result.folders).toHaveLength(2);
			expect(result.totalCount).toBe(2);
		});

		it("전체 접근 권한이 있고 query에 spaceId가 있으면 해당 spaceId를 사용해야 한다", async () => {
			// Given
			const query = createTestFolderQueryDto({
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
			await service.getFoldersBySpace(query as any);

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

			const query = createTestFolderQueryDto();

			// When & Then
			await expect(service.getFoldersBySpace(query as any)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe("getFolderTree", () => {
		it("폴더 트리를 조회해야 한다", async () => {
			// Given
			const parentFolder = createTestFolder({
				id: "parent-folder",
				name: "Parent",
				path: "/Parent",
			});
			const childFolder = createTestFolder({
				id: "child-folder",
				name: "Child",
				path: "/Parent/Child",
				parentFolderId: "parent-folder",
				children: [],
			});
			parentFolder.children = [childFolder];

			mockRepository.findTreeBySpaceId.mockResolvedValue([parentFolder]);

			// When
			const result = await service.getFolderTree(testSpaceId);

			// Then
			expect(mockRepository.findTreeBySpaceId).toHaveBeenCalledWith(testSpaceId);
			expect(result).toHaveLength(1);
		});
	});

	describe("createFolder", () => {
		it("루트 폴더를 생성해야 한다", async () => {
			// Given
			const dto = createTestCreateFolderDto({
				name: "New Folder",
				parentFolderId: null,
			});

			mockRepository.existsByNameInParent.mockResolvedValue(false);
			mockRepository.create.mockImplementation(
				async (data) => createTestFolder(data as any),
			);

			// When
			const result = await service.createFolder(dto as any);

			// Then
			expect(mockRepository.existsByNameInParent).toHaveBeenCalledWith(
				testSpaceId,
				"New Folder",
				null,
			);
			expect(mockRepository.create).toHaveBeenCalled();
			expect(result.name).toBe("New Folder");
			expect(result.path).toBe("/New Folder");
		});

		it("하위 폴더를 생성해야 한다", async () => {
			// Given
			const parentFolder = createTestFolder({
				id: "parent-folder",
				name: "Parent",
				path: "/Parent",
			});

			const dto = createTestCreateFolderDto({
				name: "Child",
				parentFolderId: "parent-folder",
			});

			mockRepository.existsByNameInParent.mockResolvedValue(false);
			mockRepository.findById.mockResolvedValue(parentFolder);
			mockRepository.create.mockImplementation(
				async (data) => createTestFolder(data as any),
			);

			// When
			const result = await service.createFolder(dto as any);

			// Then
			expect(result.path).toBe("/Parent/Child");
		});

		it("같은 위치에 동일한 이름의 폴더가 있으면 BadRequestException을 던져야 한다", async () => {
			// Given
			const dto = createTestCreateFolderDto({
				name: "Existing Folder",
			});

			mockRepository.existsByNameInParent.mockResolvedValue(true);

			// When & Then
			await expect(service.createFolder(dto as any)).rejects.toThrow(
				BadRequestException,
			);
		});

		it("폴더 이름이 비어있으면 BadRequestException을 던져야 한다", async () => {
			// Given
			const dto = createTestCreateFolderDto({
				name: "",
			});

			// When & Then
			await expect(service.createFolder(dto as any)).rejects.toThrow(
				BadRequestException,
			);
		});

		it("폴더 이름에 금지된 문자가 포함되면 BadRequestException을 던져야 한다", async () => {
			// Given
			const dto = createTestCreateFolderDto({
				name: "Folder/Name",
			});

			// When & Then
			await expect(service.createFolder(dto as any)).rejects.toThrow(
				BadRequestException,
			);
		});

		it("상위 폴더를 찾을 수 없으면 BadRequestException을 던져야 한다", async () => {
			// Given
			const dto = createTestCreateFolderDto({
				name: "Child",
				parentFolderId: "non-existent-folder",
			});

			mockRepository.existsByNameInParent.mockResolvedValue(false);
			mockRepository.findById.mockResolvedValue(null);

			// When & Then
			await expect(service.createFolder(dto as any)).rejects.toThrow(
				BadRequestException,
			);
		});

		it("다른 Space의 상위 폴더를 지정하면 BadRequestException을 던져야 한다", async () => {
			// Given
			const otherSpaceParent = createTestFolder({
				id: "other-folder",
				spaceId: "other-space-id",
			});

			const dto = createTestCreateFolderDto({
				name: "Child",
				parentFolderId: "other-folder",
			});

			mockRepository.existsByNameInParent.mockResolvedValue(false);
			mockRepository.findById.mockResolvedValue(otherSpaceParent);

			// When & Then
			await expect(service.createFolder(dto as any)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe("moveFolder", () => {
		it("폴더를 다른 위치로 이동해야 한다", async () => {
			// Given
			const sourceFolder = createTestFolder({
				id: testFolderId,
				name: "Source",
				path: "/Source",
				parentFolderId: null,
			});
			const targetFolder = createTestFolder({
				id: "target-folder",
				name: "Target",
				path: "/Target",
			});

			mockRepository.findById
				.mockResolvedValueOnce(sourceFolder) // getFolderById
				.mockResolvedValueOnce(targetFolder); // getFolderById (target)
			mockRepository.existsByNameInParent.mockResolvedValue(false);
			mockRepository.findManyByPathPrefix.mockResolvedValue([]);
			mockRepository.updateById.mockResolvedValue(
				createTestFolder({
					id: testFolderId,
					parentFolderId: "target-folder",
					path: "/Target/Source",
				}),
			);

			// When
			const result = await service.moveFolder(testFolderId, "target-folder");

			// Then
			expect(result.parentFolderId).toBe("target-folder");
			expect(result.path).toBe("/Target/Source");
		});

		it("루트로 이동해야 한다", async () => {
			// Given
			const sourceFolder = createTestFolder({
				id: testFolderId,
				name: "Source",
				path: "/Parent/Source",
				parentFolderId: "parent-folder",
			});

			mockRepository.findById.mockResolvedValue(sourceFolder);
			mockRepository.existsByNameInParent.mockResolvedValue(false);
			mockRepository.findManyByPathPrefix.mockResolvedValue([]);
			mockRepository.updateById.mockResolvedValue(
				createTestFolder({
					id: testFolderId,
					parentFolderId: null,
					path: "/Source",
				}),
			);

			// When
			const result = await service.moveFolder(testFolderId, null);

			// Then
			expect(result.parentFolderId).toBeNull();
			expect(result.path).toBe("/Source");
		});

		it("이미 해당 위치에 있으면 변경 없이 반환해야 한다", async () => {
			// Given
			const sourceFolder = createTestFolder({
				id: testFolderId,
				parentFolderId: "target-folder",
			});

			mockRepository.findById.mockResolvedValue(sourceFolder);

			// When
			const result = await service.moveFolder(testFolderId, "target-folder");

			// Then
			expect(result).toEqual(sourceFolder);
			expect(mockRepository.updateById).not.toHaveBeenCalled();
		});

		it("자기 자신의 하위 폴더로 이동하면 BadRequestException을 던져야 한다", async () => {
			// Given
			const sourceFolder = createTestFolder({
				id: testFolderId,
				name: "Source",
				path: "/Source",
			});
			const targetFolder = createTestFolder({
				id: "target-folder",
				name: "Target",
				path: "/Source/Target",
				parentFolderId: testFolderId,
			});

			mockRepository.findById
				.mockResolvedValueOnce(sourceFolder)
				.mockResolvedValueOnce(targetFolder);

			// When & Then
			await expect(
				service.moveFolder(testFolderId, "target-folder"),
			).rejects.toThrow(BadRequestException);
		});

		it("이동할 위치에 동일한 이름의 폴더가 있으면 BadRequestException을 던져야 한다", async () => {
			// Given
			const sourceFolder = createTestFolder({
				id: testFolderId,
				name: "Folder",
				path: "/Folder",
			});
			const targetFolder = createTestFolder({
				id: "target-folder",
				name: "Target",
				path: "/Target",
			});

			mockRepository.findById
				.mockResolvedValueOnce(sourceFolder)
				.mockResolvedValueOnce(targetFolder);
			mockRepository.existsByNameInParent.mockResolvedValue(true);

			// When & Then
			await expect(
				service.moveFolder(testFolderId, "target-folder"),
			).rejects.toThrow(BadRequestException);
		});
	});

	describe("getFolderById", () => {
		it("ID로 폴더를 조회해야 한다", async () => {
			// Given
			const mockFolder = createTestFolder({ id: testFolderId });
			mockRepository.findById.mockResolvedValue(mockFolder);

			// When
			const result = await service.getFolderById(testFolderId);

			// Then
			expect(mockRepository.findById).toHaveBeenCalledWith(testFolderId);
			expect(result).toEqual(mockFolder);
		});

		it("존재하지 않는 폴더는 NotFoundException을 던져야 한다", async () => {
			// Given
			mockRepository.findById.mockResolvedValue(null);

			// When & Then
			await expect(service.getFolderById("non-existent")).rejects.toThrow(
				NotFoundException,
			);
		});

		it("다른 Space의 폴더는 NotFoundException을 던져야 한다", async () => {
			// Given
			const otherSpaceFolder = createTestFolder({
				id: testFolderId,
				spaceId: "other-space-id",
			});
			mockRepository.findById.mockResolvedValue(otherSpaceFolder);

			// When & Then
			await expect(service.getFolderById(testFolderId)).rejects.toThrow(
				NotFoundException,
			);
		});

		it("전체 접근 권한이 있으면 다른 Space의 폴더도 조회할 수 있다", async () => {
			// Given
			mockCls.get.calledWith(CONTEXT_KEYS.TENANT).mockReturnValue(createTestTenantWithRootCategory() as any);

			const otherSpaceFolder = createTestFolder({
				id: testFolderId,
				spaceId: "other-space-id",
			});
			mockRepository.findById.mockResolvedValue(otherSpaceFolder);

			// When
			const result = await service.getFolderById(testFolderId);

			// Then
			expect(result).toEqual(otherSpaceFolder);
		});
	});

	describe("deleteFolder", () => {
		it("폴더를 소프트 삭제해야 한다", async () => {
			// Given
			const mockFolder = createTestFolder({ id: testFolderId });
			mockRepository.findById.mockResolvedValue(mockFolder);
			mockRepository.countChildren.mockResolvedValue(0);
			mockRepository.removeById.mockResolvedValue(
				createTestFolder({ id: testFolderId, removedAt: new Date() }),
			);

			// When
			const result = await service.deleteFolder(testFolderId);

			// Then
			expect(mockRepository.removeById).toHaveBeenCalledWith(testFolderId);
			expect(result.removedAt).toBeDefined();
		});

		it("하위 폴더가 있으면 BadRequestException을 던져야 한다", async () => {
			// Given
			const mockFolder = createTestFolder({ id: testFolderId });
			mockRepository.findById.mockResolvedValue(mockFolder);
			mockRepository.countChildren.mockResolvedValue(2);

			// When & Then
			await expect(service.deleteFolder(testFolderId)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe("restoreFolder", () => {
		it("전체 접근 권한이 있으면 폴더를 복원할 수 있다", async () => {
			// Given
			mockCls.get.calledWith(CONTEXT_KEYS.TENANT).mockReturnValue(createTestTenantWithRootCategory() as any);

			const restoredFolder = createTestFolder({
				id: testFolderId,
				removedAt: null,
			});
			mockRepository.restoreById.mockResolvedValue(restoredFolder);

			// When
			const result = await service.restoreFolder(testFolderId);

			// Then
			expect(mockRepository.restoreById).toHaveBeenCalledWith(testFolderId);
			expect(result.removedAt).toBeNull();
		});

		it("전체 접근 권한이 없으면 BadRequestException을 던져야 한다", async () => {
			// When & Then
			await expect(service.restoreFolder(testFolderId)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe("updateFolder", () => {
		it("폴더 이름을 변경해야 한다", async () => {
			// Given
			const existingFolder = createTestFolder({
				id: testFolderId,
				name: "Old Name",
				path: "/Old Name",
			});
			const dto = createTestUpdateFolderDto({
				name: "New Name",
			});

			mockRepository.findById.mockResolvedValue(existingFolder);
			mockRepository.existsByNameInParent.mockResolvedValue(false);
			mockRepository.findManyByPathPrefix.mockResolvedValue([]);
			mockRepository.updateById.mockResolvedValue(
				createTestFolder({
					id: testFolderId,
					name: "New Name",
					path: "/New Name",
				}),
			);

			// When
			const result = await service.updateFolder(testFolderId, dto as any);

			// Then
			expect(result.name).toBe("New Name");
		});

		it("같은 위치에 동일한 이름의 폴더가 있으면 BadRequestException을 던져야 한다", async () => {
			// Given
			const existingFolder = createTestFolder({ id: testFolderId });
			const dto = createTestUpdateFolderDto({
				name: "Existing Name",
			});

			mockRepository.findById.mockResolvedValue(existingFolder);
			mockRepository.existsByNameInParent.mockResolvedValue(true);

			// When & Then
			await expect(service.updateFolder(testFolderId, dto as any)).rejects.toThrow(
				BadRequestException,
			);
		});
	});

	describe("getRootFolders", () => {
		it("루트 폴더 목록을 조회해야 한다", async () => {
			// Given
			const mockFolders = [
				createTestFolder({ id: "folder-1", parentFolderId: null }),
				createTestFolder({ id: "folder-2", parentFolderId: null }),
			];
			mockRepository.findRootFolders.mockResolvedValue(mockFolders);

			// When
			const result = await service.getRootFolders();

			// Then
			expect(mockRepository.findRootFolders).toHaveBeenCalledWith(testSpaceId);
			expect(result).toHaveLength(2);
		});
	});

	describe("getChildFolders", () => {
		it("하위 폴더 목록을 조회해야 한다", async () => {
			// Given
			const parentFolder = createTestFolder({ id: testFolderId });
			const childFolders = [
				createTestFolder({ id: "child-1", parentFolderId: testFolderId }),
				createTestFolder({ id: "child-2", parentFolderId: testFolderId }),
			];

			mockRepository.findById.mockResolvedValue(parentFolder);
			mockRepository.findChildren.mockResolvedValue(childFolders);

			// When
			const result = await service.getChildFolders(testFolderId);

			// Then
			expect(mockRepository.findChildren).toHaveBeenCalledWith(testFolderId);
			expect(result).toHaveLength(2);
		});
	});

	describe("countFoldersBySpace", () => {
		it("Space 내 폴더 수를 조회해야 한다", async () => {
			// Given
			mockRepository.countBySpaceId.mockResolvedValue(5);

			// When
			const result = await service.countFoldersBySpace();

			// Then
			expect(mockRepository.countBySpaceId).toHaveBeenCalledWith(testSpaceId);
			expect(result).toBe(5);
		});
	});
});
