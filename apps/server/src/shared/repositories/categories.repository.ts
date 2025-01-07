import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { UseEntity } from '../decorators/use-dto.decorator';
import { BaseRepository } from '../common/base.repository';
import { Category } from '../entities/category.entity';

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
}
