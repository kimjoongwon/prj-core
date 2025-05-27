import { $Enums, Category as CategoryEntity } from '@prisma/client';
import { Service } from './service.entity';
import { AbstractEntity } from './abstract.entity';
import { Classification } from './user-classification.entity';
import { CategoryDto } from '../dto';
import { UseDto } from '../decorator/use-dto.decorator';
import { Tenant } from './tenant.entity';

@UseDto(CategoryDto)
export class Category extends AbstractEntity<CategoryDto> implements CategoryEntity {
  name: string;
  type: $Enums.CategoryTypes;
  parentId: string | null;
  serviceId: string;
  tenantId: string;

  parent?: Category;
  children?: Category[];
  service?: Service;
  classification?: Classification;
  tenant?: Tenant;

  toOption() {
    return {
      key: this.id,
      value: this.id,
      text: this.name,
    };
  }
}
