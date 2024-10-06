import { Injectable } from '@nestjs/common';
import { CategoriesService } from '@shared';

@Injectable()
export class CategoryService {
  constructor(private readonly categoriesService: CategoriesService) {}
  getChildCategories(ansestorIds: string[]) {
    return this.categoriesService.getManyByQuery({
      where: {
        NOT: {
          ancestorIds: {
            equals: ansestorIds || [],
          },
        },
      },
    });
  }
}
