import { Action as ActionEntity, AbilityActions } from "@prisma/client";
import { JsonValue } from "../types/json";
import { UseDto } from "../decorator/use-dto.decorator";
import { ActionDto } from "../dto/action.dto";
import { AbstractEntity } from "./abstract.entity";

@UseDto(ActionDto)
export class Action extends AbstractEntity<ActionDto> implements ActionEntity {
	tenantId: string;
	name: AbilityActions;
	conditions: JsonValue | null;
}
