import { Task } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
export class TasksRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("Task");
	}

	async create(args: Prisma.TaskCreateArgs): Promise<Task> {
		this.logger.debug(`Task 생성 중...`);
		const result = await this.prisma.task.create(args);
		return plainToInstance(Task, result);
	}

	async upsert(args: Prisma.TaskUpsertArgs): Promise<Task> {
		this.logger.debug(`Task 업서트 중...`);
		const result = await this.prisma.task.upsert(args);
		return plainToInstance(Task, result);
	}

	async update(args: Prisma.TaskUpdateArgs): Promise<Task> {
		this.logger.debug(`Task 업데이트 중...`);
		const result = await this.prisma.task.update(args);
		return plainToInstance(Task, result);
	}

	async updateMany(
		args: Prisma.TaskUpdateManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Task 다중 업데이트 중...`);
		return await this.prisma.task.updateMany(args);
	}

	async delete(args: Prisma.TaskDeleteArgs): Promise<Task> {
		this.logger.debug(`Task 삭제 중...`);
		const result = await this.prisma.task.delete(args);
		return plainToInstance(Task, result);
	}

	async findMany(args: Prisma.TaskFindManyArgs): Promise<Task[]> {
		this.logger.debug(`Task 다중 조회 중...`);
		const result = await this.prisma.task.findMany(args);
		return result.map((item) => plainToInstance(Task, item));
	}

	async findFirst(args: Prisma.TaskFindFirstArgs): Promise<Task> {
		this.logger.debug(`Task 최초 조회 중...`);
		const result = await this.prisma.task.findFirst(args);
		return plainToInstance(Task, result);
	}

	async findUnique(args: Prisma.TaskFindUniqueArgs): Promise<Task> {
		this.logger.debug(`Task 고유 조회 중...`);
		const result = await this.prisma.task.findUnique(args);
		return plainToInstance(Task, result);
	}

	async createManyAndReturn(
		args: Prisma.TaskCreateManyAndReturnArgs,
	): Promise<Task[]> {
		this.logger.debug(`Task 다중 생성 중...`);
		const result = await this.prisma.task.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Task, item));
	}

	async deleteMany(
		args: Prisma.TaskDeleteManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Task 다중 삭제 중...`);
		return await this.prisma.task.deleteMany(args);
	}

	async aggregate(
		args: Prisma.TaskAggregateArgs,
	): Promise<Prisma.GetTaskAggregateType<typeof args>> {
		this.logger.debug(`Task 집계 중...`);
		return await this.prisma.task.aggregate(args);
	}

	async count(args: Prisma.TaskCountArgs): Promise<number> {
		this.logger.debug(`Task 개수 세기 중...`);
		return await this.prisma.task.count(args);
	}
}
