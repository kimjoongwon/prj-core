import { SpaceContext } from "@cocrepo/context";
import { Folder } from "@cocrepo/entity";
import type {
	CreateFolderInput,
	GetFoldersQueryInput,
	UpdateFolderInput,
} from "@cocrepo/input";
import type { Prisma } from "@cocrepo/prisma";
import {
	buildFolderQueryOrderBy,
	buildFolderQueryWhere,
	FoldersRepository,
} from "@cocrepo/repository";
import {
	BadRequestException,
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";

@Injectable()
export class FolderAggregate {
	private readonly logger = new Logger(FolderAggregate.name);

	constructor(
		private readonly foldersRepository: FoldersRepository,
		private readonly spaceContext: SpaceContext,
	) {}

	async getFolders(
		query: GetFoldersQueryInput,
	): Promise<{ data: Folder[]; totalCount: number }> {
		const spaceId = this.getRequiredSpaceId();
		const spaceIds = this.spaceContext.spaceIds;
		const where = this.applySpaceScope(
			buildFolderQueryWhere(
				query,
				spaceIds === undefined
					? undefined
					: { tenant: { spaceId: { in: spaceIds } } },
			),
			spaceIds,
		);

		this.logger.debug(`폴더 목록 조회: space=${spaceId.slice(-8)}`);

		const folderResult = await this.foldersRepository.findMany({
			where,
			orderBy: buildFolderQueryOrderBy(query),
			skip: query.skip,
			take: query.take,
		});

		return {
			data: folderResult.folders,
			totalCount: folderResult.totalCount,
		};
	}

	async createFolder(
		input: CreateFolderInput,
		creatorId: string,
	): Promise<Folder> {
		const spaceId = this.getRequiredSpaceId();
		const tenantId = this.getRequiredTenantId();
		const folder = new Folder();
		folder.parentFolderId = input.parentFolderId ?? null;
		folder.name = input.name.trim();

		if (!folder.name) {
			throw new BadRequestException("폴더명을 입력해주세요");
		}

		let parentFolder: Folder | null = null;
		if (folder.parentFolderId) {
			parentFolder = await this.foldersRepository.findById(
				folder.parentFolderId,
			);
			if (
				!parentFolder ||
				parentFolder.tenant?.spaceId !== spaceId ||
				parentFolder.removedAt
			) {
				throw new NotFoundException("상위 폴더를 찾을 수 없습니다");
			}
		}

		const path = parentFolder
			? `${parentFolder.path}/${folder.name}`
			: `/${folder.name}`;
		const existingFolder = await this.foldersRepository.findByPath(path);
		if (existingFolder) {
			throw new ConflictException(`이미 존재하는 폴더 경로입니다: ${path}`);
		}

		const siblingFolders = folder.parentFolderId
			? await this.foldersRepository.findByParentFolderId(folder.parentFolderId)
			: (await this.foldersRepository.findBySpaceId(spaceId)).filter(
					(currentFolder) => currentFolder.parentFolderId === null,
				);
		const nextSortOrder =
			siblingFolders.length > 0
				? Math.max(
						...siblingFolders.map((currentFolder) => currentFolder.sortOrder),
					) + 1
				: 0;

		this.logger.debug(
			`폴더 생성: space=${spaceId.slice(-8)}, parent=${folder.parentFolderId?.slice(-8) ?? "root"}, name=${folder.name}`,
		);

		return this.foldersRepository.create({
			tenantId,
			parentFolderId: folder.parentFolderId,
			name: folder.name,
			path,
			sortOrder: nextSortOrder,
			creatorId,
		});
	}

	async updateFolder(
		folderId: string,
		input: UpdateFolderInput,
	): Promise<Folder> {
		const spaceId = this.getRequiredSpaceId();
		const allFolders = (
			await this.foldersRepository.findBySpaceId(spaceId)
		).filter((folder) => !folder.removedAt);
		const currentFolder = allFolders.find((folder) => folder.id === folderId);

		if (!currentFolder) {
			throw new NotFoundException("폴더를 찾을 수 없습니다");
		}

		const nextName =
			input.name !== undefined ? input.name.trim() : currentFolder.name;
		if (!nextName) {
			throw new BadRequestException("폴더명을 입력해주세요");
		}

		const nextParentFolderId =
			input.parentFolderId !== undefined
				? (input.parentFolderId ?? null)
				: currentFolder.parentFolderId;

		if (nextParentFolderId === currentFolder.id) {
			throw new BadRequestException(
				"자기 자신을 상위 폴더로 설정할 수 없습니다",
			);
		}

		const currentPathPrefix = `${currentFolder.path}/`;
		const subtreeFolders = allFolders.filter(
			(folder) =>
				folder.id === currentFolder.id ||
				folder.path.startsWith(currentPathPrefix),
		);
		const subtreeFolderIds = new Set(subtreeFolders.map((folder) => folder.id));

		const nextParentFolder = nextParentFolderId
			? (allFolders.find((folder) => folder.id === nextParentFolderId) ?? null)
			: null;

		if (nextParentFolderId && !nextParentFolder) {
			throw new NotFoundException("상위 폴더를 찾을 수 없습니다");
		}

		if (nextParentFolder && subtreeFolderIds.has(nextParentFolder.id)) {
			throw new BadRequestException(
				"하위 폴더를 상위 폴더로 설정할 수 없습니다",
			);
		}

		const nextPath = nextParentFolder
			? `${nextParentFolder.path}/${nextName}`
			: `/${nextName}`;
		const nextPathPrefix = `${nextPath}/`;
		const rewrittenPaths = subtreeFolders.map((folder) => ({
			id: folder.id,
			path:
				folder.id === currentFolder.id
					? nextPath
					: folder.path.replace(currentPathPrefix, nextPathPrefix),
		}));

		for (const rewrittenPath of rewrittenPaths) {
			const existingFolder = await this.foldersRepository.findByPath(
				rewrittenPath.path,
			);
			if (existingFolder && !subtreeFolderIds.has(existingFolder.id)) {
				throw new ConflictException(
					`이미 존재하는 폴더 경로입니다: ${rewrittenPath.path}`,
				);
			}
		}

		const nextSortOrder =
			nextParentFolderId !== currentFolder.parentFolderId
				? this.getNextSortOrder(
						allFolders.filter(
							(folder) =>
								folder.parentFolderId === nextParentFolderId &&
								folder.id !== currentFolder.id,
						),
					)
				: currentFolder.sortOrder;

		const updatedFolder = await this.foldersRepository.updateById(folderId, {
			name: nextName,
			parentFolderId: nextParentFolderId,
			path: nextPath,
			sortOrder: nextSortOrder,
		});

		for (const rewrittenPath of rewrittenPaths) {
			if (rewrittenPath.id === currentFolder.id) {
				continue;
			}

			await this.foldersRepository.updateById(rewrittenPath.id, {
				path: rewrittenPath.path,
			});
		}

		return updatedFolder;
	}

	async deleteFolder(folderId: string): Promise<void> {
		const folder = await this.foldersRepository.findByIdWithChildren(folderId);
		const spaceId = this.getRequiredSpaceId();

		if (!folder || folder.tenant?.spaceId !== spaceId || folder.removedAt) {
			throw new NotFoundException("폴더를 찾을 수 없습니다");
		}

		if ((folder.children ?? []).some((childFolder) => !childFolder.removedAt)) {
			throw new BadRequestException("하위 폴더가 남아 있어 삭제할 수 없습니다");
		}

		if ((folder.assets ?? []).some((asset) => !asset.removedAt)) {
			throw new BadRequestException("에셋이 남아 있어 삭제할 수 없습니다");
		}

		await this.foldersRepository.removeById(folderId);
	}

	private getRequiredSpaceId(): string {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new BadRequestException(
				"x-tenant-id 헤더가 필요합니다. Space를 선택해주세요.",
			);
		}

		return spaceId;
	}

	private getRequiredTenantId(): string {
		const tenantId = this.spaceContext.tenantId;
		if (!tenantId) {
			throw new BadRequestException(
				"x-tenant-id 헤더가 필요합니다. Tenant를 선택해주세요.",
			);
		}

		return tenantId;
	}

	private applySpaceScope(
		where: Prisma.FolderWhereInput,
		spaceIds?: string[],
	): Prisma.FolderWhereInput {
		if (spaceIds === undefined) {
			return where;
		}

		return {
			...where,
			tenant: { spaceId: { in: spaceIds } },
		};
	}

	private getNextSortOrder(folders: Folder[]): number {
		return folders.length > 0
			? Math.max(...folders.map((folder) => folder.sortOrder)) + 1
			: 0;
	}
}
