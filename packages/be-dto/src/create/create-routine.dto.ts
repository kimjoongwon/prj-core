import {
	ClassField,
	NumberFieldOptional,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";
import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { RoutineDto } from "../routine.dto";

export class CreateRoutineActivityItemDto {
	@UUIDField()
	taskId: string;

	@NumberFieldOptional()
	order?: number;

	@NumberFieldOptional()
	repetitions?: number;

	@NumberFieldOptional()
	restTime?: number;

	@StringFieldOptional()
	notes?: string;
}

export class CreateRoutineDto extends OmitType(RoutineDto, [
	...COMMON_ENTITY_FIELDS,
	"spaceId",
	"creatorId",
	"programs",
	"activities",
]) {
	@ClassField(() => CreateRoutineActivityItemDto, {
		each: true,
		required: false,
	})
	activities?: CreateRoutineActivityItemDto[];
}
