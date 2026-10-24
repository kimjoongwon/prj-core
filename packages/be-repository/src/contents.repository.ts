import type { DomainData } from "@cocrepo/entity";
import { Prisma, PrismaClient, TextTypes } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import type {
	AutoIdentityCreateInput,
	AutoIdentityUpdateInput,
} from "./auto-identity-input.type";
import { toDomainData } from "./to-domain-entity";

const contentInclude = {
	space: true,
	createdBy: true,
} satisfies Prisma.ContentInclude;

type ContentPersistenceRecord = Prisma.ContentGetPayload<{
	include: typeof contentInclude;
}>;

type ContentRecord = DomainData<ContentPersistenceRecord>;

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
		this.logger.debug(`ID로 조회: ${id.toString()}`);

		const result = await this.txHost.tx.content.findUnique({
			where: { id },
			include: contentInclude,
		});

		return result ? toDomainData(result) : null;
	}

	async findByIdWithPost(id: string): Promise<ContentRecord | null> {
		this.logger.debug(`게시글 포함 조회: ${id.toString()}`);

		const result = await this.txHost.tx.content.findUnique({
			where: { id },
			include: {
				post: true,
				...contentInclude,
			},
		});

		return result ? toDomainData(result) : null;
	}

	async findBySpaceId(spaceSeq: bigint): Promise<ContentRecord[]> {
		this.logger.debug(`Space별 콘텐츠 조회: ${spaceSeq.toString()}`);

		const results = await this.txHost.tx.content.findMany({
			where: { spaceSeq },
			include: contentInclude,
			orderBy: [{ createdAt: "desc" }],
		});

		return results.map((result) => toDomainData(result));
	}

	async findBySpaceIdWithoutRemoved(spaceSeq: bigint): Promise<ContentRecord[]> {
		this.logger.debug(
			`삭제되지 않은 Space별 콘텐츠 조회: ${spaceSeq.toString()}`,
		);

		const results = await this.txHost.tx.content.findMany({
			where: { spaceSeq, removedAt: null },
			include: contentInclude,
			orderBy: [{ createdAt: "desc" }],
		});

		return results.map((result) => toDomainData(result));
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
				include: contentInclude,
			}),
			this.txHost.tx.content.count({ where: params.where }),
		]);

		return {
			items: items.map((item) => toDomainData(item)),
			totalCount,
		};
	}

	async findCommunityPostsBySpaceId(params: {
		skip?: number;
		spaceSeq: bigint;
		take?: number;
	}): Promise<{ items: CommunityPostRecord[]; totalCount: number }> {
		const where: Prisma.ContentWhereInput = {
			removedAt: null,
			spaceSeq: params.spaceSeq,
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
			items: items.map((item) => toDomainData(item)),
			totalCount,
		};
	}

	async createCommunityPost(params: {
		spaceSeq: bigint;
		text: string;
		title?: string | null;
		userSeq: bigint;
	}): Promise<CommunityPostRecord> {
		this.logger.debug("커뮤니티 게시글 생성");

		const result = await this.txHost.tx.content.create({
			data: {
				createdBySeq: params.userSeq,
				post: {
					create: {},
				},
				spaceSeq: params.spaceSeq,
				text: params.text,
				title: params.title ?? null,
				type: TextTypes.Textarea,
			},
			include: COMMUNITY_POST_INCLUDE,
		});

		return toDomainData(result) as CommunityPostRecord;
	}

	async create(
		data: AutoIdentityCreateInput<
			Prisma.ContentUncheckedCreateInput,
			"id"
		>,
	): Promise<ContentRecord> {
		this.logger.debug("콘텐츠 생성");
		const result = await this.txHost.tx.content.create({
			data,
			include: contentInclude,
		});

		return toDomainData(result);
	}

	async updateById(
		id: string,
		data: AutoIdentityUpdateInput<
			Prisma.ContentUncheckedUpdateInput,
			"id"
		>,
	): Promise<ContentRecord> {
		this.logger.debug(`콘텐츠 수정: ${id.toString()}`);
		const result = await this.txHost.tx.content.update({
			where: { id },
			data,
			include: contentInclude,
		});

		return toDomainData(result);
	}

	async removeById(id: string): Promise<ContentRecord> {
		this.logger.debug(`콘텐츠 삭제: ${id.toString()}`);

		const result = await this.txHost.tx.content.delete({
			where: { id },
			include: contentInclude,
		});

		return toDomainData(result);
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

export type CommunityPostRecord = DomainData<CommunityPostPersistenceRecord>;
