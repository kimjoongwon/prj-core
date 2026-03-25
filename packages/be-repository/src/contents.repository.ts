import { Content, Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";

@Injectable()
export class ContentsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("ContentsRepository");
	}

	async findById(id: string): Promise<Content | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.content.findUnique({ where: { id } });

		return result;
	}

	async findByIdWithPost(id: string): Promise<Content | null> {
		this.logger.debug(`게시글 포함 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.content.findUnique({
			where: { id },
			include: {
				post: true,
				space: true,
				creator: true,
			},
		});

		return result;
	}

	async findBySpaceId(spaceId: string): Promise<Content[]> {
		this.logger.debug(`Space별 콘텐츠 조회: ${spaceId.slice(-8)}`);

		return this.txHost.tx.content.findMany({
			where: { spaceId },
			orderBy: [{ createdAt: "desc" }],
		});
	}

	async findBySpaceIdWithoutRemoved(spaceId: string): Promise<Content[]> {
		this.logger.debug(
			`삭제되지 않은 Space별 콘텐츠 조회: ${spaceId.slice(-8)}`,
		);

		return this.txHost.tx.content.findMany({
			where: { spaceId, removedAt: null },
			orderBy: [{ createdAt: "desc" }],
		});
	}

	async findMany(params: {
		where?: Prisma.ContentWhereInput;
		orderBy?: Prisma.ContentOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: Content[]; totalCount: number }> {
		const { where, orderBy, skip, take } = params;
		const [items, totalCount] = await Promise.all([
			this.txHost.tx.content.findMany({
				where,
				orderBy: orderBy ?? [{ createdAt: "desc" }],
				skip,
				take,
			}),
			this.txHost.tx.content.count({ where }),
		]);

		return { items, totalCount };
	}

	async create(data: Prisma.ContentUncheckedCreateInput): Promise<Content> {
		this.logger.debug("콘텐츠 생성");

		return this.txHost.tx.content.create({ data });
	}

	async updateById(
		id: string,
		data: Prisma.ContentUncheckedUpdateInput,
	): Promise<Content> {
		this.logger.debug(`콘텐츠 수정: ${id.slice(-8)}`);

		return this.txHost.tx.content.update({
			where: { id },
			data,
		});
	}

	async removeById(id: string): Promise<Content> {
		this.logger.debug(`콘텐츠 삭제: ${id.slice(-8)}`);

		return this.txHost.tx.content.delete({
			where: { id },
		});
	}
}
