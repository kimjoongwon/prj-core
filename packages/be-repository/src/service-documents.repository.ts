import { ServiceDocument } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class ServiceDocumentsRepository {
	private readonly logger = new Logger(ServiceDocumentsRepository.name);

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	async findById(id: bigint): Promise<ServiceDocument | null> {
		this.logger.debug(`서비스 문서 ID 조회: ${id.toString()}`);

		const result = await this.txHost.tx.serviceDocument.findFirst({
			where: { id, removedAt: null },
		});

		return result ? toDomainEntity(ServiceDocument, result) : null;
	}

	async findByIdOrThrow(id: bigint): Promise<ServiceDocument> {
		const result = await this.findById(id);
		if (!result) {
			throw new Error(`ServiceDocument not found: ${id.toString()}`);
		}
		return result;
	}

	async findByIdentity(params: {
		kind: Prisma.ServiceDocumentCreateInput["kind"];
		platform: Prisma.ServiceDocumentCreateInput["platform"];
		locale: string;
		version: string;
	}): Promise<ServiceDocument | null> {
		const result = await this.txHost.tx.serviceDocument.findFirst({
			where: {
				kind: params.kind,
				platform: params.platform,
				locale: params.locale,
				version: params.version,
				removedAt: null,
			},
		});

		return result ? toDomainEntity(ServiceDocument, result) : null;
	}

	async findMany(params: {
		where: Prisma.ServiceDocumentWhereInput;
		orderBy: Prisma.ServiceDocumentOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ data: ServiceDocument[]; totalCount: number }> {
		const notRemoved: Prisma.ServiceDocumentWhereInput = {
			...params.where,
			removedAt: null,
		};

		const [data, totalCount] = await Promise.all([
			this.txHost.tx.serviceDocument.findMany({
				where: notRemoved,
				orderBy: params.orderBy,
				skip: params.skip,
				take: params.take,
			}),
			this.txHost.tx.serviceDocument.count({ where: notRemoved }),
		]);

		return {
			data: data.map((item) => toDomainEntity(ServiceDocument, item)),
			totalCount,
		};
	}

	async create(
		data: Prisma.ServiceDocumentUncheckedCreateInput,
	): Promise<ServiceDocument> {
		const result = await this.txHost.tx.serviceDocument.create({ data });

		return toDomainEntity(ServiceDocument, result);
	}

	async updateById(
		id: bigint,
		data: Prisma.ServiceDocumentUncheckedUpdateInput,
	): Promise<ServiceDocument> {
		const result = await this.txHost.tx.serviceDocument.update({
			where: { id },
			data,
		});

		return toDomainEntity(ServiceDocument, result);
	}

	async publishById(id: bigint): Promise<ServiceDocument> {
		const target = await this.txHost.tx.serviceDocument.findUniqueOrThrow({
			where: { id },
		});
		const publishedAt = new Date();

		await this.txHost.tx.serviceDocument.updateMany({
			where: {
				id: { not: id },
				kind: target.kind,
				platform: target.platform,
				locale: target.locale,
				status: "PUBLISHED",
				removedAt: null,
			},
			data: { status: "ARCHIVED" },
		});

		const result = await this.txHost.tx.serviceDocument.update({
			where: { id },
			data: { status: "PUBLISHED", publishedAt },
		});

		return toDomainEntity(ServiceDocument, result);
	}

	async archiveById(id: bigint): Promise<ServiceDocument> {
		const result = await this.txHost.tx.serviceDocument.update({
			where: { id },
			data: { status: "ARCHIVED" },
		});

		return toDomainEntity(ServiceDocument, result);
	}

	async removeById(id: bigint): Promise<ServiceDocument> {
		const result = await this.txHost.tx.serviceDocument.update({
			where: { id },
			data: { removedAt: new Date(), status: "ARCHIVED" },
		});

		return toDomainEntity(ServiceDocument, result);
	}
}
