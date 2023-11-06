import { Injectable } from '@nestjs/common';
import { PrismaService } from '../global/prisma/prisma.service';
import { CreateCategoryItemInput } from './dto/create-category-item.input';
import { GetCategoryItemsArgs } from './dto/get-category-items.args';
import { queryBuilder } from '@common';
import { PaginatedCategoryItem } from './model/paginated-category.model';
import { last } from 'lodash';
import { UpdateCategoryItemInput } from './dto/update-category-item.input';
import { CategoryItemForm } from './model';

@Injectable()
export class CategoryItemsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCategoryItemInput: CreateCategoryItemInput) {
    return this.prisma.categoryItem.create({
      data: createCategoryItemInput,
    });
  }

  findOne(id: string) {
    return this.prisma.categoryItem.findUnique({
      where: { id },
    });
  }

  findCategoryItemTrees() {
    return this.prisma.categoryItem.findMany({
      where: {
        deletedAt: {
          equals: null,
        },
      },
    });
  }

  async findForm(id: string): Promise<CategoryItemForm> {
    if (id === 'new') {
      return {
        ancestorIds: [],
        name: '',
        parentId: null,
        tag: '',
      };
    }

    const categoryItem = await this.prisma.categoryItem.findUnique({
      where: { id },
    });

    return {
      ancestorIds: categoryItem?.ancestorIds,
      name: categoryItem?.name,
      parentId: categoryItem?.parentId,
      tag: categoryItem?.tag,
    };
  }

  async findCategoryItemsByAncestorIds(ids: string[]) {
    const categoryItemsFindedByAncestorIds =
      await this.prisma.categoryItem.findMany({
        where: {
          id: {
            in: ids,
          },
          deletedAt: {
            equals: null,
          },
        },
      });

    return categoryItemsFindedByAncestorIds;
  }

  async findLeafCategoryItemOptions() {
    const leafCategoryItems = await this.findLeafCategoryItems();
    console.log('leafCategoryItems', leafCategoryItems);
    const categoryItemGroupsByAncestorIds = await Promise.all(
      leafCategoryItems?.map(leafCategoryItem =>
        this.findCategoryItemsByAncestorIds([
          ...leafCategoryItem.ancestorIds,
          leafCategoryItem.id,
        ]),
      ),
    );

    const leafCategoryItemOptions = categoryItemGroupsByAncestorIds.map(
      categoryItemGroupByAncestorIds => {
        return {
          name: categoryItemGroupByAncestorIds
            .map(categoryItem => categoryItem.name)
            .join(' > '),
          value: last(categoryItemGroupByAncestorIds)?.id,
        };
      },
    );
    console.log('leafCategoryItemOptions', leafCategoryItemOptions);
    return leafCategoryItemOptions;
  }

  async findLeafCategoryItems() {
    const categoryItems = await this.prisma.categoryItem.findMany({
      where: {
        deletedAt: {
          equals: null,
        },
      },
    });

    const parentIds = categoryItems.map(categoryItem => categoryItem.parentId);

    const leafCategoryItems = categoryItems.filter(
      categoryItem => !parentIds.includes(categoryItem.id),
    );

    return leafCategoryItems;
  }

  async findRootCategoryItemOptions() {
    const categoryItems = await this.prisma.categoryItem.findMany({
      where: {
        parentId: null,
      },
    });

    return categoryItems.map(categoryItem => ({
      name: categoryItem.name,
      value: categoryItem.id,
    }));
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
