import { $Enums, Service } from '@prisma/client';
import { ClassField, EnumField, StringField } from '../decorator/field.decorators';
import { AbstractDto, GroupDto, CategoryDto, ClassificationDto, AssociationDto } from '.';

export class ServiceDto extends AbstractDto implements Service {
  @EnumField(() => $Enums.ServiceNames)
  name: $Enums.ServiceNames;

  @StringField()
  label: string;

  @ClassField(() => GroupDto, { each: true, required: false })
  groups?: GroupDto[];

  @ClassField(() => CategoryDto, { each: true, required: false })
  categories?: CategoryDto[];

  @ClassField(() => ClassificationDto, { each: true, required: false })
  classifications?: ClassificationDto[];

  @ClassField(() => AssociationDto, { each: true, required: false })
  associations?: AssociationDto[];
}
