import { Ability } from "@cocrepo/entity";
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
export class AbilitiesRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("AbilitiesRepository");
	}

	/**
	 * 모든 Ability 조회 (Subject, Action 포함)
	 */
	async findAll(): Promise<Ability[]> {
		this.logger.debug("모든 Ability 조회");

		const results = await this.txHost.tx.ability.findMany({
			where: { removedAt: null },
			include: {
				subject: true,
				action: true,
			},
			orderBy: [{ createdAt: "desc" }],
		});

		return results.map((result) => toDomainEntity(Ability, result));
	}

	/**
	 * ID로 조회 (Subject, Action 포함)
	 */
	async findById(id: bigint): Promise<Ability | null> {
		this.logger.debug(`ID로 조회: ${id.toString()}`);

		const result = await this.txHost.tx.ability.findUnique({
			where: { id },
			include: {
				subject: true,
				action: true,
			},
		});

		return result ? toDomainEntity(Ability, result) : null;
	}

	/**
	 * ID 목록으로 Ability 목록 조회 (Subject, Action 포함)
	 */
	async findByIds(ids: bigint[]): Promise<Ability[]> {
		this.logger.debug(`ID 목록으로 조회: ids.length=${ids.length}`);

		const results = await this.txHost.tx.ability.findMany({
			where: {
				id: { in: ids },
				removedAt: null,
			},
			include: {
				subject: true,
				action: true,
			},
			orderBy: [{ createdAt: "desc" }],
		});

		return results.map((result) => toDomainEntity(Ability, result));
	}

	/**
	 * Subject ID로 Ability 목록 조회
	 */
	async findBySubjectId(subjectId: bigint): Promise<Ability[]> {
		this.logger.debug(`Subject ID로 Ability 조회: subjectId=${subjectId}`);

		const results = await this.txHost.tx.ability.findMany({
			where: {
				subjectId,
				removedAt: null,
			},
			include: {
				subject: true,
				action: true,
			},
			orderBy: [{ createdAt: "desc" }],
		});

		return results.map((result) => toDomainEntity(Ability, result));
	}

	/**
	 * Ability 생성
	 */
	async create(
		data: AutoIdentityCreateInput<
			Prisma.AbilityUncheckedCreateInput,
			"abilityId"
		>,
	): Promise<Ability> {
		this.logger.debug(
			`Ability 생성: subjectId=${data.subjectId}, actionId=${data.actionId}`,
		);
		const result = await this.txHost.tx.ability.create({
			data,
			include: {
				subject: true,
				action: true,
			},
		});

		return toDomainEntity(Ability, result);
	}

	/**
	 * Ability 수정
	 */
	async updateById(
		id: bigint,
		data: AutoIdentityUpdateInput<
			Prisma.AbilityUncheckedUpdateInput,
			"abilityId"
		>,
	): Promise<Ability> {
		this.logger.debug(`Ability 수정: id=${id.toString()}`);
		const result = await this.txHost.tx.ability.update({
			where: { id },
			data,
			include: {
				subject: true,
				action: true,
			},
		});

		return toDomainEntity(Ability, result);
	}

	/**
	 * Ability 소프트 삭제
	 */
	async removeById(id: bigint): Promise<Ability> {
		this.logger.debug(`Ability 소프트 삭제: id=${id.toString()}`);

		const result = await this.txHost.tx.ability.update({
			where: { id },
			data: { removedAt: new Date() },
			include: {
				subject: true,
				action: true,
			},
		});

		return toDomainEntity(Ability, result);
	}

	/**
	 * 다중 Ability 생성
	 */
	async createMany(data: Prisma.AbilityCreateManyInput[]): Promise<number> {
		this.logger.debug(`다중 Ability 생성: count=${data.length}`);

		const result = await this.txHost.tx.ability.createMany({
			data,
			skipDuplicates: true,
		});

		return result.count;
	}
}
