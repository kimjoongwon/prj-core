import { StringFieldOptional } from "@cocrepo/decorator/field";
import { Activity } from "@cocrepo/entity";
import { IntersectionType, PartialType, PickType } from "@nestjs/swagger";

export class CreateRoutineActivityItemDto extends IntersectionType(
	PickType(Activity, ["taskId"] as const),
	PartialType(
		PickType(Activity, ["order", "repetitions", "restTime"] as const),
		{ skipNullProperties: false },
	),
) {
	@StringFieldOptional()
	notes?: string;
}
