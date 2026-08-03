import { ClassField } from "@cocrepo/decorator/field";
import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../../constant";
import { RoutineDto } from "../../routine.dto";
import { CreateRoutineActivityItemDto } from "../create-routine-activity-item.dto";

export class CreateRoutineDto extends OmitType(RoutineDto, [
	...COMMON_ENTITY_FIELDS,
	"spaceId",
	"createdById",
	"programs",
	"activities",
]) {
	@ClassField(() => CreateRoutineActivityItemDto, {
		each: true,
		required: false,
	})
	activities?: CreateRoutineActivityItemDto[];
}
