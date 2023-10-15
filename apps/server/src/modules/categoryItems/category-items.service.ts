import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryItemInput } from './dto/create-category-item.input';
import { GetCategoryItemsArgs } from './dto/get-category-items.args';
import { queryBuilder } from '@common';
import { PaginatedCategoryItem } from './model/paginated-category.model';
import { last } from 'lodash';

@Injectable()
export class CategoryItemsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCategoryItemInput: CreateCategoryItemInput) {
    return this.prisma.categoryItem.create({
      data: createCategoryItemInput,
    });
  }

  async findPaginatedCategoryItem(
    args: GetCategoryItemsArgs,
  ): Promise<PaginatedCategoryItem> {
    const query = queryBuilder(args, []);

    const categoryItems = await this.prisma.categoryItem.findMany({
      ...query,
      include: {
        category: true,
        nextCategoryItem: true,
        prevCategoryItem: true,
      },
    });

    const totalCount = await this.prisma.categoryItem.count({
      where: query?.where,
    });

    const endCursor = last(categoryItems).id;

    return {
      edges: categoryItems.map(category => ({ node: category })),
      nodes: categoryItems,
      pageInfo: {
        totalCount,
        endCursor,
        hasNextPage: !(categoryItems.length < args.take),
      },
    };
  }
}
