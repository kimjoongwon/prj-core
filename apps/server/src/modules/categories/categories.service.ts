import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { GetCategoriesArgs } from './dto/get-categories.args';
import { queryBuilder } from '@common';
import { last } from 'lodash';
import { PaginatedCategory } from './models/paginated-category.model';
import { userForm } from '@modules/users/models';
import { Mutation } from '@nestjs/graphql';
import { Category } from './models/category.model';
import { UpdateCategoryInput } from './dto/update-category.input';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

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
      data: updateCategoryInput,
    });
  }

  async findForm(id: string) {
    if (id === 'new') {
      return userForm;
    }
    const category = await this.prisma.category.findUnique({ where: { id } });
    return {
      id: category.id,
      name: category.name,
      categoryItemId: category.categoryItemId,
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

    console.log('result', result);
    return result;
  }
}
