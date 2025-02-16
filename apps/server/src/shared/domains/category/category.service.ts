import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../../repositories';
import { Category } from '../../entities/category.entity';
import { $Enums } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

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
    const categories =
      await this.categoriesRepository.findLastLeafCategoriesByServiceName(serviceName);
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
