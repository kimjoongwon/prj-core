import { Ability } from "@cocrepo/entity";
import {
	AbilityActions,
	AbilityTypes,
	Prisma,
	PrismaClient,
} from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

/**
 * Ability 생성 파라미터
 */
export interface CreateAbilityParams {
	type: AbilityTypes;
	action: AbilityActions;
	roleId: string;
	subjectId: string;
	tenantId: string;
	description?: string;
	conditions?: Prisma.InputJsonValue;
	isActive?: boolean;
}

/**
 * Ability 수정 파라미터
 */
export interface UpdateAbilityParams {
	type?: AbilityTypes;
	action?: AbilityActions;
	description?: string;
	conditions?: Prisma.InputJsonValue;
	isActive?: boolean;
}

/**
 * Ability 일괄 생성 DTO
 */
export interface CreateAbilityDto {
	type: AbilityTypes;
	action: AbilityActions;
	subjectId: string;
	description?: string;
	conditions?: Prisma.InputJsonValue;
	isActive?: boolean;
}

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
	 * 모든 Ability 조회
	 */
	async findAll(): Promise<Ability[]> {
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
	 * ID로 조회
	 */
	async findById(id: string): Promise<Ability | null> {
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
	 * Role별 Ability 조회 (Subject 관계 포함)
	 */
	async findByRoleId(roleId: string): Promise<Ability[]> {
		this.logger.debug(`Role별 Ability 조회: roleId=${roleId.slice(-8)}`);

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
	 * 여러 Role의 Ability 조회
	 */
	async findByRoleIds(roleIds: string[]): Promise<Ability[]> {
		this.logger.debug(
			`여러 Role의 Ability 조회: roleIds.length=${roleIds.length}`,
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
	 * Subject별 Ability 조회
	 */
	async findBySubjectId(subjectId: string): Promise<Ability[]> {
		this.logger.debug(
			`Subject별 Ability 조회: subjectId=${subjectId.slice(-8)}`,
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
	async create(data: CreateAbilityParams): Promise<Ability> {
		this.logger.debug(
			`Ability 생성: roleId=${data.roleId.slice(-8)}, subjectId=${data.subjectId.slice(-8)}`,
		);

		const result = await this.txHost.tx.ability.create({
			data: {
				type: data.type,
				action: data.action,
				roleId: data.roleId,
				subjectId: data.subjectId,
				tenantId: data.tenantId,
				description: data.description,
				conditions: data.conditions as any,
				isActive: data.isActive ?? true,
			},
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
	async update(id: string, data: UpdateAbilityParams): Promise<Ability> {
		this.logger.debug(`Ability 수정: id=${id.slice(-8)}`);

		const result = await this.txHost.tx.ability.update({
			where: { id },
			data: {
				type: data.type,
				action: data.action,
				description: data.description,
				conditions: data.conditions as any,
				isActive: data.isActive,
			},
			include: {
				role: true,
				subject: true,
			},
		});

		return plainToInstance(Ability, result);
	}

	/**
	 * Ability 삭제 (Soft Delete)
	 */
	async delete(id: string): Promise<Ability> {
		this.logger.debug(`Ability 삭제: id=${id.slice(-8)}`);

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
	 * 트랜잭션 기반 일괄 업데이트
	 * 기존 Ability 삭제 후 새로 생성
	 */
	async upsertMany(
		roleId: string,
		tenantId: string,
		abilities: CreateAbilityDto[],
	): Promise<Ability[]> {
		this.logger.debug(
			`Ability 일괄 업데이트: roleId=${roleId.slice(-8)}, count=${abilities.length}`,
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
			type: ability.type,
			action: ability.action,
			roleId,
			subjectId: ability.subjectId,
			tenantId,
			description: ability.description,
			conditions: ability.conditions,
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
}
