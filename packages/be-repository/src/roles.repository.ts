import type { SystemRoleName } from "@cocrepo/constant";
import { Role } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

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

		const result = await this.txHost.tx.role.findUnique({
			where: { id },
		});

		return result ? plainToInstance(Role, result) : null;
	}

	/**
	 * 역할 이름으로 조회
	 */
	async findByName(name: SystemRoleName | string): Promise<Role | null> {
		this.logger.debug(`이름으로 역할 조회: ${name}`);

		const result = await this.txHost.tx.role.findFirst({
			where: { name },
		});

		return result ? plainToInstance(Role, result) : null;
	}

	/**
	 * 전체 역할 목록 조회
	 */
	async findAll(): Promise<Role[]> {
		this.logger.debug("전체 역할 목록 조회");

		const results = await this.txHost.tx.role.findMany({
			orderBy: { createdAt: "asc" },
		});

		return results.map((result) => plainToInstance(Role, result));
	}

	/**
	 * 역할 생성
	 */
	async create(data: Prisma.RoleUncheckedCreateInput): Promise<Role> {
		this.logger.debug(`역할 생성: name=${data.name}`);

		const result = await this.txHost.tx.role.create({
			data,
		});

		return plainToInstance(Role, result);
	}

	/**
	 * 역할 수정
	 */
	async updateById(
		id: string,
		data: Prisma.RoleUncheckedUpdateInput,
	): Promise<Role> {
		this.logger.debug(`역할 수정: ${id.slice(-8)}`);

		const result = await this.txHost.tx.role.update({
			where: { id },
			data,
		});

		return plainToInstance(Role, result);
	}

	/**
	 * 역할 삭제
	 */
	async deleteById(id: string): Promise<Role> {
		this.logger.debug(`역할 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.role.delete({
			where: { id },
		});

		return plainToInstance(Role, result);
	}

	/**
	 * 역할에 연결된 테넌트 수 조회
	 * 삭제 가능 여부 체크용
	 */
	async countTenantsByRoleId(roleId: string): Promise<number> {
		this.logger.debug(`역할에 연결된 테넌트 수 조회: ${roleId.slice(-8)}`);

		return this.txHost.tx.tenant.count({
			where: { roleId },
		});
	}
}
