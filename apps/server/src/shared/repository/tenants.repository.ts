import { UseEntity } from "@cocrepo/decorator";
import { Tenant } from "@cocrepo/entity";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
@UseEntity(Tenant)
export class TenantsRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("Tenant");
	}

	async create(args: any): Promise<Tenant> {
		this.logger.debug(`Tenant 생성 중...`);
		const result = await this.prisma.tenant.create(args);
		return plainToInstance(Tenant, result);
	}

	async upsert(args: any): Promise<Tenant> {
		this.logger.debug(`Tenant 업서트 중...`);
		const result = await this.prisma.tenant.upsert(args);
		return plainToInstance(Tenant, result);
	}

	async update(args: any): Promise<Tenant> {
		this.logger.debug(`Tenant 업데이트 중...`);
		const result = await this.prisma.tenant.update(args);
		return plainToInstance(Tenant, result);
	}

	async updateMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`Tenant 다중 업데이트 중...`);
		return await this.prisma.tenant.updateMany(args);
	}

	async delete(args: any): Promise<Tenant> {
		this.logger.debug(`Tenant 삭제 중...`);
		const result = await this.prisma.tenant.delete(args);
		return plainToInstance(Tenant, result);
	}

	async findMany(args: any): Promise<Tenant[]> {
		this.logger.debug(`Tenant 다중 조회 중...`);
		const result = await this.prisma.tenant.findMany(args);
		return result.map((item) => plainToInstance(Tenant, item));
	}

	async findFirst(args: any): Promise<Tenant> {
		this.logger.debug(`Tenant 최초 조회 중...`);
		const result = await this.prisma.tenant.findFirst(args);
		return plainToInstance(Tenant, result);
	}

	async findUnique(args: any): Promise<Tenant> {
		this.logger.debug(`Tenant 고유 조회 중...`);
		const result = await this.prisma.tenant.findUnique(args);
		return plainToInstance(Tenant, result);
	}


	async createManyAndReturn(
		args: any,
	): Promise<Tenant[]> {
		this.logger.debug(`Tenant 다중 생성 중...`);
		const result = await this.prisma.tenant.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Tenant, item));
	}

	async deleteMany(
		args: any,
	): Promise<any> {
		this.logger.debug(`Tenant 다중 삭제 중...`);
		return await this.prisma.tenant.deleteMany(args);
	}

	async aggregate(args: any): Promise<any> {
		this.logger.debug(`Tenant 집계 중...`);
		return await this.prisma.tenant.aggregate(args);
	}

	async count(args: any): Promise<number> {
		this.logger.debug(`Tenant 개수 세기 중...`);
		return await this.prisma.tenant.count(args);
	}
}
