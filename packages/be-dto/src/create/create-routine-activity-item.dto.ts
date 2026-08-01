import {
	NumberFieldOptional,
	StringFieldOptional,
	ULIDField,
} from "@cocrepo/decorator";

export class CreateRoutineActivityItemDto {
	@ULIDField()
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
