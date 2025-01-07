import { $Enums, Service } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { ClassField, EnumField, StringField } from '../decorators/field.decorators';
import { GroupDto } from './group.dto';
import { CategoryDto } from './category.dto';
import { ClassificationDto } from './classification.dto';
import { AssociationDto } from './association.dto';

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
