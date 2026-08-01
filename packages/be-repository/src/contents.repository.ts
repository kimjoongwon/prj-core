import type { DomainData } from "@cocrepo/entity";
import { Content, Prisma, PrismaClient, TextTypes } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type {
	PublicIdCreateInput,
	PublicIdUpdateInput,
} from "./public-id-input.type";
import { toDomainData } from "./to-domain-entity";

type ContentRecord = DomainData<Content> & {
	spaceId: string;
	createdById: string | null;
};

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

	async findById(id: string): Promise<ContentRecord | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.content.findUnique({
			where: { id },
			include: { space: true, createdBy: true },
		});

		return result ? (toDomainData(result) as ContentRecord) : null;
	}

	async findByIdWithPost(id: string): Promise<ContentRecord | null> {
		this.logger.debug(`게시글 포함 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.content.findUnique({
			where: { id },
			include: {
				post: true,
				space: true,
				createdBy: true,
			},
		});

		return result ? (toDomainData(result) as ContentRecord) : null;
	}

	async findBySpaceId(spaceId: string): Promise<ContentRecord[]> {
		this.logger.debug(`Space별 콘텐츠 조회: ${spaceId.slice(-8)}`);

		const results = await this.txHost.tx.content.findMany({
			where: { space: { id: spaceId } },
			include: { space: true, createdBy: true },
			orderBy: [{ createdAt: "desc" }],
		});

		return toDomainData(results) as ContentRecord[];
	}

	async findBySpaceIdWithoutRemoved(spaceId: string): Promise<ContentRecord[]> {
		this.logger.debug(
			`삭제되지 않은 Space별 콘텐츠 조회: ${spaceId.slice(-8)}`,
		);

		const results = await this.txHost.tx.content.findMany({
			where: { space: { id: spaceId }, removedAt: null },
			include: { space: true, createdBy: true },
			orderBy: [{ createdAt: "desc" }],
		});

		return toDomainData(results) as ContentRecord[];
	}

	async findMany(params: {
		where?: Prisma.ContentWhereInput;
		orderBy?: Prisma.ContentOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: ContentRecord[]; totalCount: number }> {
		const [items, totalCount] = await Promise.all([
			this.txHost.tx.content.findMany({
				where: params.where,
				orderBy: params.orderBy ?? [{ createdAt: "desc" }],
				skip: params.skip,
				take: params.take,
				include: { space: true, createdBy: true },
			}),
			this.txHost.tx.content.count({ where: params.where }),
		]);

		return {
			items: toDomainData(items) as ContentRecord[],
			totalCount,
		};
	}

	async findCommunityPostsBySpaceId(params: {
		skip?: number;
		spaceId: string;
		take?: number;
	}): Promise<{ items: CommunityPostRecord[]; totalCount: number }> {
		const where: Prisma.ContentWhereInput = {
			removedAt: null,
			space: { id: params.spaceId },
			post: {
				is: {
					removedAt: null,
				},
			},
		};
		const [items, totalCount] = await Promise.all([
			this.txHost.tx.content.findMany({
				where,
				include: COMMUNITY_POST_INCLUDE,
				orderBy: [{ createdAt: "desc" }],
				skip: params.skip,
				take: params.take,
			}),
			this.txHost.tx.content.count({ where }),
		]);

		return {
			items: toDomainData(items) as CommunityPostRecord[],
			totalCount,
		};
	}

	async createCommunityPost(params: {
		spaceId: string;
		text: string;
		title?: string | null;
		userId: string;
	}): Promise<CommunityPostRecord> {
		this.logger.debug("커뮤니티 게시글 생성");

		const result = await this.txHost.tx.content.create({
			data: {
				createdBy: {
					connect: {
						id: params.userId,
					},
				},
				post: {
					create: {},
				},
				space: { connect: { id: params.spaceId } },
				text: params.text,
				title: params.title ?? null,
				type: TextTypes.Textarea,
			},
			include: COMMUNITY_POST_INCLUDE,
		});

		return toDomainData(result) as CommunityPostRecord;
	}

	async create(
		data: PublicIdCreateInput<
			Prisma.ContentUncheckedCreateInput,
			"space",
			"createdBy"
		>,
	): Promise<ContentRecord> {
		this.logger.debug("콘텐츠 생성");

		const { spaceId, createdById, ...contentData } = data;
		const result = await this.txHost.tx.content.create({
			data: {
				...contentData,
				space: { connect: { id: spaceId } },
				...(createdById ? { createdBy: { connect: { id: createdById } } } : {}),
			},
			include: { space: true, createdBy: true },
		});

		return toDomainData(result) as ContentRecord;
	}

	async updateById(
		id: string,
		data: PublicIdUpdateInput<
			Prisma.ContentUncheckedUpdateInput,
			"space",
			"createdBy"
		>,
	): Promise<ContentRecord> {
		this.logger.debug(`콘텐츠 수정: ${id.slice(-8)}`);

		const { spaceId, createdById, ...contentData } = data;
		const result = await this.txHost.tx.content.update({
			where: { id },
			data: {
				...contentData,
				...(spaceId !== undefined
					? { space: { connect: { id: spaceId } } }
					: {}),
				...(createdById !== undefined
					? createdById === null
						? { createdBy: { disconnect: true } }
						: { createdBy: { connect: { id: createdById } } }
					: {}),
			},
			include: { space: true, createdBy: true },
		});

		return toDomainData(result) as ContentRecord;
	}

	async removeById(id: string): Promise<ContentRecord> {
		this.logger.debug(`콘텐츠 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.content.delete({
			where: { id },
			include: { space: true, createdBy: true },
		});

		return toDomainData(result) as ContentRecord;
	}
}

const COMMUNITY_POST_INCLUDE = {
	createdBy: {
		select: {
			id: true,
			name: true,
		},
	},
	post: true,
	space: { select: { id: true } },
} satisfies Prisma.ContentInclude;

type CommunityPostPersistenceRecord = Prisma.ContentGetPayload<{
	include: typeof COMMUNITY_POST_INCLUDE;
}>;

export type CommunityPostRecord = DomainData<CommunityPostPersistenceRecord> & {
	spaceId: string;
	createdById: string | null;
};
