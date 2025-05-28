import { Space } from '@prisma/client';
import { ClassField, StringField, UUIDField } from '../decorator/field.decorators';
import { AbstractDto } from './abstract.dto';
import { SpaceAssociationDto } from './space-association.dto';
import { SpaceClassificationDto } from './space-classification.dto';
import { TenantDto } from './tenant.dto';

export class SpaceDto extends AbstractDto implements Space {
  @StringField()
  label: string;

  @StringField()
  name: string;

  @UUIDField()
  tenantId: string;

  @ClassField(() => SpaceClassificationDto, { required: false, swagger: false })
  classification?: SpaceClassificationDto;

  @ClassField(() => SpaceAssociationDto, { required: false, each: true, swagger: false })
  associations?: SpaceAssociationDto[];

  @ClassField(() => TenantDto, { required: false, swagger: false })
  tenant?: TenantDto;
}
