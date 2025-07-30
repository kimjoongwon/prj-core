import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../../constant";
import { ActionDto } from "../action.dto";

export class CreateActionDto extends OmitType(ActionDto, [
	...COMMON_ENTITY_FIELDS,
	"tenant",
]) {}
