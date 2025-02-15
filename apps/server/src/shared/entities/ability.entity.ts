import { JsonValue } from '@prisma/client/runtime/library';
import { AbstractEntity } from './abstract.entity';
import { $Enums, Ability as AbilityEntity } from '@prisma/client';
import { UseDto } from '../decorators/use-dto.decorator';
import { AbilityDto } from '../dtos';

@UseDto(AbilityDto)
export class Ability extends AbstractEntity<AbilityDto> implements AbilityEntity {
  tenantId: string;
  actionId: string;
  conditions: JsonValue | null;
  subjectId: string;
  type: $Enums.AbilityTypes;
  roleId: string;
  description: string | null;
}
