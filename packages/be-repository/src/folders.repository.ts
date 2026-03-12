import { Folder } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

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

		const result = await this.txHost.tx.folder.findUnique({ where: { id } });

		return result ? plainToInstance(Folder, result) : null;
	}

	async findByIdWithChildren(id: string): Promise<Folder | null> {
		this.logger.debug(`하위폴더 포함 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.folder.findUnique({
			where: { id },
			include: {
				children: {
					orderBy: { sortOrder: "asc" },
				},
				assets: true,
			},
		});

		return result ? plainToInstance(Folder, result) : null;
	}

	async findByPath(path: string): Promise<Folder | null> {
		this.logger.debug(`경로로 조회: ${path}`);

		const result = await this.txHost.tx.folder.findUnique({ where: { path } });

		return result ? plainToInstance(Folder, result) : null;
	}

	async findBySpaceId(spaceId: string): Promise<Folder[]> {
		this.logger.debug(`Space별 폴더 조회: ${spaceId.slice(-8)}`);

		const result = await this.txHost.tx.folder.findMany({
			where: { spaceId },
			orderBy: [{ path: "asc" }],
		});

		return result.map((item) => plainToInstance(Folder, item));
	}

	async findByParentFolderId(
		parentFolderId: string | null,
	): Promise<Folder[]> {
		this.logger.debug(
			`상위 폴더 기준 조회: ${parentFolderId ? parentFolderId.slice(-8) : "root"}`,
		);

		const result = await this.txHost.tx.folder.findMany({
			where: { parentFolderId },
			orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
		});

		return result.map((item) => plainToInstance(Folder, item));
	}

	async findMany(params: {
		where?: Prisma.FolderWhereInput;
		orderBy?: Prisma.FolderOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ folders: Folder[]; totalCount: number }> {
		const { where, orderBy, skip, take } = params;

		const [folders, totalCount] = await Promise.all([
			this.txHost.tx.folder.findMany({
				where,
				orderBy: orderBy ?? [{ path: "asc" }],
				skip,
				take,
			}),
			this.txHost.tx.folder.count({ where }),
		]);

		return {
			folders: folders.map((item) => plainToInstance(Folder, item)),
			totalCount,
		};
	}

	async create(data: Prisma.FolderUncheckedCreateInput): Promise<Folder> {
		this.logger.debug(`폴더 생성: ${data.name}`);

		const result = await this.txHost.tx.folder.create({ data });

		return plainToInstance(Folder, result);
	}

	async updateById(
		id: string,
		data: Prisma.FolderUncheckedUpdateInput,
	): Promise<Folder> {
		this.logger.debug(`폴더 수정: ${id.slice(-8)}`);

		const result = await this.txHost.tx.folder.update({
			where: { id },
			data,
		});

		return plainToInstance(Folder, result);
	}

	async removeById(id: string): Promise<Folder> {
		this.logger.debug(`폴더 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.folder.delete({ where: { id } });

		return plainToInstance(Folder, result);
	}
}

