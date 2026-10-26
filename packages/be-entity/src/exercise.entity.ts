import {
	BigIntIdFieldMetadata,
	ClassField,
	NumberFieldMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
	UUIDFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { ExerciseSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Task } from "./task.entity";

@AbstractEntityFields()
export class Exercise extends ExerciseSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare exerciseId: ExerciseSchema["exerciseId"];

	@NumberFieldMetadata() declare duration: ExerciseSchema["duration"];
	@NumberFieldMetadata() declare count: ExerciseSchema["count"];
	@BigIntIdFieldMetadata() declare taskId: ExerciseSchema["taskId"];
	@StringFieldOptionalMetadata({ nullable: true })
	declare description: ExerciseSchema["description"];
	@UUIDFieldOptionalMetadata({ nullable: true })
	declare imageFileId: ExerciseSchema["imageFileId"];
	@UUIDFieldOptionalMetadata({ nullable: true })
	declare videoFileId: ExerciseSchema["videoFileId"];
	@StringFieldMetadata() declare name: ExerciseSchema["name"];

	@ClassField(() => Task) task?: Task;
}
