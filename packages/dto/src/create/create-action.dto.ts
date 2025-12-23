import { OmitType } from "@nestjs/swagger";
import { ActionDto } from "../action.dto";
import { COMMON_ENTITY_FIELDS } from "../constant";

export class CreateActionDto extends OmitType(ActionDto, [
	...COMMON_ENTITY_FIELDS,
	"tenant",
]) {}
