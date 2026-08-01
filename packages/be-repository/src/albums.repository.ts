import { Album } from "@cocrepo/entity";
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

		const result = await this.txHost.tx.album.findUnique({
			where: { id },
			include: { space: true, coverAsset: true, createdBy: true },
		});

		return result ? toDomainEntity(Album, result) : null;
	}

	async findByIdWithEntries(id: string): Promise<Album | null> {
		this.logger.debug(`항목 포함 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.album.findUnique({
			where: { id },
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

	async findBySpaceId(spaceId: string): Promise<Album[]> {
		this.logger.debug(`Space별 앨범 조회: ${spaceId.slice(-8)}`);

		const result = await this.txHost.tx.album.findMany({
			where: { space: { id: spaceId } },
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
		data: PublicIdCreateInput<
			Prisma.AlbumUncheckedCreateInput,
			"space",
			"coverAsset" | "createdBy"
		>,
	): Promise<Album> {
		this.logger.debug(`앨범 생성: ${data.name}`);

		const { spaceId, coverAssetId, createdById, ...albumData } = data;
		const result = await this.txHost.tx.album.create({
			data: {
				...albumData,
				space: { connect: { id: spaceId } },
				...(coverAssetId
					? { coverAsset: { connect: { id: coverAssetId } } }
					: {}),
				...(createdById ? { createdBy: { connect: { id: createdById } } } : {}),
			},
			include: { space: true, coverAsset: true, createdBy: true },
		});

		return toDomainEntity(Album, result);
	}

	async updateById(
		id: string,
		data: PublicIdUpdateInput<
			Prisma.AlbumUncheckedUpdateInput,
			"space",
			"coverAsset" | "createdBy"
		>,
	): Promise<Album> {
		this.logger.debug(`앨범 수정: ${id.slice(-8)}`);

		const { spaceId, coverAssetId, createdById, ...albumData } = data;
		const result = await this.txHost.tx.album.update({
			where: { id },
			data: {
				...albumData,
				...(spaceId !== undefined
					? { space: { connect: { id: spaceId } } }
					: {}),
				...(coverAssetId !== undefined
					? coverAssetId === null
						? { coverAsset: { disconnect: true } }
						: { coverAsset: { connect: { id: coverAssetId } } }
					: {}),
				...(createdById !== undefined
					? createdById === null
						? { createdBy: { disconnect: true } }
						: { createdBy: { connect: { id: createdById } } }
					: {}),
			},
			include: { space: true, coverAsset: true, createdBy: true },
		});

		return toDomainEntity(Album, result);
	}

	async removeById(id: string): Promise<Album> {
		this.logger.debug(`앨범 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.album.delete({
			where: { id },
			include: { space: true, coverAsset: true, createdBy: true },
		});

		return toDomainEntity(Album, result);
	}

	async countBySpaceId(spaceId: string): Promise<number> {
		return this.txHost.tx.album.count({
			where: { space: { id: spaceId } },
		});
	}
}
