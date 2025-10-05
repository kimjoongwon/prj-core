import { Injectable, Logger } from "@nestjs/common";
import { Exercise, Prisma, UseEntity } from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/prisma.service";

@Injectable()
@UseEntity(Exercise)
export class ExercisesRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("Exercise");
	}

	async create(args: Prisma.ExerciseCreateArgs): Promise<Exercise> {
		this.logger.debug(`Exercise 생성 중...`);
		const result = await this.prisma.exercise.create(args);
		return plainToInstance(Exercise, result);
	}

	async upsert(args: Prisma.ExerciseUpsertArgs): Promise<Exercise> {
		this.logger.debug(`Exercise 업서트 중...`);
		const result = await this.prisma.exercise.upsert(args);
		return plainToInstance(Exercise, result);
	}

	async update(args: Prisma.ExerciseUpdateArgs): Promise<Exercise> {
		this.logger.debug(`Exercise 업데이트 중...`);
		const result = await this.prisma.exercise.update(args);
		return plainToInstance(Exercise, result);
	}

	async updateMany(
		args: Prisma.ExerciseUpdateManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Exercise 다중 업데이트 중...`);
		return await this.prisma.exercise.updateMany(args);
	}

	async delete(args: Prisma.ExerciseDeleteArgs): Promise<Exercise> {
		this.logger.debug(`Exercise 삭제 중...`);
		const result = await this.prisma.exercise.delete(args);
		return plainToInstance(Exercise, result);
	}

	async findMany(args: Prisma.ExerciseFindManyArgs): Promise<Exercise[]> {
		this.logger.debug(`Exercise 다중 조회 중...`);
		const result = await this.prisma.exercise.findMany(args);
		return result.map((item) => plainToInstance(Exercise, item));
	}

	async findFirst(args: Prisma.ExerciseFindFirstArgs): Promise<Exercise> {
		this.logger.debug(`Exercise 최초 조회 중...`);
		const result = await this.prisma.exercise.findFirst(args);
		return plainToInstance(Exercise, result);
	}

	async findUnique(args: Prisma.ExerciseFindUniqueArgs): Promise<Exercise> {
		this.logger.debug(`Exercise 고유 조회 중...`);
		const result = await this.prisma.exercise.findUnique(args);
		return plainToInstance(Exercise, result);
	}

	async groupBy(args: any): Promise<any> {
		this.logger.debug(`Exercise 그룹화 중...`);
		return await this.prisma.exercise.groupBy(args);
	}

	async createManyAndReturn(
		args: Prisma.ExerciseCreateManyArgs,
	): Promise<Exercise[]> {
		this.logger.debug(`Exercise 다중 생성 중...`);
		const result = await this.prisma.exercise.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Exercise, item));
	}

	async deleteMany(
		args: Prisma.ExerciseDeleteManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Exercise 다중 삭제 중...`);
		return await this.prisma.exercise.deleteMany(args);
	}

	async aggregate(args: Prisma.ExerciseAggregateArgs): Promise<any> {
		this.logger.debug(`Exercise 집계 중...`);
		return await this.prisma.exercise.aggregate(args);
	}

	async count(args: Prisma.ExerciseCountArgs): Promise<number> {
		this.logger.debug(`Exercise 개수 세기 중...`);
		return await this.prisma.exercise.count(args);
	}
}
