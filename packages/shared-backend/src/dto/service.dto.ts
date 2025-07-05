import { $Enums, Service } from '@prisma/client';
import { ClassField, EnumField, StringField } from '../decorator/field.decorators';
import { AbstractDto, GroupDto, CategoryDto } from '.';

export class ServiceDto extends AbstractDto implements Service {
  @EnumField(() => $Enums.ServiceNames)
  name: $Enums.ServiceNames;

  @StringField()
  label: string;

  @ClassField(() => GroupDto, { each: true, required: false })
  groups?: GroupDto[];

  @ClassField(() => CategoryDto, { each: true, required: false })
  categories?: CategoryDto[];
}
