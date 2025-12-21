import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { GroupDto } from "../group.dto";

export class CreateGroupDto extends OmitType(GroupDto, [
	...COMMON_ENTITY_FIELDS,
	"tenant",
]) {}
