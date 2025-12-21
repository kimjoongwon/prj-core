import { UseEntity } from "@cocrepo/decorator";
import { Subject } from "@cocrepo/entity";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
@UseEntity(Subject)
export class SubjectsRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("Subject");
	}

	async create(args: any): Promise<Subject> {
		this.logger.debug(`Subject 생성 중...`);
		const result = await this.prisma.subject.create(args);
		return plainToInstance(Subject, result);
	}

	async upsert(args: any): Promise<Subject> {
		this.logger.debug(`Subject 업서트 중...`);
		const result = await this.prisma.subject.upsert(args);
		return plainToInstance(Subject, result);
	}

	async update(args: any): Promise<Subject> {
		this.logger.debug(`Subject 업데이트 중...`);
		const result = await this.prisma.subject.update(args);
		return plainToInstance(Subject, result);
	}

	async updateMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`Subject 다중 업데이트 중...`);
		return await this.prisma.subject.updateMany(args);
	}

	async delete(args: any): Promise<Subject> {
		this.logger.debug(`Subject 삭제 중...`);
		const result = await this.prisma.subject.delete(args);
		return plainToInstance(Subject, result);
	}

	async findMany(args: any): Promise<Subject[]> {
		this.logger.debug(`Subject 다중 조회 중...`);
		const result = await this.prisma.subject.findMany(args);
		return result.map((item) => plainToInstance(Subject, item));
	}

	async findFirst(args: any): Promise<Subject> {
		this.logger.debug(`Subject 최초 조회 중...`);
		const result = await this.prisma.subject.findFirst(args);
		return plainToInstance(Subject, result);
	}

	async findUnique(args: any): Promise<Subject> {
		this.logger.debug(`Subject 고유 조회 중...`);
		const result = await this.prisma.subject.findUnique(args);
		return plainToInstance(Subject, result);
	}


	async createManyAndReturn(
		args: any,
	): Promise<Subject[]> {
		this.logger.debug(`Subject 다중 생성 중...`);
		const result = await this.prisma.subject.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Subject, item));
	}

	async deleteMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`Subject 다중 삭제 중...`);
		return await this.prisma.subject.deleteMany(args);
	}

	async aggregate(args: any): Promise<any> {
		this.logger.debug(`Subject 집계 중...`);
		return await this.prisma.subject.aggregate(args);
	}

	async count(args: any): Promise<number> {
		this.logger.debug(`Subject 개수 세기 중...`);
		return await this.prisma.subject.count(args);
	}
}
