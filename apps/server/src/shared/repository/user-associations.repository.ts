import { UseEntity } from "@cocrepo/decorator";
import { UserAssociation } from "@cocrepo/entity";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
@UseEntity(UserAssociation)
export class UserAssociationsRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("UserAssociation");
	}

	async create(
		args: any,
	): Promise<UserAssociation> {
		this.logger.debug(`UserAssociation 생성 중...`);
		const result = await this.prisma.userAssociation.create(args);
		return plainToInstance(UserAssociation, result);
	}

	async upsert(
		args: any,
	): Promise<UserAssociation> {
		this.logger.debug(`UserAssociation 업서트 중...`);
		const result = await this.prisma.userAssociation.upsert(args);
		return plainToInstance(UserAssociation, result);
	}

	async update(
		args: any,
	): Promise<UserAssociation> {
		this.logger.debug(`UserAssociation 업데이트 중...`);
		const result = await this.prisma.userAssociation.update(args);
		return plainToInstance(UserAssociation, result);
	}

	async updateMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`UserAssociation 다중 업데이트 중...`);
		return await this.prisma.userAssociation.updateMany(args);
	}

	async delete(
		args: any,
	): Promise<UserAssociation> {
		this.logger.debug(`UserAssociation 삭제 중...`);
		const result = await this.prisma.userAssociation.delete(args);
		return plainToInstance(UserAssociation, result);
	}

	async findMany(
		args: any,
	): Promise<UserAssociation[]> {
		this.logger.debug(`UserAssociation 다중 조회 중...`);
		const result = await this.prisma.userAssociation.findMany(args);
		return result.map((item) => plainToInstance(UserAssociation, item));
	}

	async findFirst(
		args: any,
	): Promise<UserAssociation> {
		this.logger.debug(`UserAssociation 최초 조회 중...`);
		const result = await this.prisma.userAssociation.findFirst(args);
		return plainToInstance(UserAssociation, result);
	}

	async findUnique(
		args: any,
	): Promise<UserAssociation> {
		this.logger.debug(`UserAssociation 고유 조회 중...`);
		const result = await this.prisma.userAssociation.findUnique(args);
		return plainToInstance(UserAssociation, result);
	}


	async createManyAndReturn(
		args: any,
	): Promise<UserAssociation[]> {
		this.logger.debug(`UserAssociation 다중 생성 중...`);
		const result = await this.prisma.userAssociation.createManyAndReturn(args);
		return result.map((item) => plainToInstance(UserAssociation, item));
	}

	async deleteMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`UserAssociation 다중 삭제 중...`);
		return await this.prisma.userAssociation.deleteMany(args);
	}

	async aggregate(args: any): Promise<any> {
		this.logger.debug(`UserAssociation 집계 중...`);
		return await this.prisma.userAssociation.aggregate(args);
	}

	async count(args: any): Promise<number> {
		this.logger.debug(`UserAssociation 개수 세기 중...`);
		return await this.prisma.userAssociation.count(args);
	}
}
