import { Timeline } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PRISMA_SERVICE_TOKEN } from "../constants/tokens";
import type { IPrismaClient } from "../types/prisma-client.interface";

@Injectable()
export class TimelinesRepository {
	private readonly logger: Logger;

	constructor(
		@Inject(PRISMA_SERVICE_TOKEN)
		private readonly prisma: IPrismaClient
	) {
		this.logger = new Logger("Timeline");
	}

	async create(args: Prisma.TimelineCreateArgs): Promise<Timeline> {
		this.logger.debug(`Timeline 생성 중...`);
		const result = await this.prisma.timeline.create(args);
		return plainToInstance(Timeline, result);
	}

	async upsert(args: Prisma.TimelineUpsertArgs): Promise<Timeline> {
		this.logger.debug(`Timeline 업서트 중...`);
		const result = await this.prisma.timeline.upsert(args);
		return plainToInstance(Timeline, result);
	}

	async update(args: Prisma.TimelineUpdateArgs): Promise<Timeline> {
		this.logger.debug(`Timeline 업데이트 중...`);
		const result = await this.prisma.timeline.update(args);
		return plainToInstance(Timeline, result);
	}

	async updateMany(
		args: Prisma.TimelineUpdateManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Timeline 다중 업데이트 중...`);
		return await this.prisma.timeline.updateMany(args);
	}

	async delete(args: Prisma.TimelineDeleteArgs): Promise<Timeline> {
		this.logger.debug(`Timeline 삭제 중...`);
		const result = await this.prisma.timeline.delete(args);
		return plainToInstance(Timeline, result);
	}

	async findMany(args: Prisma.TimelineFindManyArgs): Promise<Timeline[]> {
		this.logger.debug(`Timeline 다중 조회 중...`);
		const result = await this.prisma.timeline.findMany(args);
		return result.map((item) => plainToInstance(Timeline, item));
	}

	async findFirst(args: Prisma.TimelineFindFirstArgs): Promise<Timeline> {
		this.logger.debug(`Timeline 최초 조회 중...`);
		const result = await this.prisma.timeline.findFirst(args);
		return plainToInstance(Timeline, result);
	}

	async findUnique(args: Prisma.TimelineFindUniqueArgs): Promise<Timeline> {
		this.logger.debug(`Timeline 고유 조회 중...`);
		const result = await this.prisma.timeline.findUnique(args);
		return plainToInstance(Timeline, result);
	}

	async createManyAndReturn(
		args: Prisma.TimelineCreateManyAndReturnArgs,
	): Promise<Timeline[]> {
		this.logger.debug(`Timeline 다중 생성 중...`);
		const result = await this.prisma.timeline.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Timeline, item));
	}

	async deleteMany(
		args: Prisma.TimelineDeleteManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Timeline 다중 삭제 중...`);
		return await this.prisma.timeline.deleteMany(args);
	}

	async aggregate(
		args: Prisma.TimelineAggregateArgs,
	): Promise<Prisma.GetTimelineAggregateType<typeof args>> {
		this.logger.debug(`Timeline 집계 중...`);
		return await this.prisma.timeline.aggregate(args);
	}

	async count(args: Prisma.TimelineCountArgs): Promise<number> {
		this.logger.debug(`Timeline 개수 세기 중...`);
		return await this.prisma.timeline.count(args);
	}
}
