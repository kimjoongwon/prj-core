import { QueryCategoryDto, UpdateCategoryDto } from "@cocrepo/dto";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { CategoriesRepository } from "../../repository/categories.repository";
import { AppLogger } from "../../util/app-logger.util";
import { ContextService } from "../utils";

@Injectable()
export class CategoriesService {
	private readonly logger = new AppLogger(CategoriesService.name);
	constructor(
		private readonly repository: CategoriesRepository,
		private readonly contextService: ContextService,
	) {}

	async create(args: any) {
		const currentTenant = this.contextService.getTenant();
		if (!currentTenant) {
			throw new Error("No tenant found in context");
		}

		// tenant 관계를 자동으로 설정
		const createArgs = {
			...args,
			data: {
				...args.data,
				tenant: {
					connect: {
						id: currentTenant.id,
					},
				},
			},
		} as Prisma.CategoryCreateArgs;

		const services = await this.repository.create(createArgs);
		return services;
	}

	getById(id: string) {
		return this.repository.findUnique({ where: { id } });
	}

	updateById(id: string, updateCategoryDto: UpdateCategoryDto) {
		return this.repository.update({
			where: { id },
			data: updateCategoryDto,
		});
	}

	deleteById(id: string) {
		return this.repository.delete({ where: { id } });
	}

	removeById(id: string) {
		return this.repository.update({
			where: { id },
			data: { removedAt: new Date() },
		});
	}

	async getManyByQuery(query: QueryCategoryDto) {
		const currentTenant = this.contextService.getTenant();
		this.logger.debug("getManyByQuery - Current Tenant:", {
			tenantId: currentTenant?.id?.slice(-8) || "null",
			spaceId: currentTenant?.spaceId?.slice(-8) || "null",
			timestamp: new Date().toISOString(),
		});

		this.logger.debug("getManyByQuery - Query Args:", query);
		if (!currentTenant) {
			this.logger.warn("getManyByQuery - No tenant found in context");
			throw new Error(
				"Tenant information not found in context. Please log in again.",
			);
		}
		if (!currentTenant.spaceId) {
			this.logger.warn("getManyByQuery - No spaceId in tenant:", {
				tenantId: currentTenant.id?.slice(-8),
				hasSpaceId: !!currentTenant.spaceId,
			});
			throw new Error(
				"Space ID is missing from tenant information. Please select a space.",
			);
		}
		this.logger.debug("getManyByQuery - Query Args:", {
			args: query.toArgs<Prisma.CategoryFindManyArgs>({
				where: {
					parent: null,
					tenant: {
						spaceId: currentTenant.spaceId,
					},
				},
				include: {
					children: {
						include: {
							children: {
								include: {
									children: true,
								},
							},
						},
					},
				},
			}),
			countArgs: query.toCountArgs<Prisma.CategoryCountArgs>(),
		});
		const args = query.toArgs<Prisma.CategoryFindManyArgs>({
			where: {
				parent: null,
				tenant: {
					spaceId: currentTenant?.spaceId,
				},
			},
			include: {
				children: {
					include: {
						children: {
							include: {
								children: true,
							},
						},
					},
				},
			},
		});

		const countArgs = query.toCountArgs<Prisma.CategoryCountArgs>();
		const categories = await this.repository.findMany(args);
		const count = await this.repository.count(countArgs);

		return {
			categories,
			count,
		};
	}
}
