import { OmitType } from "@nestjs/swagger";
import { AbilityDto } from "../ability.dto";
import { COMMON_ENTITY_FIELDS } from "../constant";

/**
 * Ability 생성 DTO
 */
export class CreateAbilityDto extends OmitType(AbilityDto, [
	...COMMON_ENTITY_FIELDS,
	"action",
	"subject",
]) {}
