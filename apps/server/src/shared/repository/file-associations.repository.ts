import { FileAssociation } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
export class FileAssociationsRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("FileAssociation");
	}

	async create(
		args: Prisma.FileAssociationCreateArgs,
	): Promise<FileAssociation> {
		this.logger.debug(`FileAssociation 생성 중...`);
		const result = await this.prisma.fileAssociation.create(args);
		return plainToInstance(FileAssociation, result);
	}

	async upsert(
		args: Prisma.FileAssociationUpsertArgs,
	): Promise<FileAssociation> {
		this.logger.debug(`FileAssociation 업서트 중...`);
		const result = await this.prisma.fileAssociation.upsert(args);
		return plainToInstance(FileAssociation, result);
	}

	async update(
		args: Prisma.FileAssociationUpdateArgs,
	): Promise<FileAssociation> {
		this.logger.debug(`FileAssociation 업데이트 중...`);
		const result = await this.prisma.fileAssociation.update(args);
		return plainToInstance(FileAssociation, result);
	}

	async updateMany(
		args: Prisma.FileAssociationUpdateManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`FileAssociation 다중 업데이트 중...`);
		return await this.prisma.fileAssociation.updateMany(args);
	}

	async delete(
		args: Prisma.FileAssociationDeleteArgs,
	): Promise<FileAssociation> {
		this.logger.debug(`FileAssociation 삭제 중...`);
		const result = await this.prisma.fileAssociation.delete(args);
		return plainToInstance(FileAssociation, result);
	}

	async findMany(
		args: Prisma.FileAssociationFindManyArgs,
	): Promise<FileAssociation[]> {
		this.logger.debug(`FileAssociation 다중 조회 중...`);
		const result = await this.prisma.fileAssociation.findMany(args);
		return result.map((item) => plainToInstance(FileAssociation, item));
	}

	async findFirst(
		args: Prisma.FileAssociationFindFirstArgs,
	): Promise<FileAssociation> {
		this.logger.debug(`FileAssociation 최초 조회 중...`);
		const result = await this.prisma.fileAssociation.findFirst(args);
		return plainToInstance(FileAssociation, result);
	}

	async findUnique(
		args: Prisma.FileAssociationFindUniqueArgs,
	): Promise<FileAssociation> {
		this.logger.debug(`FileAssociation 고유 조회 중...`);
		const result = await this.prisma.fileAssociation.findUnique(args);
		return plainToInstance(FileAssociation, result);
	}

	async createManyAndReturn(
		args: Prisma.FileAssociationCreateManyAndReturnArgs,
	): Promise<FileAssociation[]> {
		this.logger.debug(`FileAssociation 다중 생성 중...`);
		const result = await this.prisma.fileAssociation.createManyAndReturn(args);
		return result.map((item) => plainToInstance(FileAssociation, item));
	}

	async deleteMany(
		args: Prisma.FileAssociationDeleteManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`FileAssociation 다중 삭제 중...`);
		return await this.prisma.fileAssociation.deleteMany(args);
	}

	async aggregate(
		args: Prisma.FileAssociationAggregateArgs,
	): Promise<Prisma.GetFileAssociationAggregateType<typeof args>> {
		this.logger.debug(`FileAssociation 집계 중...`);
		return await this.prisma.fileAssociation.aggregate(args);
	}

	async count(args: Prisma.FileAssociationCountArgs): Promise<number> {
		this.logger.debug(`FileAssociation 개수 세기 중...`);
		return await this.prisma.fileAssociation.count(args);
	}
}
