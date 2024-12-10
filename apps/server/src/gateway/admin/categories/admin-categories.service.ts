import { Injectable } from '@nestjs/common';
import { CategoriesService } from '@shared';

@Injectable()
export class CategoryService {
  constructor(private readonly categoriesService: CategoriesService) {}
  // getChildCategories(ansestorIds: string[]) {
  //   return this.categoriesService.getMany({
  //     where: {
  //       NOT: {
  //         ancestorIds: {
  //           equals: ansestorIds || [],
  //         },
  //       },
  //     },
  //   });
  // }

  // async getAncestorCategories(categoryId: string) {
  //   const category = await this.categoriesService.getUnique({
  //     where: {
  //       id: categoryId,
  //     },
  //   });
  //   const categories = await this.categoriesService.getMany({
  //     where: {
  //       id: {
  //         in: category.ancestorIds,
  //       },
  //     },
  //   });

  //   return categories;
  // }
}
