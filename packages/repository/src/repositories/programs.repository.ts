import { Program } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PRISMA_SERVICE_TOKEN } from "../constants/tokens";
import type { IPrismaClient } from "../types/prisma-client.interface";

@Injectable()
export class ProgramsRepository {
	private readonly logger: Logger;

	constructor(
		@Inject(PRISMA_SERVICE_TOKEN)
		private readonly prisma: IPrismaClient
	) {
		this.logger = new Logger("Program");
	}

	async create(args: Prisma.ProgramCreateArgs): Promise<Program> {
		this.logger.debug(`Program 생성 중...`);
		const result = await this.prisma.program.create(args);
		return plainToInstance(Program, result);
	}

	async upsert(args: Prisma.ProgramUpsertArgs): Promise<Program> {
		this.logger.debug(`Program 업서트 중...`);
		const result = await this.prisma.program.upsert(args);
		return plainToInstance(Program, result);
	}

	async update(args: Prisma.ProgramUpdateArgs): Promise<Program> {
		this.logger.debug(`Program 업데이트 중...`);
		const result = await this.prisma.program.update(args);
		return plainToInstance(Program, result);
	}

	async updateMany(
		args: Prisma.ProgramUpdateManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Program 다중 업데이트 중...`);
		return await this.prisma.program.updateMany(args);
	}

	async delete(args: Prisma.ProgramDeleteArgs): Promise<Program> {
		this.logger.debug(`Program 삭제 중...`);
		const result = await this.prisma.program.delete(args);
		return plainToInstance(Program, result);
	}

	async findMany(args: Prisma.ProgramFindManyArgs): Promise<Program[]> {
		this.logger.debug(`Program 다중 조회 중...`);
		const result = await this.prisma.program.findMany(args);
		return result.map((item) => plainToInstance(Program, item));
	}

	async findFirst(args: Prisma.ProgramFindFirstArgs): Promise<Program> {
		this.logger.debug(`Program 최초 조회 중...`);
		const result = await this.prisma.program.findFirst(args);
		return plainToInstance(Program, result);
	}

	async findUnique(args: Prisma.ProgramFindUniqueArgs): Promise<Program> {
		this.logger.debug(`Program 고유 조회 중...`);
		const result = await this.prisma.program.findUnique(args);
		return plainToInstance(Program, result);
	}

	async createManyAndReturn(
		args: Prisma.ProgramCreateManyAndReturnArgs,
	): Promise<Program[]> {
		this.logger.debug(`Program 다중 생성 중...`);
		const result = await this.prisma.program.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Program, item));
	}

	async deleteMany(
		args: Prisma.ProgramDeleteManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Program 다중 삭제 중...`);
		return await this.prisma.program.deleteMany(args);
	}

	async aggregate(
		args: Prisma.ProgramAggregateArgs,
	): Promise<Prisma.GetProgramAggregateType<typeof args>> {
		this.logger.debug(`Program 집계 중...`);
		return await this.prisma.program.aggregate(args);
	}

	async count(args: Prisma.ProgramCountArgs): Promise<number> {
		this.logger.debug(`Program 개수 세기 중...`);
		return await this.prisma.program.count(args);
	}
}
