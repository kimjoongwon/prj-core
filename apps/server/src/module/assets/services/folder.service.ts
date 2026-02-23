import { canAccessAllSpaces } from "@cocrepo/be-common";
import { CONTEXT_KEYS } from "@cocrepo/constant";
import {
	CreateFolderDto,
	FolderQueryDto,
	UpdateFolderDto,
} from "@cocrepo/dto";
import type { Prisma } from "@cocrepo/prisma";
import { Folder } from "@cocrepo/entity";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { FolderRepository } from "../repositories/folder.repository";

/**
 * 폴더 트리 노드 (계층 구조 표현용)
 */
export interface FolderTreeNode extends Folder {
	children: FolderTreeNode[];
}

/**
 * 폴더 이동 결과
 */
export interface MoveFolderResult {
	folder: Folder;
	affectedCount: number;
}

/**
 * 폴더 서비스
 *
 * 폴더 CRUD, 계층 구조 관리, 경로 생성/검증, Space 기반 접근 권한을 담당합니다.
 */
@Injectable()
export class FolderService {
	private readonly logger = new Logger(FolderService.name);

	constructor(
		private readonly repository: FolderRepository,
		private readonly cls: ClsService,
	) {}

	/**
	 * 현재 요청의 Space ID를 가져옵니다.
	 */
	private getSpaceId(): string {
		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
		if (!spaceId) {
			throw new BadRequestException("Space가 선택되지 않았습니다.");
		}
		return spaceId;
	}

	/**
	 * 전체 Space 접근 권한 확인
	 */
	private canAccessAllSpaces(): boolean {
		const tenant = this.cls.get(CONTEXT_KEYS.TENANT);
		return tenant ? canAccessAllSpaces(tenant) : false;
	}

	// ============================================================================
	// 단일 조회
	// ============================================================================

	/**
	 * ID로 폴더 조회 (권한 확인 포함)
	 */
	async getFolderById(folderId: string): Promise<Folder> {
		const spaceId = this.getSpaceId();
		this.logger.debug(`ID로 폴더 조회: folderId=${folderId}, spaceId=${spaceId}`);

		const folder = await this.repository.findById(folderId);

		if (!folder) {
			throw new NotFoundException("폴더를 찾을 수 없습니다.");
		}

		// Space 접근 권한 확인
		if (!this.canAccessAllSpaces() && folder.spaceId !== spaceId) {
			throw new NotFoundException("폴더를 찾을 수 없습니다.");
		}

		return folder;
	}

	/**
	 * ID로 폴더 조회 (하위 폴더 포함)
	 */
	async getFolderWithChildren(folderId: string): Promise<Folder> {
		const spaceId = this.getSpaceId();
		this.logger.debug(
			`ID로 폴더 조회 (하위 포함): folderId=${folderId}, spaceId=${spaceId}`,
		);

		const folder = await this.repository.findByIdWithChildren(folderId);

		if (!folder) {
			throw new NotFoundException("폴더를 찾을 수 없습니다.");
		}

		// Space 접근 권한 확인
		if (!this.canAccessAllSpaces() && folder.spaceId !== spaceId) {
			throw new NotFoundException("폴더를 찾을 수 없습니다.");
		}

		return folder;
	}

	/**
	 * 경로로 폴더 조회
	 */
	async getFolderByPath(path: string): Promise<Folder | null> {
		const spaceId = this.getSpaceId();
		this.logger.debug(`경로로 폴더 조회: path=${path}, spaceId=${spaceId}`);

		const folder = await this.repository.findByPath(path);

		// Space 접근 권한 확인
		if (folder && !this.canAccessAllSpaces() && folder.spaceId !== spaceId) {
			return null;
		}

		return folder;
	}

	/**
	 * 여러 ID로 폴더 목록 조회
	 */
	async getFoldersByIds(ids: string[]): Promise<Folder[]> {
		this.logger.debug(`여러 ID로 폴더 조회: count=${ids.length}`);
		return this.repository.findByIds(ids);
	}

	// ============================================================================
	// 목록 조회
	// ============================================================================

	/**
	 * Space 내 폴더 목록 조회 (Controller 호환)
	 */
	async getFoldersBySpace(
		query: FolderQueryDto,
	): Promise<{ folders: Folder[]; totalCount: number }> {
		const spaceId = this.getSpaceId();
		this.logger.debug(`Space 내 폴더 목록 조회: spaceId=${spaceId}`);

		// 전체 접근 권한이 있고 query에 spaceId가 있으면 해당 spaceId 사용
		const targetSpaceId =
			this.canAccessAllSpaces() && query.spaceId ? query.spaceId : spaceId;

		const where = query.toPrismaWhere({ spaceId: targetSpaceId });
		const orderBy = query.toPrismaOrderBy();

		const { items, count } = await this.repository.findManyBySpaceId({
			spaceId: targetSpaceId,
			where,
			orderBy,
			skip: query.skip ?? 0,
			take: query.take ?? 10,
		});

		return {
			folders: items,
			totalCount: count,
		};
	}

	/**
	 * 하위 폴더 목록 조회
	 */
	async getChildFolders(parentFolderId: string): Promise<Folder[]> {
		const spaceId = this.getSpaceId();
		this.logger.debug(
			`하위 폴더 목록 조회: parentFolderId=${parentFolderId}, spaceId=${spaceId}`,
		);

		// 부모 폴더 존재 및 권한 확인
		await this.getFolderById(parentFolderId);

		return this.repository.findChildren(parentFolderId);
	}

	/**
	 * 루트 폴더 목록 조회
	 */
	async getRootFolders(): Promise<Folder[]> {
		const spaceId = this.getSpaceId();
		this.logger.debug(`루트 폴더 목록 조회: spaceId=${spaceId}`);

		return this.repository.findRootFolders(spaceId);
	}

	// ============================================================================
	// 트리 조회
	// ============================================================================

	/**
	 * 폴더 트리 조회 (전체 계층 구조)
	 * @param spaceId - Space ID (Controller에서 전달)
	 */
	async getFolderTree(spaceId: string): Promise<Folder[]> {
		this.logger.debug(`폴더 트리 조회: spaceId=${spaceId}`);

		// Repository에서 1단계만 조회되므로 재귀적으로 전체 트리 구성
		const rootFolders = await this.repository.findTreeBySpaceId(spaceId);

		// 각 루트 폴더의 하위 트리를 재귀적으로 로드
		const treeNodes = await Promise.all(
			rootFolders.map((folder) => this.buildTreeNode(folder)),
		);

		return treeNodes;
	}

	/**
	 * 특정 폴더의 하위 트리 조회
	 */
	async getSubTree(folderId: string): Promise<FolderTreeNode> {
		const spaceId = this.getSpaceId();
		this.logger.debug(
			`하위 트리 조회: folderId=${folderId}, spaceId=${spaceId}`,
		);

		const folder = await this.getFolderWithChildren(folderId);
		return this.buildTreeNode(folder);
	}

	/**
	 * 트리 노드 구성 (재귀)
	 */
	private async buildTreeNode(folder: Folder): Promise<FolderTreeNode> {
		const children = folder.children ?? [];

		// 자식이 있으면 재귀적으로 트리 구성
		const childNodes = await Promise.all(
			children.map((child) => this.buildTreeNode(child)),
		);

		return {
			...folder,
			children: childNodes,
		} as FolderTreeNode;
	}

	// ============================================================================
	// 생성
	// ============================================================================

	/**
	 * 폴더 생성 (Controller 호환 - DTO 사용)
	 */
	async createFolder(dto: CreateFolderDto): Promise<Folder> {
		const spaceId = this.getSpaceId();
		const { name, parentFolderId, sortOrder, creatorId } = dto;

		this.logger.debug(
			`폴더 생성: name=${name}, parentFolderId=${parentFolderId ?? "null"}, spaceId=${spaceId}`,
		);

		// 이름 검증
		this.validateFolderName(name);

		// 동일 이름의 형제 폴더 존재 여부 확인
		const duplicateExists = await this.repository.existsByNameInParent(
			spaceId,
			name,
			parentFolderId ?? null,
		);
		if (duplicateExists) {
			throw new BadRequestException(
				"같은 위치에 동일한 이름의 폴더가 이미 존재합니다.",
			);
		}

		// 경로 생성
		const path = await this.buildFolderPath(
			spaceId,
			name,
			parentFolderId ?? null,
		);

		// 폴더 생성
		const data: Prisma.FolderUncheckedCreateInput = {
			spaceId,
			parentFolderId: parentFolderId ?? null,
			name,
			path,
			sortOrder: sortOrder ?? 0,
			creatorId: creatorId ?? null,
		};

		return this.repository.create(data);
	}

	/**
	 * 루트 폴더 생성
	 */
	async createRootFolder(params: {
		name: string;
		sortOrder?: number;
		creatorId?: string;
	}): Promise<Folder> {
		const spaceId = this.getSpaceId();
		const dto = new CreateFolderDto();
		dto.spaceId = spaceId;
		dto.name = params.name;
		dto.parentFolderId = null;
		dto.sortOrder = params.sortOrder;
		dto.creatorId = params.creatorId;
		return this.createFolder(dto);
	}

	// ============================================================================
	// 수정
	// ============================================================================

	/**
	 * 폴더 수정 (Controller 호환 - DTO 사용)
	 */
	async updateFolder(folderId: string, dto: UpdateFolderDto): Promise<Folder> {
		const spaceId = this.getSpaceId();
		this.logger.debug(`폴더 수정: folderId=${folderId}`);

		// 폴더 조회 및 권한 확인
		const folder = await this.getFolderById(folderId);

		// 이름 변경이 있는 경우
		if (dto.name !== undefined && dto.name !== folder.name) {
			this.validateFolderName(dto.name);

			// 동일 이름의 형제 폴더 존재 여부 확인
			const duplicateExists = await this.repository.existsByNameInParent(
				spaceId,
				dto.name,
				folder.parentFolderId,
				folderId, // 자신 제외
			);
			if (duplicateExists) {
				throw new BadRequestException(
					"같은 위치에 동일한 이름의 폴더가 이미 존재합니다.",
				);
			}

			// 새 경로 생성
			const newPath = await this.buildFolderPath(
				spaceId,
				dto.name,
				folder.parentFolderId,
			);

			// 하위 폴더들의 경로도 업데이트
			const oldPath = folder.path;
			await this.updateDescendantPaths(oldPath, newPath);

			// 폴더 수정
			return this.repository.updateById(folderId, {
				name: dto.name,
				path: newPath,
				sortOrder: dto.sortOrder,
			});
		}

		// 정렬 순서만 변경
		if (dto.sortOrder !== undefined) {
			return this.repository.updateById(folderId, {
				sortOrder: dto.sortOrder,
			});
		}

		// 변경 사항 없음
		return folder;
	}

	/**
	 * 폴더 이름 변경 (경로 자동 업데이트)
	 */
	async renameFolder(folderId: string, newName: string): Promise<Folder> {
		const dto = new UpdateFolderDto();
		dto.name = newName;
		return this.updateFolder(folderId, dto);
	}

	/**
	 * 폴더 정렬 순서 변경
	 */
	async updateFolderSortOrder(
		folderId: string,
		sortOrder: number,
	): Promise<Folder> {
		const dto = new UpdateFolderDto();
		dto.sortOrder = sortOrder;
		return this.updateFolder(folderId, dto);
	}

	// ============================================================================
	// 이동
	// ============================================================================

	/**
	 * 폴더 이동 (Controller 호환)
	 */
	async moveFolder(
		folderId: string,
		targetFolderId?: string | null,
	): Promise<Folder> {
		const spaceId = this.getSpaceId();
		this.logger.debug(
			`폴더 이동: folderId=${folderId} -> targetFolderId=${targetFolderId ?? "null"}`,
		);

		// 이동할 폴더 조회
		const folder = await this.getFolderById(folderId);

		// 이미 해당 위치에 있으면 변경 없음
		if (folder.parentFolderId === (targetFolderId ?? null)) {
			return folder;
		}

		// 대상 폴더가 같은 Space에 있는지 확인
		if (targetFolderId) {
			const targetParent = await this.getFolderById(targetFolderId);

			// 자기 자신의 하위 폴더로 이동 금지
			if (this.isDescendantOf(targetParent, folderId)) {
				throw new BadRequestException(
					"자신의 하위 폴더로 이동할 수 없습니다.",
				);
			}
		}

		// 동일 이름의 폴더가 대상 위치에 있는지 확인
		const duplicateExists = await this.repository.existsByNameInParent(
			spaceId,
			folder.name,
			targetFolderId ?? null,
			folderId, // 자신 제외
		);
		if (duplicateExists) {
			throw new BadRequestException(
				"이동할 위치에 동일한 이름의 폴더가 이미 존재합니다.",
			);
		}

		// 새 경로 생성
		const newPath = await this.buildFolderPath(
			spaceId,
			folder.name,
			targetFolderId ?? null,
		);

		// 하위 폴더들의 경로도 업데이트
		const oldPath = folder.path;
		await this.updateDescendantPaths(oldPath, newPath);

		// 폴더 이동
		return this.repository.updateById(folderId, {
			parentFolderId: targetFolderId ?? null,
			path: newPath,
		});
	}

	/**
	 * 폴더가 특정 폴더의 하위인지 확인
	 */
	private isDescendantOf(folder: Folder, ancestorId: string): boolean {
		if (!folder.parentFolderId) return false;
		if (folder.parentFolderId === ancestorId) return true;
		// parent가 로드되어 있으면 재귀적으로 확인
		if (folder.parent) {
			return this.isDescendantOf(folder.parent, ancestorId);
		}
		// path 기반으로 확인 (parent가 로드되지 않은 경우)
		return folder.path.includes(`/${ancestorId}/`);
	}

	// ============================================================================
	// 삭제
	// ============================================================================

	/**
	 * 폴더 삭제 (Soft Delete)
	 */
	async deleteFolder(folderId: string): Promise<Folder> {
		const spaceId = this.getSpaceId();
		this.logger.debug(`폴더 삭제: folderId=${folderId}, spaceId=${spaceId}`);

		// 폴더 존재 및 권한 확인
		await this.getFolderById(folderId);

		// 하위 폴더 존재 여부 확인
		const childCount = await this.repository.countChildren(folderId);
		if (childCount > 0) {
			throw new BadRequestException(
				"하위 폴더가 있는 폴더는 삭제할 수 없습니다. 먼저 하위 폴더를 삭제해주세요.",
			);
		}

		// TODO: 폴더 내 에셋 존재 여부 확인 (AssetRepository 필요)
		// const assetCount = await this.assetRepository.countByFolderId(folderId);
		// if (assetCount > 0) {
		//   throw new BadRequestException(
		//     "폴더 내 에셋이 있는 경우 삭제할 수 없습니다. 먼저 에셋을 이동하거나 삭제해주세요."
		//   );
		// }

		return this.repository.removeById(folderId);
	}

	/**
	 * 폴더 복원
	 */
	async restoreFolder(folderId: string): Promise<Folder> {
		this.logger.debug(`폴더 복원: folderId=${folderId}`);

		// 전체 접근 권한이 있는 경우에만 복원 가능
		if (!this.canAccessAllSpaces()) {
			throw new BadRequestException(
				"삭제된 폴더 복원은 전체 접근 권한이 필요합니다.",
			);
		}

		return this.repository.restoreById(folderId);
	}

	// ============================================================================
	// 경로 관련
	// ============================================================================

	/**
	 * 폴더 경로 생성
	 */
	private async buildFolderPath(
		spaceId: string,
		name: string,
		parentFolderId: string | null,
	): Promise<string> {
		if (!parentFolderId) {
			// 루트 폴더
			return `/${name}`;
		}

		// 부모 폴더 조회
		const parentFolder = await this.repository.findById(parentFolderId);
		if (!parentFolder) {
			throw new BadRequestException("상위 폴더를 찾을 수 없습니다.");
		}

		// 부모 폴더가 같은 Space에 있는지 확인
		if (parentFolder.spaceId !== spaceId) {
			throw new BadRequestException(
				"다른 Space의 폴더를 상위 폴더로 지정할 수 없습니다.",
			);
		}

		return `${parentFolder.path}/${name}`;
	}

	/**
	 * 하위 폴더들의 경로 업데이트 (폴더 이동/이름 변경 시)
	 */
	private async updateDescendantPaths(
		oldPath: string,
		newPath: string,
	): Promise<number> {
		// 경로 접두사로 시작하는 모든 폴더 조회
		const descendants = await this.repository.findManyByPathPrefix(
			`${oldPath}/`,
		);

		// 각 하위 폴더의 경로 업데이트
		let count = 0;
		for (const descendant of descendants) {
			const updatedPath = descendant.path.replace(oldPath, newPath);
			await this.repository.updateById(descendant.id, { path: updatedPath });
			count++;
		}

		return count;
	}

	/**
	 * 폴더 이름 검증
	 */
	private validateFolderName(name: string): void {
		if (!name || name.trim().length === 0) {
			throw new BadRequestException("폴더 이름은 비워둘 수 없습니다.");
		}

		if (name.length > 255) {
			throw new BadRequestException(
				"폴더 이름은 255자를 초과할 수 없습니다.",
			);
		}

		// 금지된 문자 확인
		const forbiddenChars = ["/", "\\", ":", "*", "?", '"', "<", ">", "|"];
		if (forbiddenChars.some((char) => name.includes(char))) {
			throw new BadRequestException(
				`폴더 이름에 사용할 수 없는 문자가 포함되어 있습니다: ${forbiddenChars.join(" ")}`,
			);
		}
	}

	// ============================================================================
	// 집계
	// ============================================================================

	/**
	 * Space 내 폴더 수 조회
	 */
	async countFoldersBySpace(): Promise<number> {
		const spaceId = this.getSpaceId();
		this.logger.debug(`Space 내 폴더 수 조회: spaceId=${spaceId}`);
		return this.repository.countBySpaceId(spaceId);
	}

	/**
	 * 하위 폴더 수 조회
	 */
	async countChildFolders(folderId: string): Promise<number> {
		this.logger.debug(`하위 폴더 수 조회: folderId=${folderId}`);
		return this.repository.countChildren(folderId);
	}

	/**
	 * 폴더 존재 여부 확인
	 */
	async existsFolder(folderId: string): Promise<boolean> {
		this.logger.debug(`폴더 존재 여부 확인: folderId=${folderId}`);
		return this.repository.existsById(folderId);
	}

	/**
	 * 경로 존재 여부 확인
	 */
	async existsPath(path: string): Promise<boolean> {
		this.logger.debug(`경로 존재 여부 확인: path=${path}`);
		return this.repository.existsByPath(path);
	}
}
