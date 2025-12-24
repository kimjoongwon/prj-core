import { UserClassification } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PRISMA_SERVICE_TOKEN } from "../constants/tokens";
import type { IPrismaClient } from "../types/prisma-client.interface";

@Injectable()
export class UserClassificationsRepository {
	private readonly logger: Logger;

	constructor(
		@Inject(PRISMA_SERVICE_TOKEN)
		private readonly prisma: IPrismaClient
	) {
		this.logger = new Logger("UserClassification");
	}

	async create(
		args: Prisma.UserClassificationCreateArgs,
	): Promise<UserClassification> {
		this.logger.debug(`UserClassification 생성 중...`);
		const result = await this.prisma.userClassification.create(args);
		return plainToInstance(UserClassification, result);
	}

	async upsert(
		args: Prisma.UserClassificationUpsertArgs,
	): Promise<UserClassification> {
		this.logger.debug(`UserClassification 업서트 중...`);
		const result = await this.prisma.userClassification.upsert(args);
		return plainToInstance(UserClassification, result);
	}

	async update(
		args: Prisma.UserClassificationUpdateArgs,
	): Promise<UserClassification> {
		this.logger.debug(`UserClassification 업데이트 중...`);
		const result = await this.prisma.userClassification.update(args);
		return plainToInstance(UserClassification, result);
	}

	async updateMany(
		args: Prisma.UserClassificationUpdateManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`UserClassification 다중 업데이트 중...`);
		return await this.prisma.userClassification.updateMany(args);
	}

	async delete(
		args: Prisma.UserClassificationDeleteArgs,
	): Promise<UserClassification> {
		this.logger.debug(`UserClassification 삭제 중...`);
		const result = await this.prisma.userClassification.delete(args);
		return plainToInstance(UserClassification, result);
	}

	async findMany(
		args: Prisma.UserClassificationFindManyArgs,
	): Promise<UserClassification[]> {
		this.logger.debug(`UserClassification 다중 조회 중...`);
		const result = await this.prisma.userClassification.findMany(args);
		return result.map((item) => plainToInstance(UserClassification, item));
	}

	async findFirst(
		args: Prisma.UserClassificationFindFirstArgs,
	): Promise<UserClassification> {
		this.logger.debug(`UserClassification 최초 조회 중...`);
		const result = await this.prisma.userClassification.findFirst(args);
		return plainToInstance(UserClassification, result);
	}

	async findUnique(
		args: Prisma.UserClassificationFindUniqueArgs,
	): Promise<UserClassification> {
		this.logger.debug(`UserClassification 고유 조회 중...`);
		const result = await this.prisma.userClassification.findUnique(args);
		return plainToInstance(UserClassification, result);
	}

	async createManyAndReturn(
		args: Prisma.UserClassificationCreateManyAndReturnArgs,
	): Promise<UserClassification[]> {
		this.logger.debug(`UserClassification 다중 생성 중...`);
		const result =
			await this.prisma.userClassification.createManyAndReturn(args);
		return result.map((item) => plainToInstance(UserClassification, item));
	}

	async deleteMany(
		args: Prisma.UserClassificationDeleteManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`UserClassification 다중 삭제 중...`);
		return await this.prisma.userClassification.deleteMany(args);
	}

	async aggregate(
		args: Prisma.UserClassificationAggregateArgs,
	): Promise<Prisma.GetUserClassificationAggregateType<typeof args>> {
		this.logger.debug(`UserClassification 집계 중...`);
		return await this.prisma.userClassification.aggregate(args);
	}

	async count(args: Prisma.UserClassificationCountArgs): Promise<number> {
		this.logger.debug(`UserClassification 개수 세기 중...`);
		return await this.prisma.userClassification.count(args);
	}
}
