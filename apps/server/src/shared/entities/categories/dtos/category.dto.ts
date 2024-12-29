import { $Enums } from '@prisma/client';
import { EnumField, StringField, UUIDField } from '../../../decorators/field.decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { CategoryEntity } from '../category.entity';

export class CategoryDto extends AbstractDto implements CategoryEntity {
  @UUIDField()
  spaceId: string;

  @EnumField(() => $Enums.CategoryTypes, { default: $Enums.CategoryTypes.LEAF })
  type: $Enums.CategoryTypes;

  @StringField({ default: '' })
  name: string;

  @StringField({ nullable: true, default: null })
  parentId: string | null;

  @StringField({ default: '' })
  serviceId: string;
}
