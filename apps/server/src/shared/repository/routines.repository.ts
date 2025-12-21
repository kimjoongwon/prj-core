import { UseEntity } from "@cocrepo/decorator";
import { Routine } from "@cocrepo/entity";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
@UseEntity(Routine)
export class RoutinesRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("Routine");
	}

	async create(args: any): Promise<Routine> {
		this.logger.debug(`Routine 생성 중...`);
		const result = await this.prisma.routine.create(args);
		return plainToInstance(Routine, result);
	}

	async upsert(args: any): Promise<Routine> {
		this.logger.debug(`Routine 업서트 중...`);
		const result = await this.prisma.routine.upsert(args);
		return plainToInstance(Routine, result);
	}

	async update(args: any): Promise<Routine> {
		this.logger.debug(`Routine 업데이트 중...`);
		const result = await this.prisma.routine.update(args);
		return plainToInstance(Routine, result);
	}

	async updateMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`Routine 다중 업데이트 중...`);
		return await this.prisma.routine.updateMany(args);
	}

	async delete(args: any): Promise<Routine> {
		this.logger.debug(`Routine 삭제 중...`);
		const result = await this.prisma.routine.delete(args);
		return plainToInstance(Routine, result);
	}

	async findMany(args: any): Promise<Routine[]> {
		this.logger.debug(`Routine 다중 조회 중...`);
		const result = await this.prisma.routine.findMany(args);
		return result.map((item) => plainToInstance(Routine, item));
	}

	async findFirst(args: any): Promise<Routine> {
		this.logger.debug(`Routine 최초 조회 중...`);
		const result = await this.prisma.routine.findFirst(args);
		return plainToInstance(Routine, result);
	}

	async findUnique(args: any): Promise<Routine> {
		this.logger.debug(`Routine 고유 조회 중...`);
		const result = await this.prisma.routine.findUnique(args);
		return plainToInstance(Routine, result);
	}


	async createManyAndReturn(
		args: any,
	): Promise<Routine[]> {
		this.logger.debug(`Routine 다중 생성 중...`);
		const result = await this.prisma.routine.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Routine, item));
	}

	async deleteMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`Routine 다중 삭제 중...`);
		return await this.prisma.routine.deleteMany(args);
	}

	async aggregate(args: any): Promise<any> {
		this.logger.debug(`Routine 집계 중...`);
		return await this.prisma.routine.aggregate(args);
	}

	async count(args: any): Promise<number> {
		this.logger.debug(`Routine 개수 세기 중...`);
		return await this.prisma.routine.count(args);
	}
}
