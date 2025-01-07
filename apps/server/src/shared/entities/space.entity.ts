import { Space as SpaceEntity } from '@prisma/client';
import { AbstractEntity } from './abstract.entity';
import { Classification } from './classification.entity';
import { Association } from './association.entity';
import { Tenancy } from './tenancy.entity';
import { Tenant } from './tenant.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { SpaceDto } from '../dtos';

@UseDto(SpaceDto)
export class Space extends AbstractEntity<SpaceDto> implements SpaceEntity {
  name: string;
  classificationId: string | null;

  classification?: Classification;
  associations?: Association[];
  tenancy?: Tenancy;
  tenants?: Tenant[];
}
