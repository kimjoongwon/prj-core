import { Assignment } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
export class AssignmentsRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("Assignment");
	}

	async create(args: Prisma.AssignmentCreateArgs): Promise<Assignment> {
		this.logger.debug(`Assignment 생성 중...`);
		const result = await this.prisma.assignment.create(args);
		return plainToInstance(Assignment, result);
	}

	async upsert(args: Prisma.AssignmentUpsertArgs): Promise<Assignment> {
		this.logger.debug(`Assignment 업서트 중...`);
		const result = await this.prisma.assignment.upsert(args);
		return plainToInstance(Assignment, result);
	}

	async update(args: Prisma.AssignmentUpdateArgs): Promise<Assignment> {
		this.logger.debug(`Assignment 업데이트 중...`);
		const result = await this.prisma.assignment.update(args);
		return plainToInstance(Assignment, result);
	}

	async updateMany(
		args: Prisma.AssignmentUpdateManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Assignment 다중 업데이트 중...`);
		return await this.prisma.assignment.updateMany(args);
	}

	async delete(args: Prisma.AssignmentDeleteArgs): Promise<Assignment> {
		this.logger.debug(`Assignment 삭제 중...`);
		const result = await this.prisma.assignment.delete(args);
		return plainToInstance(Assignment, result);
	}

	async findMany(args: Prisma.AssignmentFindManyArgs): Promise<Assignment[]> {
		this.logger.debug(`Assignment 다중 조회 중...`);
		const result = await this.prisma.assignment.findMany(args);
		return result.map((item) => plainToInstance(Assignment, item));
	}

	async findFirst(args: Prisma.AssignmentFindFirstArgs): Promise<Assignment> {
		this.logger.debug(`Assignment 최초 조회 중...`);
		const result = await this.prisma.assignment.findFirst(args);
		return plainToInstance(Assignment, result);
	}

	async findUnique(args: Prisma.AssignmentFindUniqueArgs): Promise<Assignment> {
		this.logger.debug(`Assignment 고유 조회 중...`);
		const result = await this.prisma.assignment.findUnique(args);
		return plainToInstance(Assignment, result);
	}

	async createManyAndReturn(
		args: Prisma.AssignmentCreateManyAndReturnArgs,
	): Promise<Assignment[]> {
		this.logger.debug(`Assignment 다중 생성 중...`);
		const result = await this.prisma.assignment.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Assignment, item));
	}

	async deleteMany(
		args: Prisma.AssignmentDeleteManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Assignment 다중 삭제 중...`);
		return await this.prisma.assignment.deleteMany(args);
	}

	async aggregate(
		args: Prisma.AssignmentAggregateArgs,
	): Promise<Prisma.GetAssignmentAggregateType<typeof args>> {
		this.logger.debug(`Assignment 집계 중...`);
		return await this.prisma.assignment.aggregate(args);
	}

	async count(args: Prisma.AssignmentCountArgs): Promise<number> {
		this.logger.debug(`Assignment 개수 세기 중...`);
		return await this.prisma.assignment.count(args);
	}
}
