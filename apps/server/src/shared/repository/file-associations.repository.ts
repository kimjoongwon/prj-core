import { UseEntity } from "@cocrepo/decorator";
import { FileAssociation } from "@cocrepo/entity";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
@UseEntity(FileAssociation)
export class FileAssociationsRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("FileAssociation");
	}

	async create(
		args: any,
	): Promise<FileAssociation> {
		this.logger.debug(`FileAssociation 생성 중...`);
		const result = await this.prisma.fileAssociation.create(args);
		return plainToInstance(FileAssociation, result);
	}

	async upsert(
		args: any,
	): Promise<FileAssociation> {
		this.logger.debug(`FileAssociation 업서트 중...`);
		const result = await this.prisma.fileAssociation.upsert(args);
		return plainToInstance(FileAssociation, result);
	}

	async update(
		args: any,
	): Promise<FileAssociation> {
		this.logger.debug(`FileAssociation 업데이트 중...`);
		const result = await this.prisma.fileAssociation.update(args);
		return plainToInstance(FileAssociation, result);
	}

	async updateMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`FileAssociation 다중 업데이트 중...`);
		return await this.prisma.fileAssociation.updateMany(args);
	}

	async delete(
		args: any,
	): Promise<FileAssociation> {
		this.logger.debug(`FileAssociation 삭제 중...`);
		const result = await this.prisma.fileAssociation.delete(args);
		return plainToInstance(FileAssociation, result);
	}

	async findMany(
		args: any,
	): Promise<FileAssociation[]> {
		this.logger.debug(`FileAssociation 다중 조회 중...`);
		const result = await this.prisma.fileAssociation.findMany(args);
		return result.map((item) => plainToInstance(FileAssociation, item));
	}

	async findFirst(
		args: any,
	): Promise<FileAssociation> {
		this.logger.debug(`FileAssociation 최초 조회 중...`);
		const result = await this.prisma.fileAssociation.findFirst(args);
		return plainToInstance(FileAssociation, result);
	}

	async findUnique(
		args: any,
	): Promise<FileAssociation> {
		this.logger.debug(`FileAssociation 고유 조회 중...`);
		const result = await this.prisma.fileAssociation.findUnique(args);
		return plainToInstance(FileAssociation, result);
	}


	async createManyAndReturn(
		args: any,
	): Promise<FileAssociation[]> {
		this.logger.debug(`FileAssociation 다중 생성 중...`);
		const result = await this.prisma.fileAssociation.createManyAndReturn(args);
		return result.map((item) => plainToInstance(FileAssociation, item));
	}

	async deleteMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`FileAssociation 다중 삭제 중...`);
		return await this.prisma.fileAssociation.deleteMany(args);
	}

	async aggregate(args: any): Promise<any> {
		this.logger.debug(`FileAssociation 집계 중...`);
		return await this.prisma.fileAssociation.aggregate(args);
	}

	async count(args: any): Promise<number> {
		this.logger.debug(`FileAssociation 개수 세기 중...`);
		return await this.prisma.fileAssociation.count(args);
	}
}
