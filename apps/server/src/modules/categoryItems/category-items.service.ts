import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryItemInput } from './dto/create-category-item.input';
import { GetCategoryItemsArgs } from './dto/get-category-items.args';
import { queryBuilder } from '@common';
import { PaginatedCategoryItem } from './model/paginated-category.model';
import { groupBy, last } from 'lodash';
import { categoryItemForm } from './model/category-form.model';
import { UpdateCategoryItemInput } from './dto/update-category-item.input';

@Injectable()
export class CategoryItemsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCategoryItemInput: CreateCategoryItemInput) {
    return this.prisma.categoryItem.create({
      data: createCategoryItemInput,
    });
  }

  findCategoryItemTrees(ids: string[]) {
    return this.prisma.categoryItem.findMany({
      where: {
        parentId: {
          in: ids,
        },
      },
    });
  }

  async findForm(id: string) {
    if (id === 'new') {
      return categoryItemForm;
    }

    const categoryItem = await this.prisma.categoryItem.findUnique({
      where: { id },
    });

    return {
      id: categoryItem.id,
      name: categoryItem.name,
      parentId: categoryItem.parentId,
    };
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

    const endCursor = last(categoryItems)?.id;

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

  update(updateCategoryItemInput: UpdateCategoryItemInput) {
    const { id, ...data } = updateCategoryItemInput;
    return this.prisma.categoryItem.update({
      where: { id },
      data,
    });
  }
  delete(id: string) {
    return this.prisma.categoryItem.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
