import { $Enums, Category as CategoryEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { CategoryDto } from "../dto";
import { AbstractEntity } from "./abstract.entity";
import { Tenant } from "./tenant.entity";

@UseDto(CategoryDto)
export class Category extends AbstractEntity<CategoryDto> implements CategoryEntity {
  name: string;
  type: $Enums.CategoryTypes;
  parentId: string | null;
  tenantId: string;

  parent?: Category;
  children?: Category[];
  tenant?: Tenant;

  toOption() {
    return {
      key: this.id,
      value: this.id,
      text: this.name,
    };
  }
}
