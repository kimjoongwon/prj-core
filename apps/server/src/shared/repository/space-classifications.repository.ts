import { UseEntity } from "@cocrepo/decorator";
import { SpaceClassification } from "@cocrepo/entity";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
@UseEntity(SpaceClassification)
export class SpaceClassificationsRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("SpaceClassification");
	}

	async create(
		args: any,
	): Promise<SpaceClassification> {
		this.logger.debug(`SpaceClassification 생성 중...`);
		const result = await this.prisma.spaceClassification.create(args);
		return plainToInstance(SpaceClassification, result);
	}

	async upsert(
		args: any,
	): Promise<SpaceClassification> {
		this.logger.debug(`SpaceClassification 업서트 중...`);
		const result = await this.prisma.spaceClassification.upsert(args);
		return plainToInstance(SpaceClassification, result);
	}

	async update(
		args: any,
	): Promise<SpaceClassification> {
		this.logger.debug(`SpaceClassification 업데이트 중...`);
		const result = await this.prisma.spaceClassification.update(args);
		return plainToInstance(SpaceClassification, result);
	}

	async updateMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`SpaceClassification 다중 업데이트 중...`);
		return await this.prisma.spaceClassification.updateMany(args);
	}

	async delete(
		args: any,
	): Promise<SpaceClassification> {
		this.logger.debug(`SpaceClassification 삭제 중...`);
		const result = await this.prisma.spaceClassification.delete(args);
		return plainToInstance(SpaceClassification, result);
	}

	async findMany(
		args: any,
	): Promise<SpaceClassification[]> {
		this.logger.debug(`SpaceClassification 다중 조회 중...`);
		const result = await this.prisma.spaceClassification.findMany(args);
		return result.map((item) => plainToInstance(SpaceClassification, item));
	}

	async findFirst(
		args: any,
	): Promise<SpaceClassification> {
		this.logger.debug(`SpaceClassification 최초 조회 중...`);
		const result = await this.prisma.spaceClassification.findFirst(args);
		return plainToInstance(SpaceClassification, result);
	}

	async findUnique(
		args: any,
	): Promise<SpaceClassification> {
		this.logger.debug(`SpaceClassification 고유 조회 중...`);
		const result = await this.prisma.spaceClassification.findUnique(args);
		return plainToInstance(SpaceClassification, result);
	}


	async createManyAndReturn(
		args: any,
	): Promise<SpaceClassification[]> {
		this.logger.debug(`SpaceClassification 다중 생성 중...`);
		const result =
			await this.prisma.spaceClassification.createManyAndReturn(args);
		return result.map((item) => plainToInstance(SpaceClassification, item));
	}

	async deleteMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`SpaceClassification 다중 삭제 중...`);
		return await this.prisma.spaceClassification.deleteMany(args);
	}

	async aggregate(args: any): Promise<any> {
		this.logger.debug(`SpaceClassification 집계 중...`);
		return await this.prisma.spaceClassification.aggregate(args);
	}

	async count(args: any): Promise<number> {
		this.logger.debug(`SpaceClassification 개수 세기 중...`);
		return await this.prisma.spaceClassification.count(args);
	}
}
