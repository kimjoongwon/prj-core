import { PrismaClient, Role, Roles } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";

@Injectable()
export class RolesRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("RolesRepository");
	}

	/**
	 * ID로 역할 조회
	 */
	async findById(id: string): Promise<Role | null> {
		this.logger.debug(`ID로 역할 조회: ${id.slice(-8)}`);

		return this.txHost.tx.role.findUnique({
			where: { id },
		});
	}

	/**
	 * 역할 이름(Enum)으로 조회
	 */
	async findByName(name: Roles): Promise<Role | null> {
		this.logger.debug(`이름으로 역할 조회: ${name}`);

		return this.txHost.tx.role.findFirst({
			where: { name },
		});
	}

	/**
	 * 전체 역할 목록 조회
	 */
	async findAll(): Promise<Role[]> {
		this.logger.debug("전체 역할 목록 조회");

		return this.txHost.tx.role.findMany({
			orderBy: { createdAt: "asc" },
		});
	}
}
