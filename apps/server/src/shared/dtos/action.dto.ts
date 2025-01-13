import { $Enums, Action } from '@prisma/client';
import { AbstractDto } from './abstract.dto';
import { JsonValue } from '@prisma/client/runtime/library';
import { EnumField, StringFieldOptional, UUIDField } from '../decorators';

export class ActionDto extends AbstractDto implements Action {
  @EnumField(() => $Enums.AbilityActions)
  name: $Enums.AbilityActions;

  @StringFieldOptional()
  conditions: JsonValue | null;

  @UUIDField()
  subjectId: string;
}
