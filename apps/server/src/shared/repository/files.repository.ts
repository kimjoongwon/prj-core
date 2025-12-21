import { UseEntity } from "@cocrepo/decorator";
import { File } from "@cocrepo/entity";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
@UseEntity(File)
export class FilesRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("File");
	}

	async create(args: any): Promise<File> {
		this.logger.debug(`File 생성 중...`);
		const result = await this.prisma.file.create(args);
		return plainToInstance(File, result);
	}

	async upsert(args: any): Promise<File> {
		this.logger.debug(`File 업서트 중...`);
		const result = await this.prisma.file.upsert(args);
		return plainToInstance(File, result);
	}

	async update(args: any): Promise<File> {
		this.logger.debug(`File 업데이트 중...`);
		const result = await this.prisma.file.update(args);
		return plainToInstance(File, result);
	}

	async updateMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`File 다중 업데이트 중...`);
		return await this.prisma.file.updateMany(args);
	}

	async delete(args: any): Promise<File> {
		this.logger.debug(`File 삭제 중...`);
		const result = await this.prisma.file.delete(args);
		return plainToInstance(File, result);
	}

	async findMany(args: any): Promise<File[]> {
		this.logger.debug(`File 다중 조회 중...`);
		const result = await this.prisma.file.findMany(args);
		return result.map((item) => plainToInstance(File, item));
	}

	async findFirst(args: any): Promise<File> {
		this.logger.debug(`File 최초 조회 중...`);
		const result = await this.prisma.file.findFirst(args);
		return plainToInstance(File, result);
	}

	async findUnique(args: any): Promise<File> {
		this.logger.debug(`File 고유 조회 중...`);
		const result = await this.prisma.file.findUnique(args);
		return plainToInstance(File, result);
	}


	async createManyAndReturn(args: any): Promise<File[]> {
		this.logger.debug(`File 다중 생성 중...`);
		const result = await this.prisma.file.createManyAndReturn(args);
		return result.map((item) => plainToInstance(File, item));
	}

	async deleteMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`File 다중 삭제 중...`);
		return await this.prisma.file.deleteMany(args);
	}

	async aggregate(args: any): Promise<any> {
		this.logger.debug(`File 집계 중...`);
		return await this.prisma.file.aggregate(args);
	}

	async count(args: any): Promise<number> {
		this.logger.debug(`File 개수 세기 중...`);
		return await this.prisma.file.count(args);
	}
}
