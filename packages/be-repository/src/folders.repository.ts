import { Folder } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type {
	PublicIdCreateInput,
	PublicIdUpdateInput,
} from "./public-id-input.type";
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class FoldersRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("FoldersRepository");
	}

	async findById(id: string): Promise<Folder | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.folder.findUnique({
			where: { id },
			include: { space: true, parent: true, createdBy: true },
		});

		return result ? toDomainEntity(Folder, result) : null;
	}

	async findByIdWithChildren(id: string): Promise<Folder | null> {
		this.logger.debug(`하위폴더 포함 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.folder.findUnique({
			where: { id },
			include: {
				space: true,
				parent: true,
				createdBy: true,
				children: {
					orderBy: { sortOrder: "asc" },
					include: { space: true, parent: true, createdBy: true },
				},
				assets: {
					include: { space: true, folder: true, createdBy: true },
				},
			},
		});

		return result ? toDomainEntity(Folder, result) : null;
	}

	async findByPath(path: string): Promise<Folder | null> {
		this.logger.debug(`경로로 조회: ${path}`);

		const result = await this.txHost.tx.folder.findUnique({
			where: { path },
			include: { space: true, parent: true, createdBy: true },
		});

		return result ? toDomainEntity(Folder, result) : null;
	}

	async findBySpaceId(spaceId: string): Promise<Folder[]> {
		this.logger.debug(`Space별 폴더 조회: ${spaceId.slice(-8)}`);

		const result = await this.txHost.tx.folder.findMany({
			where: { space: { id: spaceId } },
			include: { space: true, parent: true, createdBy: true },
			orderBy: [{ path: "asc" }],
		});

		return result.map((item) => toDomainEntity(Folder, item));
	}

	async findByParentFolderId(parentFolderId: string | null): Promise<Folder[]> {
		this.logger.debug(
			`상위 폴더 기준 조회: ${parentFolderId ? parentFolderId.slice(-8) : "root"}`,
		);

		const result = await this.txHost.tx.folder.findMany({
			where: {
				parent: parentFolderId ? { id: parentFolderId } : null,
			},
			include: { space: true, parent: true, createdBy: true },
			orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
		});

		return result.map((item) => toDomainEntity(Folder, item));
	}

	async findMany(params: {
		where?: Prisma.FolderWhereInput;
		orderBy?: Prisma.FolderOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ folders: Folder[]; totalCount: number }> {
		const [folders, totalCount] = await Promise.all([
			this.txHost.tx.folder.findMany({
				where: params.where,
				orderBy: params.orderBy ?? [{ path: "asc" }],
				skip: params.skip,
				take: params.take,
				include: { space: true, parent: true, createdBy: true },
			}),
			this.txHost.tx.folder.count({ where: params.where }),
		]);

		return {
			folders: folders.map((item) => toDomainEntity(Folder, item)),
			totalCount,
		};
	}

	async create(
		data: PublicIdCreateInput<
			Prisma.FolderUncheckedCreateInput,
			"space",
			"parentFolder" | "createdBy"
		>,
	): Promise<Folder> {
		this.logger.debug(`폴더 생성: ${data.name}`);

		const { spaceId, parentFolderId, createdById, ...folderData } = data;
		const result = await this.txHost.tx.folder.create({
			data: {
				...folderData,
				space: { connect: { id: spaceId } },
				...(parentFolderId
					? { parent: { connect: { id: parentFolderId } } }
					: {}),
				...(createdById ? { createdBy: { connect: { id: createdById } } } : {}),
			},
			include: { space: true, parent: true, createdBy: true },
		});

		return toDomainEntity(Folder, result);
	}

	async updateById(
		id: string,
		data: PublicIdUpdateInput<
			Prisma.FolderUncheckedUpdateInput,
			"space",
			"parentFolder" | "createdBy"
		>,
	): Promise<Folder> {
		this.logger.debug(`폴더 수정: ${id.slice(-8)}`);

		const { spaceId, parentFolderId, createdById, ...folderData } = data;
		const result = await this.txHost.tx.folder.update({
			where: { id },
			data: {
				...folderData,
				...(spaceId !== undefined
					? { space: { connect: { id: spaceId } } }
					: {}),
				...(parentFolderId !== undefined
					? parentFolderId === null
						? { parent: { disconnect: true } }
						: { parent: { connect: { id: parentFolderId } } }
					: {}),
				...(createdById !== undefined
					? createdById === null
						? { createdBy: { disconnect: true } }
						: { createdBy: { connect: { id: createdById } } }
					: {}),
			},
			include: { space: true, parent: true, createdBy: true },
		});

		return toDomainEntity(Folder, result);
	}

	async removeById(id: string): Promise<Folder> {
		this.logger.debug(`폴더 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.folder.delete({
			where: { id },
			include: { space: true, parent: true, createdBy: true },
		});

		return toDomainEntity(Folder, result);
	}
}
