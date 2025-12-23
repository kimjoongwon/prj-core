import { Ground } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
export class GroundsRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("Ground");
	}

	async create(args: Prisma.GroundCreateArgs): Promise<Ground> {
		this.logger.debug(`Ground 생성 중...`);
		const result = await this.prisma.ground.create(args);
		return plainToInstance(Ground, result);
	}

	async upsert(args: Prisma.GroundUpsertArgs): Promise<Ground> {
		this.logger.debug(`Ground 업서트 중...`);
		const result = await this.prisma.ground.upsert(args);
		return plainToInstance(Ground, result);
	}

	async update(args: Prisma.GroundUpdateArgs): Promise<Ground> {
		this.logger.debug(`Ground 업데이트 중...`);
		const result = await this.prisma.ground.update(args);
		return plainToInstance(Ground, result);
	}

	async updateMany(
		args: Prisma.GroundUpdateManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Ground 다중 업데이트 중...`);
		return await this.prisma.ground.updateMany(args);
	}

	async delete(args: Prisma.GroundDeleteArgs): Promise<Ground> {
		this.logger.debug(`Ground 삭제 중...`);
		const result = await this.prisma.ground.delete(args);
		return plainToInstance(Ground, result);
	}

	async findMany(args: Prisma.GroundFindManyArgs): Promise<Ground[]> {
		this.logger.debug(`Ground 다중 조회 중...`);
		const result = await this.prisma.ground.findMany(args);
		return result.map((item) => plainToInstance(Ground, item));
	}

	async findFirst(args: Prisma.GroundFindFirstArgs): Promise<Ground> {
		this.logger.debug(`Ground 최초 조회 중...`);
		const result = await this.prisma.ground.findFirst(args);
		return plainToInstance(Ground, result);
	}

	async findUnique(args: Prisma.GroundFindUniqueArgs): Promise<Ground> {
		this.logger.debug(`Ground 고유 조회 중...`);
		const result = await this.prisma.ground.findUnique(args);
		return plainToInstance(Ground, result);
	}

	async createManyAndReturn(
		args: Prisma.GroundCreateManyAndReturnArgs,
	): Promise<Ground[]> {
		this.logger.debug(`Ground 다중 생성 중...`);
		const result = await this.prisma.ground.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Ground, item));
	}

	async deleteMany(
		args: Prisma.GroundDeleteManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Ground 다중 삭제 중...`);
		return await this.prisma.ground.deleteMany(args);
	}

	async aggregate(
		args: Prisma.GroundAggregateArgs,
	): Promise<Prisma.GetGroundAggregateType<typeof args>> {
		this.logger.debug(`Ground 집계 중...`);
		return await this.prisma.ground.aggregate(args);
	}

	async count(args: Prisma.GroundCountArgs): Promise<number> {
		this.logger.debug(`Ground 개수 세기 중...`);
		return await this.prisma.ground.count(args);
	}
}
