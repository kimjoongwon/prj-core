import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { $Enums, Prisma } from '@prisma/client';
import { UpdateCategoryDto } from '../dto/update/update-category.dto';
import { QueryCategoryDto } from '../dto/query/query-category.dto';
import { CategoriesRepository } from '../repository';
import { Category } from '../entity/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: CategoriesRepository,
  ) {}

  async create(args: Prisma.CategoryCreateArgs) {
    const services = await this.prisma.category.create(args);
    return services;
  }

  getFirst(args: Prisma.CategoryFindFirstArgs) {
    return this.prisma.category.findFirst(args);
  }

  createMany(args: Prisma.CategoryCreateManyArgs) {
    return this.prisma.category.createMany(args);
  }

  getUnique(args: Prisma.CategoryFindUniqueArgs) {
    return this.prisma.category.findUnique(args);
  }

  findCategoryById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  getMany(args: Prisma.CategoryFindManyArgs) {
    return this.prisma.category.findMany(args);
  }

  deleteById(categoryId: string) {
    return this.prisma.category.delete({
      where: { id: categoryId },
    });
  }

  async getManyByQuery(query: QueryCategoryDto) {
    const args = query.toArgs<Prisma.CategoryFindManyArgs>({
      where: {
        parent: null,
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
    const categories = await this.prisma.category.findMany(args);
    const count = await this.prisma.category.count(countArgs);

    return {
      categories,
      count,
    };
  }

  async getLastLeafCategoryOptionsBy(serviceName: $Enums.ServiceNames) {
    const categories = await this.getCategoryHierarchyNames(serviceName);
    const options = categories.map((category) => {
      return {
        key: category[category.length - 1].id,
        text: category.map((c) => c.name).join(' > '),
        value: category[category.length - 1].id,
      };
    });

    return options;
  }

  async getCategoryHierarchyNames(serviceName: $Enums.ServiceNames) {
    const categories = await this.repository.findLastLeafCategoriesByServiceName(serviceName);

    let hierarchy = [];

    categories.forEach((category) => {
      let hierarchyCategories = [];
      if (category.parent) {
        const result = this.buildCategoryHierarchyName(category);
        hierarchyCategories = hierarchyCategories.concat(result);
      } else {
        hierarchyCategories.push(category);
      }

      hierarchy.push(hierarchyCategories.reverse());
    });

    hierarchy.map((hierarchy) => {
      hierarchy;
    });

    return hierarchy;
  }

  private buildCategoryHierarchyName(category: Category, hierarchy: Category[] = []) {
    hierarchy.push(category);

    if (category.parent) {
      return this.buildCategoryHierarchyName(category.parent, hierarchy);
    }

    return hierarchy;
  }
}
