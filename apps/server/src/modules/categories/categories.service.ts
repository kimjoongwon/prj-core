import { Injectable } from '@nestjs/common';
import { PrismaService } from '../global/prisma/prisma.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { GetCategoriesArgs } from './dto/get-categories.args';
import { queryBuilder } from '@common';
import { last } from 'lodash';
import { PaginatedCategory } from './models/paginated-category.model';
import { UpdateCategoryInput } from './dto/update-category.input';
import { ServicesService } from '@modules/services/services.service';
import { CategoryItemsService } from '@modules/category-items/category-items.service';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly servicesService: ServicesService,
    private readonly categoryItemsService: CategoryItemsService,
  ) {}

  create(createCategoryInput: CreateCategoryInput) {
    return this.prisma.category.create({
      data: createCategoryInput,
    });
  }

  update(updateCategoryInput: UpdateCategoryInput) {
    return this.prisma.category.update({
      where: {
        id: updateCategoryInput.id,
      },
      data: {
        name: updateCategoryInput.name,
        categoryItemId: updateCategoryInput.categoryItemId,
      },
    });
  }

  findById(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async findForm(id: string) {
    const serviceOptions = await this.servicesService.findAllServiceOptions();
    const categoryItemOptions =
      await this.categoryItemsService.findRootCategoryItemOptions();
    console.log('findForm');
    if (id === 'new') {
      console.log('new', serviceOptions, categoryItemOptions);
      return {
        name: '',
        categoryItemId: '',
        serviceId: '',
        serviceOptions,
        categoryItemOptions,
      };
    }

    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    return {
      name: category.name,
      categoryItemId: category.categoryItemId,
      serviceId: category.serviceId,
      serviceOptions,
      categoryItemOptions,
    };
  }

  async findPaginatedCategory(
    args: GetCategoriesArgs,
  ): Promise<PaginatedCategory> {
    const query = queryBuilder(args, []);

    const categories = await this.prisma.category.findMany(query);

    const totalCount = await this.prisma.category.count({
      where: query?.where,
    });

    const endCursor = last(categories)?.id || '';
    const result = {
      edges: categories?.map(category => ({ node: category })) || [],
      nodes: categories || [],
      pageInfo: {
        totalCount,
        endCursor: endCursor || 'empty',
        hasNextPage: !(categories.length < args.take),
      } || {
        totalCount: 0,
        endCursor: 'empty',
        hasNextPage: false,
      },
    };

    return result;
  }

  remove(id: string) {
    return this.prisma.category.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  deleteMany(ids: string[]) {
    return this.prisma.category.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
