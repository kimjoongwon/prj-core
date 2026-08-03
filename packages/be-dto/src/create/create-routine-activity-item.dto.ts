import {
	BigIntIdField,
	NumberFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";

export class CreateRoutineActivityItemDto {
	@BigIntIdField()
	taskId: bigint;

	@NumberFieldOptional()
	order?: number;

	@NumberFieldOptional()
	repetitions?: number;

	@NumberFieldOptional()
	restTime?: number;

	@StringFieldOptional()
	notes?: string;
}
