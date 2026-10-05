import { Action } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

/**
 * Action 생성 DTO
 */
export class CreateActionDto extends PickType(Action, [
	"name",
	"displayName",
	"description",
	"group",
	"order",
] as const) {}
