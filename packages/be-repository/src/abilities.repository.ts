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
	async findById(id: string): Promise<Ability | null> {
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
	async findByIds(ids: string[]): Promise<Ability[]> {
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
	async findBySubjectId(subjectSeq: bigint): Promise<Ability[]> {
		this.logger.debug(`Subject ID로 Ability 조회: subjectSeq=${subjectSeq}`);

		const results = await this.txHost.tx.ability.findMany({
			where: {
				subjectSeq,
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
			Omit<Prisma.AbilityUncheckedCreateInput, "actionSeq" | "subjectSeq">,
			"id"
		> & { actionId: string; subjectId: string },
	): Promise<Ability> {
		this.logger.debug(
			`Ability 생성: actionId=${data.actionId}, subjectId=${data.subjectId}`,
		);
		const { actionId, subjectId, ...rest } = data;
		const result = await this.txHost.tx.ability.create({
			data: {
				...rest,
				action: { connect: { id: actionId } },
				subject: { connect: { id: subjectId } },
			} as unknown as Prisma.AbilityCreateInput,
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
		id: string,
		data: AutoIdentityUpdateInput<
			Omit<Prisma.AbilityUncheckedUpdateInput, "actionSeq" | "subjectSeq">,
			"id"
		> & {
			actionId?: string;
			subjectId?: string;
		},
	): Promise<Ability> {
		this.logger.debug(`Ability 수정: id=${id}`);
		const { actionId, subjectId, ...rest } = data;
		const result = await this.txHost.tx.ability.update({
			where: { id },
			data: {
				...rest,
				...(actionId !== undefined && {
					action: { connect: { id: actionId } },
				}),
				...(subjectId !== undefined && {
					subject: { connect: { id: subjectId } },
				}),
			} as Prisma.AbilityUpdateInput,
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
	async removeById(id: string): Promise<Ability> {
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
