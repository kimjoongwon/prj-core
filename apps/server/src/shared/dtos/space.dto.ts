import { Space } from '@prisma/client';
import { ClassField, StringField, UUIDField } from '../decorators/field.decorators';
import { Association } from '../entities/association.entity';
import { AbstractDto } from './abstract.dto';
import { AssociationDto } from './association.dto';
import { ClassificationDto } from './classification.dto';
import { TenantDto } from './tenant.dto';

export class SpaceDto extends AbstractDto implements Space {
  @StringField()
  label: string;

  @StringField()
  name: string;

  @UUIDField()
  tenantId: string;

  @ClassField(() => ClassificationDto, { required: false, swagger: false })
  classification?: ClassificationDto;

  @ClassField(() => AssociationDto, { required: false, each: true, swagger: false })
  associations?: Association[];

  @ClassField(() => TenantDto, { required: false, swagger: false })
  tenant?: TenantDto;
}
