import { Routine } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
export class RoutinesRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("Routine");
	}

	async create(args: Prisma.RoutineCreateArgs): Promise<Routine> {
		this.logger.debug(`Routine 생성 중...`);
		const result = await this.prisma.routine.create(args);
		return plainToInstance(Routine, result);
	}

	async upsert(args: Prisma.RoutineUpsertArgs): Promise<Routine> {
		this.logger.debug(`Routine 업서트 중...`);
		const result = await this.prisma.routine.upsert(args);
		return plainToInstance(Routine, result);
	}

	async update(args: Prisma.RoutineUpdateArgs): Promise<Routine> {
		this.logger.debug(`Routine 업데이트 중...`);
		const result = await this.prisma.routine.update(args);
		return plainToInstance(Routine, result);
	}

	async updateMany(
		args: Prisma.RoutineUpdateManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Routine 다중 업데이트 중...`);
		return await this.prisma.routine.updateMany(args);
	}

	async delete(args: Prisma.RoutineDeleteArgs): Promise<Routine> {
		this.logger.debug(`Routine 삭제 중...`);
		const result = await this.prisma.routine.delete(args);
		return plainToInstance(Routine, result);
	}

	async findMany(args: Prisma.RoutineFindManyArgs): Promise<Routine[]> {
		this.logger.debug(`Routine 다중 조회 중...`);
		const result = await this.prisma.routine.findMany(args);
		return result.map((item) => plainToInstance(Routine, item));
	}

	async findFirst(args: Prisma.RoutineFindFirstArgs): Promise<Routine> {
		this.logger.debug(`Routine 최초 조회 중...`);
		const result = await this.prisma.routine.findFirst(args);
		return plainToInstance(Routine, result);
	}

	async findUnique(args: Prisma.RoutineFindUniqueArgs): Promise<Routine> {
		this.logger.debug(`Routine 고유 조회 중...`);
		const result = await this.prisma.routine.findUnique(args);
		return plainToInstance(Routine, result);
	}

	async createManyAndReturn(
		args: Prisma.RoutineCreateManyAndReturnArgs,
	): Promise<Routine[]> {
		this.logger.debug(`Routine 다중 생성 중...`);
		const result = await this.prisma.routine.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Routine, item));
	}

	async deleteMany(
		args: Prisma.RoutineDeleteManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Routine 다중 삭제 중...`);
		return await this.prisma.routine.deleteMany(args);
	}

	async aggregate(
		args: Prisma.RoutineAggregateArgs,
	): Promise<Prisma.GetRoutineAggregateType<typeof args>> {
		this.logger.debug(`Routine 집계 중...`);
		return await this.prisma.routine.aggregate(args);
	}

	async count(args: Prisma.RoutineCountArgs): Promise<number> {
		this.logger.debug(`Routine 개수 세기 중...`);
		return await this.prisma.routine.count(args);
	}
}
