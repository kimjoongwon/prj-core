import { Tenant } from "@cocrepo/entity";
import { Prisma } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PrismaService } from "../service/utils";

@Injectable()
export class TenantsRepository {
	private readonly logger: Logger;

	constructor(private readonly prisma: PrismaService) {
		this.logger = new Logger("Tenant");
	}

	async create(args: Prisma.TenantCreateArgs): Promise<Tenant> {
		this.logger.debug(`Tenant 생성 중...`);
		const result = await this.prisma.tenant.create(args);
		return plainToInstance(Tenant, result);
	}

	async upsert(args: Prisma.TenantUpsertArgs): Promise<Tenant> {
		this.logger.debug(`Tenant 업서트 중...`);
		const result = await this.prisma.tenant.upsert(args);
		return plainToInstance(Tenant, result);
	}

	async update(args: Prisma.TenantUpdateArgs): Promise<Tenant> {
		this.logger.debug(`Tenant 업데이트 중...`);
		const result = await this.prisma.tenant.update(args);
		return plainToInstance(Tenant, result);
	}

	async updateMany(
		args: Prisma.TenantUpdateManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Tenant 다중 업데이트 중...`);
		return await this.prisma.tenant.updateMany(args);
	}

	async delete(args: Prisma.TenantDeleteArgs): Promise<Tenant> {
		this.logger.debug(`Tenant 삭제 중...`);
		const result = await this.prisma.tenant.delete(args);
		return plainToInstance(Tenant, result);
	}

	async findMany(args: Prisma.TenantFindManyArgs): Promise<Tenant[]> {
		this.logger.debug(`Tenant 다중 조회 중...`);
		const result = await this.prisma.tenant.findMany(args);
		return result.map((item) => plainToInstance(Tenant, item));
	}

	async findFirst(args: Prisma.TenantFindFirstArgs): Promise<Tenant> {
		this.logger.debug(`Tenant 최초 조회 중...`);
		const result = await this.prisma.tenant.findFirst(args);
		return plainToInstance(Tenant, result);
	}

	async findUnique(args: Prisma.TenantFindUniqueArgs): Promise<Tenant> {
		this.logger.debug(`Tenant 고유 조회 중...`);
		const result = await this.prisma.tenant.findUnique(args);
		return plainToInstance(Tenant, result);
	}

	async createManyAndReturn(
		args: Prisma.TenantCreateManyAndReturnArgs,
	): Promise<Tenant[]> {
		this.logger.debug(`Tenant 다중 생성 중...`);
		const result = await this.prisma.tenant.createManyAndReturn(args);
		return result.map((item) => plainToInstance(Tenant, item));
	}

	async deleteMany(
		args: Prisma.TenantDeleteManyArgs,
	): Promise<Prisma.BatchPayload> {
		this.logger.debug(`Tenant 다중 삭제 중...`);
		return await this.prisma.tenant.deleteMany(args);
	}

	async aggregate(
		args: Prisma.TenantAggregateArgs,
	): Promise<Prisma.GetTenantAggregateType<typeof args>> {
		this.logger.debug(`Tenant 집계 중...`);
		return await this.prisma.tenant.aggregate(args);
	}

	async count(args: Prisma.TenantCountArgs): Promise<number> {
		this.logger.debug(`Tenant 개수 세기 중...`);
		return await this.prisma.tenant.count(args);
	}
}
