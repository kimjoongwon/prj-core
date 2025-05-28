import { Space as SpaceEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { SpaceClassification } from './space-classification.entity';
import { SpaceAssociation } from './space-association.entity';
import { Tenant } from './tenant.entity';
import { UseDto } from '../decorator/use-dto.decorator';
import { SpaceDto } from '../dto';

@UseDto(SpaceDto)
export class Space extends AbstractEntity<SpaceDto> implements SpaceEntity {
  label: string;
  name: string;
  tenantId: string;
  classification?: SpaceClassification;
  associations?: SpaceAssociation[];
  tenant?: Tenant;
}
