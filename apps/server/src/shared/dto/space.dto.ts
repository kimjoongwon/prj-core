import { Space } from '@prisma/client';
import { ClassField } from '../decorator/field.decorators';
import { AbstractDto } from './abstract.dto';
import { TenantDto } from './tenant.dto';
import { SpaceClassificationDto } from './space-classification.dto';
import { SpaceAssociationDto } from './space-association.dto';

export class SpaceDto extends AbstractDto implements Space {
  @ClassField(() => TenantDto, { required: false, swagger: false, isArray: true })
  tenants?: TenantDto[];

  @ClassField(() => SpaceClassificationDto, { required: false, swagger: false, isArray: true })
  spaceClassifications?: SpaceClassificationDto[];

  @ClassField(() => SpaceAssociationDto, { required: false, swagger: false, isArray: true })
  spaceAssociations?: SpaceAssociationDto[];
}
