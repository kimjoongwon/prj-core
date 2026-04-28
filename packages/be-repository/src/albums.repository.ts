import { Album } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class AlbumsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("AlbumsRepository");
	}

	async findById(id: string): Promise<Album | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.album.findUnique({ where: { id } });

		return result ? plainToInstance(Album, result) : null;
	}

	async findByIdWithEntries(id: string): Promise<Album | null> {
		this.logger.debug(`항목 포함 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.album.findUnique({
			where: { id },
			include: {
				entries: {
					orderBy: { position: "asc" },
				},
				coverAsset: true,
			},
		});

		return result ? plainToInstance(Album, result) : null;
	}

	async findBySpaceId(spaceId: string): Promise<Album[]> {
		this.logger.debug(`Space별 앨범 조회: ${spaceId.slice(-8)}`);

		const result = await this.txHost.tx.album.findMany({
			where: { spaceId },
			orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
		});

		return result.map((item) => plainToInstance(Album, item));
	}

	async findMany(params: {
		where?: Prisma.AlbumWhereInput;
		orderBy?: Prisma.AlbumOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ albums: Album[]; totalCount: number }> {
		const { where, orderBy, skip, take } = params;
		const [albums, totalCount] = await Promise.all([
			this.txHost.tx.album.findMany({
				where,
				orderBy: orderBy ?? [{ createdAt: "desc" }],
				skip,
				take,
			}),
			this.txHost.tx.album.count({ where }),
		]);

		return {
			albums: albums.map((item) => plainToInstance(Album, item)),
			totalCount,
		};
	}

	async create(data: Prisma.AlbumUncheckedCreateInput): Promise<Album> {
		this.logger.debug(`앨범 생성: ${data.name}`);

		const result = await this.txHost.tx.album.create({ data });

		return plainToInstance(Album, result);
	}

	async updateById(
		id: string,
		data: Prisma.AlbumUncheckedUpdateInput,
	): Promise<Album> {
		this.logger.debug(`앨범 수정: ${id.slice(-8)}`);

		const result = await this.txHost.tx.album.update({
			where: { id },
			data,
		});

		return plainToInstance(Album, result);
	}

	async removeById(id: string): Promise<Album> {
		this.logger.debug(`앨범 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.album.delete({ where: { id } });

		return plainToInstance(Album, result);
	}

	async countBySpaceId(spaceId: string): Promise<number> {
		return this.txHost.tx.album.count({
			where: { spaceId },
		});
	}
}
