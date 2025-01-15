import { $Enums, Ability } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { JsonValue } from '@prisma/client/runtime/library';
import { EnumField, StringFieldOptional, UUIDField } from '../decorators';

export class AbilityDto extends AbstractDto implements Ability {
  @UUIDField()
  tenancyId: string;

  @UUIDField()
  actionId: string;

  @StringFieldOptional({ nullable: true })
  conditions: JsonValue | null;

  @UUIDField()
  subjectId: string;

  @EnumField(() => $Enums.AbilityTypes)
  type: $Enums.AbilityTypes;

  @UUIDField()
  roleId: string;

  @StringFieldOptional({ nullable: true })
  description: string | null;
}
