import {
	NumberFieldOptional,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";

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
