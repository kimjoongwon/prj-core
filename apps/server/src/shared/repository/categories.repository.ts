import { Injectable } from "@nestjs/common";
import { Category, Prisma } from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { BaseRepository } from "../common/base.repository";
import { UseEntity } from "../decorator/use-dto.decorator";
import { PrismaService } from "../service/prisma.service";

@Injectable()
@UseEntity(Category)
export class CategoriesRepository extends BaseRepository<
	Prisma.CategoryCreateArgs,
	Prisma.CategoryUpsertArgs,
	Prisma.CategoryUpdateArgs,
	Prisma.CategoryUpdateManyArgs,
	Prisma.CategoryDeleteArgs,
	Prisma.CategoryFindManyArgs,
	Prisma.CategoryCountArgs,
	Prisma.CategoryAggregateArgs,
	Prisma.CategoryDeleteManyArgs,
	Prisma.CategoryFindFirstArgs,
	Prisma.CategoryFindUniqueArgs,
	Prisma.CategoryGroupByArgs,
	Prisma.CategoryCreateManyArgs,
	Category
> {
	constructor(prisma: PrismaService) {
		super(prisma, "Category");
	}

	async findLastLeafCategoriesByServiceName() {
		const categories = await this.prisma.category.findMany({
			where: {
				children: {
					none: {},
				},
			},
			include: {
				parent: {
					include: { parent: true },
				},
				children: {
					include: {
						children: true,
					},
				},
			},
		});

		return categories.map((category) => plainToInstance(Category, category));
	}
}
