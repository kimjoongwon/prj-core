import { UseEntity } from "@cocrepo/decorator";
import { Role } from "@cocrepo/entity";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
@UseEntity(Role)
export class RolesRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("Role");
	}

	async create(args: any): Promise<Role> {
		this.logger.debug(`Role 생성 중...`);
		const result = await this.prisma.role.create(args);
		return plainToInstance(Role, result);
	}

	async upsert(args: any): Promise<Role> {
		this.logger.debug(`Role 업서트 중...`);
		const result = await this.prisma.role.upsert(args);
		return plainToInstance(Role, result);
	}

	async update(args: any): Promise<Role> {
		this.logger.debug(`Role 업데이트 중...`);
		const result = await this.prisma.role.update(args);
		return plainToInstance(Role, result);
	}

	async updateMany(args: any): Promise<any> {
		this.logger.debug(`Role 다중 업데이트 중...`);
		return await this.prisma.role.updateMany(args);
	}

	async delete(args: any): Promise<Role> {
		this.logger.debug(`Role 삭제 중...`);
		const result = await this.prisma.role.delete(args);
		return plainToInstance(Role, result);
	}

	async findMany(args: any): Promise<Role[]> {
		this.logger.debug(`Role 다중 조회 중...`);
		const result = await this.prisma.role.findMany(args);
		return result.map((item) => plainToInstance(Role, item));
	}

	async findFirst(args: any): Promise<Role> {
		this.logger.debug(`Role 최초 조회 중...`);
		const result = await this.prisma.role.findFirst(args);
		return plainToInstance(Role, result);
	}

	async findUnique(args: any): Promise<Role> {
		this.logger.debug(`Role 고유 조회 중...`);
		const result = await this.prisma.role.findUnique(args);
		return plainToInstance(Role, result);
	}

	async createManyAndReturn(args: any): Promise<Role[]> {
		this.logger.debug(`Role 다중 생성 중...`);
		const result = await this.prisma.role.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Role, item));
	}

	async deleteMany(args: any): Promise<any> {
		this.logger.debug(`Role 다중 삭제 중...`);
		return await this.prisma.role.deleteMany(args);
	}

	async aggregate(args: any): Promise<any> {
		this.logger.debug(`Role 집계 중...`);
		return await this.prisma.role.aggregate(args);
	}

	async count(args: any): Promise<number> {
		this.logger.debug(`Role 개수 세기 중...`);
		return await this.prisma.role.count(args);
	}
}
