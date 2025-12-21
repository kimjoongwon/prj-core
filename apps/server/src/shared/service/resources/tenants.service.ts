import { CreateTenantDto, QueryTenantDto, UpdateTenantDto } from "@cocrepo/dto";
import { Tenant } from "@cocrepo/entity";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { TenantsRepository } from "../../repository/tenants.repository";
import { ContextService } from "../utils";

@Injectable()
export class TenantsService {
	constructor(
		private readonly tenantsRepository: TenantsRepository,
		private readonly contextService: ContextService,
	) {}

	async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
		return this.tenantsRepository.create({
			data: createTenantDto,
			include: {
				space: {
					include: {
						ground: true,
					},
				},
				user: true,
				role: true,
			},
		});
	}

	async getById(id: string): Promise<Tenant> {
		const args: any = {
			where: { id },
			include: {
				space: {
					include: {
						ground: true,
					},
				},
				user: true,
				role: true,
			},
		};
		return this.tenantsRepository.findUnique(args);
	}

	async updateById(
		id: string,
		updateTenantDto: UpdateTenantDto,
	): Promise<Tenant> {
		const args: any = {
			where: { id },
			data: updateTenantDto,
			include: {
				space: {
					include: {
						ground: true,
					},
				},
				user: true,
				role: true,
			},
		};
		return this.tenantsRepository.update(args);
	}

	async removeById(id: string): Promise<Tenant> {
		const args: any = {
			where: { id },
			data: { removedAt: new Date() },
			include: {
				space: {
					include: {
						ground: true,
					},
				},
				user: true,
				role: true,
			},
		};
		return this.tenantsRepository.update(args);
	}

	async deleteById(id: string): Promise<Tenant> {
		return this.tenantsRepository.delete({
			where: { id },
		});
	}

	async getManyByQuery(
		query: QueryTenantDto,
	): Promise<{ tenants: Tenant[]; count: number }> {
		const currentUser = this.contextService.getAuthUser();
		console.log("Current User:", currentUser);
		const args = query?.toArgs({
			where: {
				userId: currentUser?.id,
			},
			include: {
				space: {
					include: {
						ground: true,
					},
				},
				user: true,
				role: true,
			},
		}) as Prisma.TenantFindManyArgs;

		const countArgs = query.toCountArgs<Prisma.TenantCountArgs>();
		const tenants = await this.tenantsRepository.findMany(args);
		const count = await this.tenantsRepository.count(countArgs);

		return {
			tenants,
			count,
		};
	}
}
