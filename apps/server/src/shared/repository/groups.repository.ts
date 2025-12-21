import { UseEntity } from "@cocrepo/decorator";
import { Group } from "@cocrepo/entity";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
@UseEntity(Group)
export class GroupsRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("Group");
	}

	async create(args: any): Promise<Group> {
		this.logger.debug(`Group 생성 중...`);
		const result = await this.prisma.group.create(args);
		return plainToInstance(Group, result);
	}

	async upsert(args: any): Promise<Group> {
		this.logger.debug(`Group 업서트 중...`);
		const result = await this.prisma.group.upsert(args);
		return plainToInstance(Group, result);
	}

	async update(args: any): Promise<Group> {
		this.logger.debug(`Group 업데이트 중...`);
		const result = await this.prisma.group.update(args);
		return plainToInstance(Group, result);
	}

	async updateMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`Group 다중 업데이트 중...`);
		return await this.prisma.group.updateMany(args);
	}

	async delete(args: any): Promise<Group> {
		this.logger.debug(`Group 삭제 중...`);
		const result = await this.prisma.group.delete(args);
		return plainToInstance(Group, result);
	}

	async findMany(args: any): Promise<Group[]> {
		this.logger.debug(`Group 다중 조회 중...`);
		const result = await this.prisma.group.findMany(args);
		return result.map((item) => plainToInstance(Group, item));
	}

	async findFirst(args: any): Promise<Group> {
		this.logger.debug(`Group 최초 조회 중...`);
		const result = await this.prisma.group.findFirst(args);
		return plainToInstance(Group, result);
	}

	async findUnique(args: any): Promise<Group> {
		this.logger.debug(`Group 고유 조회 중...`);
		const result = await this.prisma.group.findUnique(args);
		return plainToInstance(Group, result);
	}


	async createManyAndReturn(
		args: any,
	): Promise<Group[]> {
		this.logger.debug(`Group 다중 생성 중...`);
		const result = await this.prisma.group.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Group, item));
	}

	async deleteMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`Group 다중 삭제 중...`);
		return await this.prisma.group.deleteMany(args);
	}

	async aggregate(args: any): Promise<any> {
		this.logger.debug(`Group 집계 중...`);
		return await this.prisma.group.aggregate(args);
	}

	async count(args: any): Promise<number> {
		this.logger.debug(`Group 개수 세기 중...`);
		return await this.prisma.group.count(args);
	}
}
