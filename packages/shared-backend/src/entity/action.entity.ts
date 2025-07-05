import { $Enums, Action as ActionEntity } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import { AbstractEntity } from './abstract.entity';
import { ActionDto } from '../dto/action.dto';
import { UseDto } from '../decorator/use-dto.decorator';

@UseDto(ActionDto)
export class Action extends AbstractEntity<ActionDto> implements ActionEntity {
  tenantId: string;
  name: $Enums.AbilityActions;
  conditions: JsonValue | null;
}
