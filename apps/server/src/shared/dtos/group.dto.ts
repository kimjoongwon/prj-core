import { Group } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { ClassField, StringField, UUIDField } from '../decorators/field.decorators';
import { ServiceDto } from './service.dto';
import { AssociationDto } from './association.dto';
import { TenancyDto } from './tenancy.dto';

export class GroupDto extends AbstractDto implements Group {
  @StringField()
  name: string;

  @UUIDField()
  tenancyId: string;

  @StringField()
  serviceId: string;

  @ClassField(() => ServiceDto, { required: false })
  service?: ServiceDto;

  @ClassField(() => AssociationDto, { each: true, required: false })
  associations?: AssociationDto[];

  @ClassField(() => TenancyDto, { required: false })
  tenancy?: TenancyDto;
}
