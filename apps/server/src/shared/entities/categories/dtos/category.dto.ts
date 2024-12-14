import { $Enums } from '@prisma/client';
import { EnumField, StringField, UUIDField } from '../../../decorators/field.decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { CategoryEntity } from '../category.entity';

export class CategoryDto extends AbstractDto implements CategoryEntity {
  @EnumField(() => $Enums.CategoryTypes)
  type: $Enums.CategoryTypes;

  @StringField()
  name: string;

  @StringField({ nullable: true })
  parentId: string | null;

  @UUIDField()
  tenantId: string;

  @StringField()
  serviceId: string;
}
