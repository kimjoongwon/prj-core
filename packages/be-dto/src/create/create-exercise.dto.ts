import { Exercise } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreateExerciseDto extends PickType(Exercise, [
	"duration",
	"count",
	"description",
	"imageFileId",
	"videoFileId",
	"name",
] as const) {}
