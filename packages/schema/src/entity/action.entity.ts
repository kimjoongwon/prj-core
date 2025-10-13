import { $Enums, Action as ActionEntity } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { UseDto } from "../decorator/use-dto.decorator";
import { ActionDto } from "../dto/action.dto";
import { AbstractEntity } from "./abstract.entity";

@UseDto(ActionDto)
export class Action extends AbstractEntity<ActionDto> implements ActionEntity {
	tenantId: string;
	name: $Enums.AbilityActions;
	conditions: JsonValue | null;
}
