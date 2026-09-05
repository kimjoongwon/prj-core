import { Action } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

/**
 * Action 수정 DTO
 */
export class UpdateActionDto extends PartialType(
	PickType(Action, [
		"name",
		"displayName",
		"description",
		"group",
		"order",
	] as const),
) {}
