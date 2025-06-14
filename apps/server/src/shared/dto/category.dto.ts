import { $Enums, Category } from '@prisma/client';
import { ClassField, EnumField, StringField, UUIDField } from '../decorator/field.decorators';
import { AbstractDto } from './abstract.dto';
import { ServiceDto } from './service.dto';

export class CategoryDto extends AbstractDto implements Category {
  @UUIDField()
  tenantId: string;

  @StringField({ default: '' })
  name: string;

  @EnumField(() => $Enums.CategoryTypes, { default: $Enums.CategoryTypes.Role })
  type: $Enums.CategoryTypes;

  @UUIDField({ nullable: true, default: null })
  parentId: string | null;

  @ClassField(() => CategoryDto, { required: false })
  parent?: CategoryDto;

  @ClassField(() => CategoryDto, { each: true, required: false })
  children?: CategoryDto[];
}
