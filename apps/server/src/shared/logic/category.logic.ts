import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories.repository';
import { $Enums } from '@prisma/client';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryLogic {
  constructor(private readonly repository: CategoriesRepository) {}

  async getLastLeafCategoriesByServiceName(serviceName: $Enums.ServiceNames) {
    return this.repository.findMany({
      where: {
        service: {
          name: serviceName,
        },
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
  }

  async getLastLeafCategoryOptionsBy(serviceName: $Enums.ServiceNames) {
    const categories = await this.getCategoryHierarchyNamesHierarchyBy(serviceName);
    const options = categories.map((category) => {
      return {
        key: category[category.length - 1].id,
        text: category.map((c) => c.name).join(' > '),
        value: category[category.length - 1].id,
      };
    });

    return options;
  }

  async getCategoryHierarchyNamesHierarchyBy(serviceName: $Enums.ServiceNames) {
    const categories = await this.getLastLeafCategoriesByServiceName(serviceName);

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
