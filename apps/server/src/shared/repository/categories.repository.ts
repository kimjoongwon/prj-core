import { Injectable } from '@nestjs/common';
import { $Enums, Prisma } from '@shared/schema';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorator/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Category } from '@shared/schema';
import { plainToInstance } from 'class-transformer';

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
    super(prisma, 'Category');
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

    return categories.map(category => plainToInstance(Category, category));
  }
}
