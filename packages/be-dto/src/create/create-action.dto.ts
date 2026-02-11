import { OmitType } from "@nestjs/swagger";
import { ActionDto } from "../action.dto";
import { COMMON_ENTITY_FIELDS } from "../constant";

/**
 * Action 생성 DTO
 */
export class CreateActionDto extends OmitType(ActionDto, [
	...COMMON_ENTITY_FIELDS,
]) {}
