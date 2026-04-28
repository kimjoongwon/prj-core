import { Group } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class GroupsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("GroupsRepository");
	}

	/**
	 * ID로 그룹 조회
	 */
	async findById(
		id: string,
		include?: Prisma.GroupInclude,
	): Promise<Group | null> {
		this.logger.debug(`ID로 그룹 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.group.findUnique({
			where: { id },
			include,
		});

		return result ? plainToInstance(Group, result) : null;
	}

	/**
	 * 조건별 그룹 목록 조회
	 */
	async findMany(params: {
		where?: Prisma.GroupWhereInput;
		orderBy?: Prisma.GroupOrderByWithRelationInput[];
		include?: Prisma.GroupInclude;
	}): Promise<Group[]> {
		this.logger.debug("그룹 목록 조회");

		const results = await this.txHost.tx.group.findMany({
			where: params.where,
			orderBy: params.orderBy ?? [{ createdAt: "asc" }],
			include: params.include,
		});

		return results.map((result) => plainToInstance(Group, result));
	}

	/**
	 * 그룹 생성
	 */
	async create(data: Prisma.GroupUncheckedCreateInput): Promise<Group> {
		this.logger.debug(`그룹 생성: name=${data.name}`);

		const result = await this.txHost.tx.group.create({ data });

		return plainToInstance(Group, result);
	}

	/**
	 * 그룹 수정
	 */
	async updateById(
		id: string,
		data: Prisma.GroupUncheckedUpdateInput,
	): Promise<Group> {
		this.logger.debug(`그룹 수정: ${id.slice(-8)}`);

		const result = await this.txHost.tx.group.update({
			where: { id },
			data,
		});

		return plainToInstance(Group, result);
	}

	/**
	 * 그룹 삭제
	 */
	async deleteById(id: string): Promise<Group> {
		this.logger.debug(`그룹 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.group.delete({
			where: { id },
		});

		return plainToInstance(Group, result);
	}

	/**
	 * 그룹에 연결된 RoleAssociation 수 조회
	 */
	async countRoleAssociationsByGroupId(groupId: string): Promise<number> {
		this.logger.debug(`그룹에 연결된 역할 수 조회: ${groupId.slice(-8)}`);

		return this.txHost.tx.roleAssociation.count({
			where: { groupId },
		});
	}
}
