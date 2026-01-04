import { ColumnDefinition } from "@cocrepo/entity";
import type { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import type { TransactionHost } from "@nestjs-cls/transactional";
import type { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

export type CreateColumnDefinitionParams =
	Prisma.ColumnDefinitionUncheckedCreateInput;
export type UpdateColumnDefinitionParams =
	Prisma.ColumnDefinitionUncheckedUpdateInput;

@Injectable()
export class ColumnDefinitionsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("ColumnDefinitionsRepository");
	}

	/**
	 * 엔티티의 컬럼 정의 조회 (Space별)
	 */
	async findByEntity(
		entity: string,
		spaceId: string,
	): Promise<ColumnDefinition[]> {
		this.logger.debug(
			`엔티티의 컬럼 정의 조회: entity=${entity}, spaceId=${spaceId.slice(-8)}`,
		);

		const results = await this.txHost.tx.columnDefinition.findMany({
			where: {
				entity,
				spaceId,
				removedAt: null,
			},
			include: {
				subject: true,
			},
			orderBy: { sortOrder: "asc" },
		});

		return results.map((result) => plainToInstance(ColumnDefinition, result));
	}

	/**
	 * 특정 컬럼 정의 조회
	 */
	async findById(id: string): Promise<ColumnDefinition | null> {
		this.logger.debug(`컬럼 정의 조회: id=${id.slice(-8)}`);

		const result = await this.txHost.tx.columnDefinition.findUnique({
			where: { id },
			include: {
				space: true,
				subject: true,
			},
		});

		return result ? plainToInstance(ColumnDefinition, result) : null;
	}

	/**
	 * 컬럼 정의 생성
	 */
	async create(
		data: Prisma.ColumnDefinitionUncheckedCreateInput,
	): Promise<ColumnDefinition> {
		this.logger.debug(
			`컬럼 정의 생성: entity=${data.entity}, field=${data.field}`,
		);

		const result = await this.txHost.tx.columnDefinition.create({
			data,
			include: {
				space: true,
				subject: true,
			},
		});

		return plainToInstance(ColumnDefinition, result);
	}

	/**
	 * 컬럼 정의 수정
	 */
	async update(
		id: string,
		data: Prisma.ColumnDefinitionUncheckedUpdateInput,
	): Promise<ColumnDefinition> {
		this.logger.debug(`컬럼 정의 수정: id=${id.slice(-8)}`);

		const result = await this.txHost.tx.columnDefinition.update({
			where: { id },
			data,
			include: {
				space: true,
				subject: true,
			},
		});

		return plainToInstance(ColumnDefinition, result);
	}

	/**
	 * 컬럼 정의 삭제 (Soft Delete)
	 */
	async softDelete(id: string): Promise<ColumnDefinition> {
		this.logger.debug(`컬럼 정의 소프트 삭제: id=${id.slice(-8)}`);

		const result = await this.txHost.tx.columnDefinition.update({
			where: { id },
			data: { removedAt: new Date() },
			include: {
				space: true,
				subject: true,
			},
		});

		return plainToInstance(ColumnDefinition, result);
	}

	/**
	 * 다중 컬럼 정의 생성 (Bulk Insert)
	 */
	async createMany(
		data: Prisma.ColumnDefinitionCreateManyInput[],
	): Promise<number> {
		this.logger.debug(`다중 컬럼 정의 생성: count=${data.length}`);

		const result = await this.txHost.tx.columnDefinition.createMany({
			data,
			skipDuplicates: true,
		});

		return result.count;
	}

	/**
	 * Space의 모든 엔티티 조회
	 */
	async findEntitiesBySpace(spaceId: string): Promise<string[]> {
		this.logger.debug(`Space의 모든 엔티티 조회: spaceId=${spaceId.slice(-8)}`);

		const results = await this.txHost.tx.columnDefinition.findMany({
			where: {
				spaceId,
				removedAt: null,
			},
			select: {
				entity: true,
			},
			distinct: ["entity"],
			orderBy: {
				entity: "asc",
			},
		});

		return results.map((result) => result.entity);
	}
}
