import { $Enums, Category } from '@prisma/client';
import { ClassField, EnumField, StringField, UUIDField } from '../decorators/field.decorators';
import { AbstractDto } from './abstract.dto';
import { ServiceDto } from './service.dto';
import { TenancyDto } from './tenancy.dto';
import { ClassificationDto } from './classification.dto';

export class CategoryDto extends AbstractDto implements Category {
  @UUIDField()
  tenancyId: string;

  @StringField({ default: '' })
  name: string;

  @EnumField(() => $Enums.CategoryTypes, { default: $Enums.CategoryTypes.LEAF })
  type: $Enums.CategoryTypes;

  @StringField({ nullable: true, default: null })
  parentId: string | null;

  @StringField()
  serviceId: string;

  @ClassField(() => ServiceDto, { required: false })
  service?: ServiceDto;

  @ClassField(() => CategoryDto, { required: false })
  parent?: CategoryDto;

  @ClassField(() => CategoryDto, { each: true, required: false })
  children?: CategoryDto[];

  @ClassField(() => TenancyDto, { required: false })
  tenancy?: TenancyDto;

  @ClassField(() => ClassificationDto, { each: true, required: false })
  classifications?: ClassificationDto[];
}
