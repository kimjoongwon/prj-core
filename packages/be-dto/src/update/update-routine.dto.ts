import { ClassField } from "@cocrepo/decorator/field";
import { Routine } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";
import { CreateRoutineActivityItemDto } from "../create/create-routine-activity-item.dto";

export class UpdateRoutineDto extends PartialType(
	PickType(Routine, ["name", "label"] as const),
) {
	@ClassField(() => CreateRoutineActivityItemDto, {
		each: true,
		isArray: true,
		required: false,
	})
	activities?: CreateRoutineActivityItemDto[];
}
