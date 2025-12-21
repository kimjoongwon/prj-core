import { UseEntity } from "@cocrepo/decorator";
import { SpaceAssociation } from "@cocrepo/entity";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
@UseEntity(SpaceAssociation)
export class SpaceAssociationsRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("SpaceAssociation");
	}

	async create(
		args: any,
	): Promise<SpaceAssociation> {
		this.logger.debug(`SpaceAssociation 생성 중...`);
		const result = await this.prisma.spaceAssociation.create(args);
		return plainToInstance(SpaceAssociation, result);
	}

	async upsert(
		args: any,
	): Promise<SpaceAssociation> {
		this.logger.debug(`SpaceAssociation 업서트 중...`);
		const result = await this.prisma.spaceAssociation.upsert(args);
		return plainToInstance(SpaceAssociation, result);
	}

	async update(
		args: any,
	): Promise<SpaceAssociation> {
		this.logger.debug(`SpaceAssociation 업데이트 중...`);
		const result = await this.prisma.spaceAssociation.update(args);
		return plainToInstance(SpaceAssociation, result);
	}

	async updateMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`SpaceAssociation 다중 업데이트 중...`);
		return await this.prisma.spaceAssociation.updateMany(args);
	}

	async delete(
		args: any,
	): Promise<SpaceAssociation> {
		this.logger.debug(`SpaceAssociation 삭제 중...`);
		const result = await this.prisma.spaceAssociation.delete(args);
		return plainToInstance(SpaceAssociation, result);
	}

	async findMany(
		args: any,
	): Promise<SpaceAssociation[]> {
		this.logger.debug(`SpaceAssociation 다중 조회 중...`);
		const result = await this.prisma.spaceAssociation.findMany(args);
		return result.map((item) => plainToInstance(SpaceAssociation, item));
	}

	async findFirst(
		args: any,
	): Promise<SpaceAssociation> {
		this.logger.debug(`SpaceAssociation 최초 조회 중...`);
		const result = await this.prisma.spaceAssociation.findFirst(args);
		return plainToInstance(SpaceAssociation, result);
	}

	async findUnique(
		args: any,
	): Promise<SpaceAssociation> {
		this.logger.debug(`SpaceAssociation 고유 조회 중...`);
		const result = await this.prisma.spaceAssociation.findUnique(args);
		return plainToInstance(SpaceAssociation, result);
	}


	async createManyAndReturn(
		args: any,
	): Promise<SpaceAssociation[]> {
		this.logger.debug(`SpaceAssociation 다중 생성 중...`);
		const result = await this.prisma.spaceAssociation.createManyAndReturn(args);
		return result.map((item) => plainToInstance(SpaceAssociation, item));
	}

	async deleteMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`SpaceAssociation 다중 삭제 중...`);
		return await this.prisma.spaceAssociation.deleteMany(args);
	}

	async aggregate(args: any): Promise<any> {
		this.logger.debug(`SpaceAssociation 집계 중...`);
		return await this.prisma.spaceAssociation.aggregate(args);
	}

	async count(args: any): Promise<number> {
		this.logger.debug(`SpaceAssociation 개수 세기 중...`);
		return await this.prisma.spaceAssociation.count(args);
	}
}
