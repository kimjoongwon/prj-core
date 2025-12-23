import { FileClassification } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
export class FileClassificationsRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("FileClassification");
	}

	async create(
		args: Prisma.FileClassificationCreateArgs,
	): Promise<FileClassification> {
		this.logger.debug(`FileClassification 생성 중...`);
		const result = await this.prisma.fileClassification.create(args);
		return plainToInstance(FileClassification, result);
	}

	async upsert(
		args: Prisma.FileClassificationUpsertArgs,
	): Promise<FileClassification> {
		this.logger.debug(`FileClassification 업서트 중...`);
		const result = await this.prisma.fileClassification.upsert(args);
		return plainToInstance(FileClassification, result);
	}

	async update(
		args: Prisma.FileClassificationUpdateArgs,
	): Promise<FileClassification> {
		this.logger.debug(`FileClassification 업데이트 중...`);
		const result = await this.prisma.fileClassification.update(args);
		return plainToInstance(FileClassification, result);
	}

	async updateMany(
		args: Prisma.FileClassificationUpdateManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`FileClassification 다중 업데이트 중...`);
		return await this.prisma.fileClassification.updateMany(args);
	}

	async delete(
		args: Prisma.FileClassificationDeleteArgs,
	): Promise<FileClassification> {
		this.logger.debug(`FileClassification 삭제 중...`);
		const result = await this.prisma.fileClassification.delete(args);
		return plainToInstance(FileClassification, result);
	}

	async findMany(
		args: Prisma.FileClassificationFindManyArgs,
	): Promise<FileClassification[]> {
		this.logger.debug(`FileClassification 다중 조회 중...`);
		const result = await this.prisma.fileClassification.findMany(args);
		return result.map((item) => plainToInstance(FileClassification, item));
	}

	async findFirst(
		args: Prisma.FileClassificationFindFirstArgs,
	): Promise<FileClassification> {
		this.logger.debug(`FileClassification 최초 조회 중...`);
		const result = await this.prisma.fileClassification.findFirst(args);
		return plainToInstance(FileClassification, result);
	}

	async findUnique(
		args: Prisma.FileClassificationFindUniqueArgs,
	): Promise<FileClassification> {
		this.logger.debug(`FileClassification 고유 조회 중...`);
		const result = await this.prisma.fileClassification.findUnique(args);
		return plainToInstance(FileClassification, result);
	}

	async createManyAndReturn(
		args: Prisma.FileClassificationCreateManyAndReturnArgs,
	): Promise<FileClassification[]> {
		this.logger.debug(`FileClassification 다중 생성 중...`);
		const result =
			await this.prisma.fileClassification.createManyAndReturn(args);
		return result.map((item) => plainToInstance(FileClassification, item));
	}

	async deleteMany(
		args: Prisma.FileClassificationDeleteManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`FileClassification 다중 삭제 중...`);
		return await this.prisma.fileClassification.deleteMany(args);
	}

	async aggregate(
		args: Prisma.FileClassificationAggregateArgs,
	): Promise<Prisma.GetFileClassificationAggregateType<typeof args>> {
		this.logger.debug(`FileClassification 집계 중...`);
		return await this.prisma.fileClassification.aggregate(args);
	}

	async count(args: Prisma.FileClassificationCountArgs): Promise<number> {
		this.logger.debug(`FileClassification 개수 세기 중...`);
		return await this.prisma.fileClassification.count(args);
	}
}
