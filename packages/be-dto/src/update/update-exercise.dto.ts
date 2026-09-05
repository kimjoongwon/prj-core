import { Exercise } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

export class UpdateExerciseDto extends PartialType(
	PickType(Exercise, [
		"duration",
		"count",
		"description",
		"imageFileId",
		"videoFileId",
		"name",
	] as const),
) {}
