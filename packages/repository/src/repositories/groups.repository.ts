import { Group } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PRISMA_SERVICE_TOKEN } from "../constants/tokens";
import type { IPrismaClient } from "../types/prisma-client.interface";

@Injectable()
export class GroupsRepository {
	private readonly logger: Logger;

	constructor(
		@Inject(PRISMA_SERVICE_TOKEN)
		private readonly prisma: IPrismaClient
	) {
		this.logger = new Logger("Group");
	}

	async create(args: Prisma.GroupCreateArgs): Promise<Group> {
		this.logger.debug(`Group 생성 중...`);
		const result = await this.prisma.group.create(args);
		return plainToInstance(Group, result);
	}

	async upsert(args: Prisma.GroupUpsertArgs): Promise<Group> {
		this.logger.debug(`Group 업서트 중...`);
		const result = await this.prisma.group.upsert(args);
		return plainToInstance(Group, result);
	}

	async update(args: Prisma.GroupUpdateArgs): Promise<Group> {
		this.logger.debug(`Group 업데이트 중...`);
		const result = await this.prisma.group.update(args);
		return plainToInstance(Group, result);
	}

	async updateMany(
		args: Prisma.GroupUpdateManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Group 다중 업데이트 중...`);
		return await this.prisma.group.updateMany(args);
	}

	async delete(args: Prisma.GroupDeleteArgs): Promise<Group> {
		this.logger.debug(`Group 삭제 중...`);
		const result = await this.prisma.group.delete(args);
		return plainToInstance(Group, result);
	}

	async findMany(args: Prisma.GroupFindManyArgs): Promise<Group[]> {
		this.logger.debug(`Group 다중 조회 중...`);
		const result = await this.prisma.group.findMany(args);
		return result.map((item) => plainToInstance(Group, item));
	}

	async findFirst(args: Prisma.GroupFindFirstArgs): Promise<Group> {
		this.logger.debug(`Group 최초 조회 중...`);
		const result = await this.prisma.group.findFirst(args);
		return plainToInstance(Group, result);
	}

	async findUnique(args: Prisma.GroupFindUniqueArgs): Promise<Group> {
		this.logger.debug(`Group 고유 조회 중...`);
		const result = await this.prisma.group.findUnique(args);
		return plainToInstance(Group, result);
	}

	async createManyAndReturn(
		args: Prisma.GroupCreateManyAndReturnArgs,
	): Promise<Group[]> {
		this.logger.debug(`Group 다중 생성 중...`);
		const result = await this.prisma.group.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Group, item));
	}

	async deleteMany(
		args: Prisma.GroupDeleteManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Group 다중 삭제 중...`);
		return await this.prisma.group.deleteMany(args);
	}

	async aggregate(
		args: Prisma.GroupAggregateArgs,
	): Promise<Prisma.GetGroupAggregateType<typeof args>> {
		this.logger.debug(`Group 집계 중...`);
		return await this.prisma.group.aggregate(args);
	}

	async count(args: Prisma.GroupCountArgs): Promise<number> {
		this.logger.debug(`Group 개수 세기 중...`);
		return await this.prisma.group.count(args);
	}
}
