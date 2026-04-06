import { UserGrant } from "@cocrepo/entity";
import { PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class UserGrantsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("UserGrantsRepository");
	}

	async findActiveByUserId(userId: string): Promise<UserGrant[]> {
		this.logger.debug(`UserGrant 조회: userId=${userId.slice(-8)}`);

		const results = await this.txHost.tx.userGrant.findMany({
			where: {
				userId,
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

		return results.map((result) => plainToInstance(UserGrant, result));
	}

	async removeByAbilityId(abilityId: string): Promise<number> {
		this.logger.debug(
			`Ability ID로 UserGrant 소프트 삭제: abilityId=${abilityId.slice(-8)}`,
		);

		const result = await this.txHost.tx.userGrant.updateMany({
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
