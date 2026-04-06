import { RoleGrant } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class RoleGrantsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("RoleGrantsRepository");
	}

	async findActiveByRoleIds(roleIds: string[]): Promise<RoleGrant[]> {
		this.logger.debug(`RoleGrant 조회: roleIds.length=${roleIds.length}`);

		const results = await this.txHost.tx.roleGrant.findMany({
			where: {
				roleId: { in: roleIds },
				isActive: true,
				removedAt: null,
			},
			include: {
				ability: {
					include: {
						subject: true,
						action: true,
					},
				},
			},
			orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
		});

		return results.map((result) => plainToInstance(RoleGrant, result));
	}

	async createMany(data: Prisma.RoleGrantCreateManyInput[]): Promise<number> {
		this.logger.debug(`RoleGrant 다중 생성: count=${data.length}`);

		const result = await this.txHost.tx.roleGrant.createMany({
			data,
			skipDuplicates: true,
		});

		return result.count;
	}

	async upsertByRoleIdAndAbilityId(
		roleId: string,
		abilityId: string,
		data: Pick<Prisma.RoleGrantUncheckedCreateInput, "isActive" | "priority">,
	): Promise<RoleGrant> {
		this.logger.debug(
			`RoleGrant upsert: roleId=${roleId.slice(-8)}, abilityId=${abilityId.slice(-8)}`,
		);

		const result = await this.txHost.tx.roleGrant.upsert({
			where: {
				roleId_abilityId: {
					roleId,
					abilityId,
				},
			},
			create: {
				roleId,
				abilityId,
				isActive: data.isActive,
				priority: data.priority,
			},
			update: {
				isActive: data.isActive,
				priority: data.priority,
				removedAt: null,
			},
			include: {
				ability: {
					include: {
						subject: true,
						action: true,
					},
				},
			},
		});

		return plainToInstance(RoleGrant, result);
	}

	async updateById(
		id: string,
		data: Prisma.RoleGrantUncheckedUpdateInput,
	): Promise<RoleGrant> {
		this.logger.debug(`RoleGrant 수정: id=${id.slice(-8)}`);

		const result = await this.txHost.tx.roleGrant.update({
			where: { id },
			data,
			include: {
				ability: {
					include: {
						subject: true,
						action: true,
					},
				},
			},
		});

		return plainToInstance(RoleGrant, result);
	}

	async removeById(id: string): Promise<RoleGrant> {
		this.logger.debug(`RoleGrant 소프트 삭제: id=${id.slice(-8)}`);

		const result = await this.txHost.tx.roleGrant.update({
			where: { id },
			data: { removedAt: new Date() },
			include: {
				ability: {
					include: {
						subject: true,
						action: true,
					},
				},
			},
		});

		return plainToInstance(RoleGrant, result);
	}

	async removeByAbilityId(abilityId: string): Promise<number> {
		this.logger.debug(
			`Ability ID로 RoleGrant 소프트 삭제: abilityId=${abilityId.slice(-8)}`,
		);

		const result = await this.txHost.tx.roleGrant.updateMany({
			where: {
				abilityId,
				removedAt: null,
			},
			data: {
				removedAt: new Date(),
			},
		});

		return result.count;
	}
}
