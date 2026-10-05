import { ClassField } from "@cocrepo/decorator/field";
import { Routine } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";
import { CreateRoutineActivityItemDto } from "../create-routine-activity-item.dto";

export class CreateRoutineDto extends PickType(Routine, [
	"name",
	"label",
] as const) {
	@ClassField(() => CreateRoutineActivityItemDto, {
		each: true,
		isArray: true,
		required: false,
	})
	activities?: CreateRoutineActivityItemDto[];
}
