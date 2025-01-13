import { $Enums, Action as ActionEntity } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import { AbstractEntity } from './abstract.entity';
import { ActionDto } from '../dtos/action.dto';
import { UseDto } from '../decorators/use-dto.decorator';

@UseDto(ActionDto)
export class Action extends AbstractEntity<ActionDto> implements ActionEntity {
  name: $Enums.AbilityActions;
  conditions: JsonValue | null;
  subjectId: string;
}
