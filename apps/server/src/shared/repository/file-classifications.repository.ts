import { UseEntity } from "@cocrepo/decorator";
import { FileClassification } from "@cocrepo/entity";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
@UseEntity(FileClassification)
export class FileClassificationsRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("FileClassification");
	}

	async create(
		args: any,
	): Promise<FileClassification> {
		this.logger.debug(`FileClassification 생성 중...`);
		const result = await this.prisma.fileClassification.create(args);
		return plainToInstance(FileClassification, result);
	}

	async upsert(
		args: any,
	): Promise<FileClassification> {
		this.logger.debug(`FileClassification 업서트 중...`);
		const result = await this.prisma.fileClassification.upsert(args);
		return plainToInstance(FileClassification, result);
	}

	async update(
		args: any,
	): Promise<FileClassification> {
		this.logger.debug(`FileClassification 업데이트 중...`);
		const result = await this.prisma.fileClassification.update(args);
		return plainToInstance(FileClassification, result);
	}

	async updateMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`FileClassification 다중 업데이트 중...`);
		return await this.prisma.fileClassification.updateMany(args);
	}

	async delete(
		args: any,
	): Promise<FileClassification> {
		this.logger.debug(`FileClassification 삭제 중...`);
		const result = await this.prisma.fileClassification.delete(args);
		return plainToInstance(FileClassification, result);
	}

	async findMany(
		args: any,
	): Promise<FileClassification[]> {
		this.logger.debug(`FileClassification 다중 조회 중...`);
		const result = await this.prisma.fileClassification.findMany(args);
		return result.map((item) => plainToInstance(FileClassification, item));
	}

	async findFirst(
		args: any,
	): Promise<FileClassification> {
		this.logger.debug(`FileClassification 최초 조회 중...`);
		const result = await this.prisma.fileClassification.findFirst(args);
		return plainToInstance(FileClassification, result);
	}

	async findUnique(
		args: any,
	): Promise<FileClassification> {
		this.logger.debug(`FileClassification 고유 조회 중...`);
		const result = await this.prisma.fileClassification.findUnique(args);
		return plainToInstance(FileClassification, result);
	}


	async createManyAndReturn(
		args: any,
	): Promise<FileClassification[]> {
		this.logger.debug(`FileClassification 다중 생성 중...`);
		const result =
			await this.prisma.fileClassification.createManyAndReturn(args);
		return result.map((item) => plainToInstance(FileClassification, item));
	}

	async deleteMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`FileClassification 다중 삭제 중...`);
		return await this.prisma.fileClassification.deleteMany(args);
	}

	async aggregate(args: any): Promise<any> {
		this.logger.debug(`FileClassification 집계 중...`);
		return await this.prisma.fileClassification.aggregate(args);
	}

	async count(args: any): Promise<number> {
		this.logger.debug(`FileClassification 개수 세기 중...`);
		return await this.prisma.fileClassification.count(args);
	}
}
