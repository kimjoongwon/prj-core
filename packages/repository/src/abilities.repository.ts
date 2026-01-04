import { Ability } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

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
	 * 모든 Ability 조회 (Role, Subject 포함)
	 */
	async findAllWithRoleAndSubject(): Promise<Ability[]> {
		this.logger.debug("모든 Ability 조회");

		const results = await this.txHost.tx.ability.findMany({
			where: { removedAt: null },
			include: {
				role: true,
				subject: true,
			},
			orderBy: { createdAt: "desc" },
		});

		return results.map((result) => plainToInstance(Ability, result));
	}

	/**
	 * ID로 조회 (Role, Subject 포함)
	 */
	async findByIdWithRoleAndSubject(id: string): Promise<Ability | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.ability.findUnique({
			where: { id },
			include: {
				role: true,
				subject: true,
			},
		});

		return result ? plainToInstance(Ability, result) : null;
	}

	/**
	 * Role ID로 Ability 목록 조회 (Role, Subject 관계 포함)
	 */
	async findManyByRoleIdWithRoleAndSubject(roleId: string): Promise<Ability[]> {
		this.logger.debug(`Role ID로 Ability 조회: roleId=${roleId.slice(-8)}`);

		const results = await this.txHost.tx.ability.findMany({
			where: {
				roleId,
				removedAt: null,
			},
			include: {
				role: true,
				subject: {
					include: {
						parent: true,
						children: {
							where: { removedAt: null },
						},
					},
				},
			},
			orderBy: { createdAt: "desc" },
		});

		return results.map((result) => plainToInstance(Ability, result));
	}

	/**
	 * 여러 Role ID로 활성화된 Ability 목록 조회 (Role, Subject 관계 포함)
	 */
	async findManyActiveByRoleIdsWithRoleAndSubject(
		roleIds: string[],
	): Promise<Ability[]> {
		this.logger.debug(
			`여러 Role ID로 Ability 조회: roleIds.length=${roleIds.length}`,
		);

		const results = await this.txHost.tx.ability.findMany({
			where: {
				roleId: { in: roleIds },
				removedAt: null,
				isActive: true,
			},
			include: {
				role: true,
				subject: {
					include: {
						parent: true,
						children: {
							where: { removedAt: null },
						},
					},
				},
			},
			orderBy: { createdAt: "desc" },
		});

		return results.map((result) => plainToInstance(Ability, result));
	}

	/**
	 * Subject ID로 Ability 목록 조회 (Role, Subject 포함)
	 */
	async findManyBySubjectIdWithRoleAndSubject(
		subjectId: string,
	): Promise<Ability[]> {
		this.logger.debug(
			`Subject ID로 Ability 조회: subjectId=${subjectId.slice(-8)}`,
		);

		const results = await this.txHost.tx.ability.findMany({
			where: {
				subjectId,
				removedAt: null,
			},
			include: {
				role: true,
				subject: true,
			},
			orderBy: { createdAt: "desc" },
		});

		return results.map((result) => plainToInstance(Ability, result));
	}

	/**
	 * Ability 생성
	 */
	async create(data: Prisma.AbilityUncheckedCreateInput): Promise<Ability> {
		this.logger.debug(
			`Ability 생성: roleId=${data.roleId.slice(-8)}, subjectId=${data.subjectId.slice(-8)}`,
		);

		const result = await this.txHost.tx.ability.create({
			data,
			include: {
				role: true,
				subject: true,
			},
		});

		return plainToInstance(Ability, result);
	}

	/**
	 * Ability 수정
	 */
	async updateById(
		id: string,
		data: Prisma.AbilityUncheckedUpdateInput,
	): Promise<Ability> {
		this.logger.debug(`Ability 수정: id=${id.slice(-8)}`);

		const result = await this.txHost.tx.ability.update({
			where: { id },
			data,
			include: {
				role: true,
				subject: true,
			},
		});

		return plainToInstance(Ability, result);
	}

	/**
	 * Ability 소프트 삭제
	 */
	async removeById(id: string): Promise<Ability> {
		this.logger.debug(`Ability 소프트 삭제: id=${id.slice(-8)}`);

		const result = await this.txHost.tx.ability.update({
			where: { id },
			data: { removedAt: new Date() },
			include: {
				role: true,
				subject: true,
			},
		});

		return plainToInstance(Ability, result);
	}

	/**
	 * Role의 기존 Ability를 삭제하고 새로 생성 (일괄 교체)
	 */
	async replaceByRoleId(
		roleId: string,
		tenantId: string,
		abilities: Prisma.AbilityCreateManyInput[],
	): Promise<Ability[]> {
		this.logger.debug(
			`Ability 일괄 교체: roleId=${roleId.slice(-8)}, count=${abilities.length}`,
		);

		// 기존 Ability 소프트 삭제
		await this.txHost.tx.ability.updateMany({
			where: {
				roleId,
				removedAt: null,
			},
			data: {
				removedAt: new Date(),
			},
		});

		// 새 Ability 생성
		const createData = abilities.map((ability) => ({
			...ability,
			roleId,
			tenantId,
			isActive: ability.isActive ?? true,
		}));

		// createMany는 관계를 포함하지 않으므로, 개별 생성 후 조회
		const results: Ability[] = [];
		for (const data of createData) {
			const result = await this.txHost.tx.ability.create({
				data,
				include: {
					role: true,
					subject: true,
				},
			});
			results.push(plainToInstance(Ability, result));
		}

		return results;
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
