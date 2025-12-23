import { OmitType } from "@nestjs/swagger";
import { AssignmentDto } from "../assignment.dto";
import { COMMON_ENTITY_FIELDS } from "../constant";

export class CreateAssignmentDto extends OmitType(AssignmentDto, [
	...COMMON_ENTITY_FIELDS,
	"role",
	"tenant",
]) {}
