import { $Enums, Category } from '@prisma/client';
import {
  ClassField,
  EnumField,
  StringField,
  UUIDField,
} from '../../../decorators/field.decorators';
import { AbstractDto } from '../../common/dtos/abstract.dto';
import { ServiceDto } from '../../services/dtos/service.dto';
import { SpaceDto } from '../../spaces/dtos/space.dto';

export class CategoryDto extends AbstractDto implements Category {
  @StringField({ default: '' })
  name: string;

  @EnumField(() => $Enums.CategoryTypes, { default: $Enums.CategoryTypes.LEAF })
  type: $Enums.CategoryTypes;

  @StringField({ nullable: true, default: null })
  parentId: string | null;

  @UUIDField()
  spaceId: string;

  @StringField({ default: '' })
  serviceId: string;

  @ClassField(() => CategoryDto, { required: false })
  parent?: CategoryDto;

  @ClassField(() => CategoryDto, { each: true, required: false })
  children?: CategoryDto[];

  @ClassField(() => SpaceDto, { required: false })
  space?: SpaceDto;

  @ClassField(() => ServiceDto, { required: false })
  service?: ServiceDto;
}
