import { UseEntity } from "@cocrepo/decorator";
import { Program } from "@cocrepo/entity";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
@UseEntity(Program)
export class ProgramsRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("Program");
	}

	async create(args: any): Promise<Program> {
		this.logger.debug(`Program 생성 중...`);
		const result = await this.prisma.program.create(args);
		return plainToInstance(Program, result);
	}

	async upsert(args: any): Promise<Program> {
		this.logger.debug(`Program 업서트 중...`);
		const result = await this.prisma.program.upsert(args);
		return plainToInstance(Program, result);
	}

	async update(args: any): Promise<Program> {
		this.logger.debug(`Program 업데이트 중...`);
		const result = await this.prisma.program.update(args);
		return plainToInstance(Program, result);
	}

	async updateMany(args: any): Promise<any> {
		this.logger.debug(`Program 다중 업데이트 중...`);
		return await this.prisma.program.updateMany(args);
	}

	async delete(args: any): Promise<Program> {
		this.logger.debug(`Program 삭제 중...`);
		const result = await this.prisma.program.delete(args);
		return plainToInstance(Program, result);
	}

	async findMany(args: any): Promise<Program[]> {
		this.logger.debug(`Program 다중 조회 중...`);
		const result = await this.prisma.program.findMany(args);
		return result.map((item) => plainToInstance(Program, item));
	}

	async findFirst(args: any): Promise<Program> {
		this.logger.debug(`Program 최초 조회 중...`);
		const result = await this.prisma.program.findFirst(args);
		return plainToInstance(Program, result);
	}

	async findUnique(args: any): Promise<Program> {
		this.logger.debug(`Program 고유 조회 중...`);
		const result = await this.prisma.program.findUnique(args);
		return plainToInstance(Program, result);
	}

	async createManyAndReturn(args: any): Promise<Program[]> {
		this.logger.debug(`Program 다중 생성 중...`);
		const result = await this.prisma.program.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Program, item));
	}

	async deleteMany(args: any): Promise<any> {
		this.logger.debug(`Program 다중 삭제 중...`);
		return await this.prisma.program.deleteMany(args);
	}

	async aggregate(args: any): Promise<any> {
		this.logger.debug(`Program 집계 중...`);
		return await this.prisma.program.aggregate(args);
	}

	async count(args: any): Promise<number> {
		this.logger.debug(`Program 개수 세기 중...`);
		return await this.prisma.program.count(args);
	}
}
