import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../../constant/entity-common-fields";
import { UUIDField } from "../../decorator";
import { ExerciseDto } from "../exercise.dto";

export class CreateExerciseDto extends OmitType(ExerciseDto, [
	...COMMON_ENTITY_FIELDS,
	"taskId",
	"task",
]) {
	@UUIDField()
	tenantId: string;
}
