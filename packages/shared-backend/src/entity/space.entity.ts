import { Space as SpaceEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { UseDto } from '../decorator/use-dto.decorator';
import { SpaceDto } from '../dto';
import { Tenant } from './tenant.entity';
import { SpaceClassification } from './space-classification.entity';
import { SpaceAssociation } from './space-association.entity';
import { Ground } from './ground.entity';

@UseDto(SpaceDto)
export class Space extends AbstractEntity<SpaceDto> implements SpaceEntity {
  tenants?: Tenant[];
  spaceClassifications?: SpaceClassification[];
  spaceAssociations?: SpaceAssociation[];
  ground?: Ground;
}
