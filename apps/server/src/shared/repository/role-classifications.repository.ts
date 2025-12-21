import { UseEntity } from "@cocrepo/decorator";
import { RoleClassification } from "@cocrepo/entity";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
@UseEntity(RoleClassification)
export class RoleClassificationsRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("RoleClassification");
	}

	async create(
		args: any,
	): Promise<RoleClassification> {
		this.logger.debug(`RoleClassification 생성 중...`);
		const result = await this.prisma.roleClassification.create(args);
		return plainToInstance(RoleClassification, result);
	}

	async upsert(
		args: any,
	): Promise<RoleClassification> {
		this.logger.debug(`RoleClassification 업서트 중...`);
		const result = await this.prisma.roleClassification.upsert(args);
		return plainToInstance(RoleClassification, result);
	}

	async update(
		args: any,
	): Promise<RoleClassification> {
		this.logger.debug(`RoleClassification 업데이트 중...`);
		const result = await this.prisma.roleClassification.update(args);
		return plainToInstance(RoleClassification, result);
	}

	async updateMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`RoleClassification 다중 업데이트 중...`);
		return await this.prisma.roleClassification.updateMany(args);
	}

	async delete(
		args: any,
	): Promise<RoleClassification> {
		this.logger.debug(`RoleClassification 삭제 중...`);
		const result = await this.prisma.roleClassification.delete(args);
		return plainToInstance(RoleClassification, result);
	}

	async findMany(
		args: any,
	): Promise<RoleClassification[]> {
		this.logger.debug(`RoleClassification 다중 조회 중...`);
		const result = await this.prisma.roleClassification.findMany(args);
		return result.map((item) => plainToInstance(RoleClassification, item));
	}

	async findFirst(
		args: any,
	): Promise<RoleClassification> {
		this.logger.debug(`RoleClassification 최초 조회 중...`);
		const result = await this.prisma.roleClassification.findFirst(args);
		return plainToInstance(RoleClassification, result);
	}

	async findUnique(
		args: any,
	): Promise<RoleClassification> {
		this.logger.debug(`RoleClassification 고유 조회 중...`);
		const result = await this.prisma.roleClassification.findUnique(args);
		return plainToInstance(RoleClassification, result);
	}


	async createManyAndReturn(
		args: any,
	): Promise<RoleClassification[]> {
		this.logger.debug(`RoleClassification 다중 생성 중...`);
		const result =
			await this.prisma.roleClassification.createManyAndReturn(args);
		return result.map((item) => plainToInstance(RoleClassification, item));
	}

	async deleteMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`RoleClassification 다중 삭제 중...`);
		return await this.prisma.roleClassification.deleteMany(args);
	}

	async aggregate(args: any): Promise<any> {
		this.logger.debug(`RoleClassification 집계 중...`);
		return await this.prisma.roleClassification.aggregate(args);
	}

	async count(args: any): Promise<number> {
		this.logger.debug(`RoleClassification 개수 세기 중...`);
		return await this.prisma.roleClassification.count(args);
	}
}
