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
	 * 모든 Ability 조회 (Role 포함)
	 */
	async findAllWithRole(): Promise<Ability[]> {
		this.logger.debug("모든 Ability 조회");

		const results = await this.txHost.tx.ability.findMany({
			where: { removedAt: null },
			include: {
				role: true,
				user: true,
			},
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return results.map((result) => plainToInstance(Ability, result));
	}

	/**
	 * ID로 조회 (Role 포함)
	 */
	async findByIdWithRole(id: string): Promise<Ability | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.ability.findUnique({
			where: { id },
			include: {
				role: true,
				user: true,
			},
		});

		return result ? plainToInstance(Ability, result) : null;
	}

	/**
	 * Role ID로 활성화된 Ability 목록 조회
	 */
	async findActiveByRoleId(roleId: string): Promise<Ability[]> {
		this.logger.debug(`Role ID로 Ability 조회: roleId=${roleId.slice(-8)}`);

		const results = await this.txHost.tx.ability.findMany({
			where: {
				roleId,
				removedAt: null,
				isActive: true,
			},
			include: {
				role: true,
			},
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return results.map((result) => plainToInstance(Ability, result));
	}

	/**
	 * User ID로 활성화된 Ability 목록 조회 (예외 권한)
	 */
	async findActiveByUserId(userId: string): Promise<Ability[]> {
		this.logger.debug(`User ID로 Ability 조회: userId=${userId.slice(-8)}`);

		const results = await this.txHost.tx.ability.findMany({
			where: {
				userId,
				removedAt: null,
				isActive: true,
			},
			include: {
				user: true,
			},
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return results.map((result) => plainToInstance(Ability, result));
	}

	/**
	 * 여러 Role ID로 활성화된 Ability 목록 조회
	 */
	async findActiveByRoleIds(roleIds: string[]): Promise<Ability[]> {
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
			},
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return results.map((result) => plainToInstance(Ability, result));
	}

	/**
	 * Subject로 Ability 목록 조회
	 */
	async findBySubject(subject: string): Promise<Ability[]> {
		this.logger.debug(`Subject로 Ability 조회: subject=${subject}`);

		const results = await this.txHost.tx.ability.findMany({
			where: {
				subject,
				removedAt: null,
			},
			include: {
				role: true,
				user: true,
			},
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return results.map((result) => plainToInstance(Ability, result));
	}

	/**
	 * Ability 생성
	 */
	async create(data: Prisma.AbilityUncheckedCreateInput): Promise<Ability> {
		this.logger.debug(
			`Ability 생성: subject=${data.subject}, action=${data.action}`,
		);

		const result = await this.txHost.tx.ability.create({
			data,
			include: {
				role: true,
				user: true,
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
				user: true,
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
				user: true,
			},
		});

		return plainToInstance(Ability, result);
	}

	/**
	 * Role의 기존 Ability를 삭제하고 새로 생성 (일괄 교체)
	 */
	async replaceByRoleId(
		roleId: string,
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
			isActive: ability.isActive ?? true,
		}));

		// createMany는 관계를 포함하지 않으므로, 개별 생성 후 조회
		const results: Ability[] = [];
		for (const data of createData) {
			const result = await this.txHost.tx.ability.create({
				data,
				include: {
					role: true,
				},
			});
			results.push(plainToInstance(Ability, result));
		}

		return results;
	}

	/**
	 * User의 기존 예외 Ability를 삭제하고 새로 생성 (일괄 교체)
	 */
	async replaceByUserId(
		userId: string,
		abilities: Prisma.AbilityCreateManyInput[],
	): Promise<Ability[]> {
		this.logger.debug(
			`User 예외 Ability 일괄 교체: userId=${userId.slice(-8)}, count=${abilities.length}`,
		);

		// 기존 Ability 소프트 삭제
		await this.txHost.tx.ability.updateMany({
			where: {
				userId,
				removedAt: null,
			},
			data: {
				removedAt: new Date(),
			},
		});

		// 새 Ability 생성
		const createData = abilities.map((ability) => ({
			...ability,
			userId,
			isActive: ability.isActive ?? true,
		}));

		const results: Ability[] = [];
		for (const data of createData) {
			const result = await this.txHost.tx.ability.create({
				data,
				include: {
					user: true,
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
