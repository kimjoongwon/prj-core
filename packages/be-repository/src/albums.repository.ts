import { Album } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type {
	AutoIdentityCreateInput,
	AutoIdentityUpdateInput,
} from "./auto-identity-input.type";
import { toDomainEntity } from "./to-domain-entity";

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

	async findById(id: bigint): Promise<Album | null> {
		this.logger.debug(`ID로 조회: ${id.toString()}`);

		const result = await this.txHost.tx.album.findUnique({
			where: { id },
			include: { space: true, coverAsset: true, createdBy: true },
		});

		return result ? toDomainEntity(Album, result) : null;
	}

	async findByAlbumIdWithEntries(id: string): Promise<Album | null> {
		this.logger.debug(`항목 포함 조회: ${id.toString()}`);

		const result = await this.txHost.tx.album.findUnique({
			where: { albumId: id },
			include: {
				entries: {
					orderBy: { position: "asc" },
					include: {
						space: true,
						createdBy: true,
						album: true,
						asset: true,
					},
				},
				coverAsset: true,
				space: true,
				createdBy: true,
			},
		});

		return result ? toDomainEntity(Album, result) : null;
	}

	async findBySpaceId(spaceId: bigint): Promise<Album[]> {
		this.logger.debug(`Space별 앨범 조회: ${spaceId.toString()}`);

		const result = await this.txHost.tx.album.findMany({
			where: { spaceId },
			include: { space: true, coverAsset: true, createdBy: true },
			orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
		});

		return result.map((item) => toDomainEntity(Album, item));
	}

	async findMany(params: {
		where?: Prisma.AlbumWhereInput;
		orderBy?: Prisma.AlbumOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ albums: Album[]; totalCount: number }> {
		const [albums, totalCount] = await Promise.all([
			this.txHost.tx.album.findMany({
				where: params.where,
				orderBy: params.orderBy ?? [{ createdAt: "desc" }],
				skip: params.skip,
				take: params.take,
				include: { space: true, coverAsset: true, createdBy: true },
			}),
			this.txHost.tx.album.count({ where: params.where }),
		]);

		return {
			albums: albums.map((item) => toDomainEntity(Album, item)),
			totalCount,
		};
	}

	async create(
		data: AutoIdentityCreateInput<Prisma.AlbumUncheckedCreateInput, "albumId">,
	): Promise<Album> {
		this.logger.debug(`앨범 생성: ${data.name}`);
		const result = await this.txHost.tx.album.create({
			data,
			include: { space: true, coverAsset: true, createdBy: true },
		});

		return toDomainEntity(Album, result);
	}

	async updateById(
		id: bigint,
		data: AutoIdentityUpdateInput<Prisma.AlbumUncheckedUpdateInput, "albumId">,
	): Promise<Album> {
		this.logger.debug(`앨범 수정: ${id.toString()}`);
		const result = await this.txHost.tx.album.update({
			where: { id },
			data,
			include: { space: true, coverAsset: true, createdBy: true },
		});

		return toDomainEntity(Album, result);
	}

	async removeById(id: bigint): Promise<Album> {
		this.logger.debug(`앨범 삭제: ${id.toString()}`);

		const result = await this.txHost.tx.album.delete({
			where: { id },
			include: { space: true, coverAsset: true, createdBy: true },
		});

		return toDomainEntity(Album, result);
	}

	async countBySpaceId(spaceId: bigint): Promise<number> {
		return this.txHost.tx.album.count({
			where: { spaceId },
		});
	}
}
