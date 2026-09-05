import {
	BigIntIdField,
	ClassField,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Task } from "./task.entity";

export class Exercise extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true }) exerciseId!: string;

	@NumberField() duration!: number;
	@NumberField() count!: number;
	@BigIntIdField() taskId!: bigint;
	@StringFieldOptional({ nullable: true }) description!: string | null;
	@UUIDFieldOptional({ nullable: true }) imageFileId!: string | null;
	@UUIDFieldOptional({ nullable: true }) videoFileId!: string | null;
	@StringField() name!: string;

	@ClassField(() => Task) task?: Task;
}
