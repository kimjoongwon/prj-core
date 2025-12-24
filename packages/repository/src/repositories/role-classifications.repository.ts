import { RoleClassification } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PRISMA_SERVICE_TOKEN } from "../constants/tokens";
import type { IPrismaClient } from "../types/prisma-client.interface";

@Injectable()
export class RoleClassificationsRepository {
	private readonly logger: Logger;

	constructor(
		@Inject(PRISMA_SERVICE_TOKEN)
		private readonly prisma: IPrismaClient
	) {
		this.logger = new Logger("RoleClassification");
	}

	async create(
		args: Prisma.RoleClassificationCreateArgs,
	): Promise<RoleClassification> {
		this.logger.debug(`RoleClassification 생성 중...`);
		const result = await this.prisma.roleClassification.create(args);
		return plainToInstance(RoleClassification, result);
	}

	async upsert(
		args: Prisma.RoleClassificationUpsertArgs,
	): Promise<RoleClassification> {
		this.logger.debug(`RoleClassification 업서트 중...`);
		const result = await this.prisma.roleClassification.upsert(args);
		return plainToInstance(RoleClassification, result);
	}

	async update(
		args: Prisma.RoleClassificationUpdateArgs,
	): Promise<RoleClassification> {
		this.logger.debug(`RoleClassification 업데이트 중...`);
		const result = await this.prisma.roleClassification.update(args);
		return plainToInstance(RoleClassification, result);
	}

	async updateMany(
		args: Prisma.RoleClassificationUpdateManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`RoleClassification 다중 업데이트 중...`);
		return await this.prisma.roleClassification.updateMany(args);
	}

	async delete(
		args: Prisma.RoleClassificationDeleteArgs,
	): Promise<RoleClassification> {
		this.logger.debug(`RoleClassification 삭제 중...`);
		const result = await this.prisma.roleClassification.delete(args);
		return plainToInstance(RoleClassification, result);
	}

	async findMany(
		args: Prisma.RoleClassificationFindManyArgs,
	): Promise<RoleClassification[]> {
		this.logger.debug(`RoleClassification 다중 조회 중...`);
		const result = await this.prisma.roleClassification.findMany(args);
		return result.map((item) => plainToInstance(RoleClassification, item));
	}

	async findFirst(
		args: Prisma.RoleClassificationFindFirstArgs,
	): Promise<RoleClassification> {
		this.logger.debug(`RoleClassification 최초 조회 중...`);
		const result = await this.prisma.roleClassification.findFirst(args);
		return plainToInstance(RoleClassification, result);
	}

	async findUnique(
		args: Prisma.RoleClassificationFindUniqueArgs,
	): Promise<RoleClassification> {
		this.logger.debug(`RoleClassification 고유 조회 중...`);
		const result = await this.prisma.roleClassification.findUnique(args);
		return plainToInstance(RoleClassification, result);
	}

	async createManyAndReturn(
		args: Prisma.RoleClassificationCreateManyAndReturnArgs,
	): Promise<RoleClassification[]> {
		this.logger.debug(`RoleClassification 다중 생성 중...`);
		const result =
			await this.prisma.roleClassification.createManyAndReturn(args);
		return result.map((item) => plainToInstance(RoleClassification, item));
	}

	async deleteMany(
		args: Prisma.RoleClassificationDeleteManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`RoleClassification 다중 삭제 중...`);
		return await this.prisma.roleClassification.deleteMany(args);
	}

	async aggregate(
		args: Prisma.RoleClassificationAggregateArgs,
	): Promise<Prisma.GetRoleClassificationAggregateType<typeof args>> {
		this.logger.debug(`RoleClassification 집계 중...`);
		return await this.prisma.roleClassification.aggregate(args);
	}

	async count(args: Prisma.RoleClassificationCountArgs): Promise<number> {
		this.logger.debug(`RoleClassification 개수 세기 중...`);
		return await this.prisma.roleClassification.count(args);
	}
}
