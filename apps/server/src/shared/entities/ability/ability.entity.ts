import { $Enums, Ability as AbilityEntity, Prisma } from '@prisma/client';
import { AbstractEntity } from '../common/abstract.entity';

export class Ability extends AbstractEntity implements AbilityEntity {
  type: $Enums.AbilityTypes;
  roleId: string;
  action: $Enums.AbilityActions;
  subjectId: string;
  conditions: Prisma.JsonValue | null;
  description: string | null;
}
