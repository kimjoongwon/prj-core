import {
	NumberFieldOptional,
	StringFieldOptional,
	ULIDField,
} from "@cocrepo/decorator/field";

export class CreateRoutineActivityItemDto {
	@ULIDField({ description: "작업 공개 ID (ULID)" })
	taskId!: string;

	@NumberFieldOptional({ nullable: true })
	order?: number | null;

	@NumberFieldOptional({ nullable: true })
	repetitions?: number | null;

	@NumberFieldOptional({ nullable: true })
	restTime?: number | null;

	@StringFieldOptional()
	notes?: string;
}
