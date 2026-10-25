import {
	BigIntIdFieldMetadata,
	BigIntIdFieldOptionalMetadata,
	ClassField,
} from "@cocrepo/decorator/field";
import { TaskSchema } from "@cocrepo/schema";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Activity } from "./activity.entity";
import { Exercise } from "./exercise.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

@AbstractEntityFields()
export class Task extends TaskSchema {
	/** 공개 식별자 ULID */
	declare id: TaskSchema["id"];

	@BigIntIdFieldMetadata() declare spaceSeq: TaskSchema["spaceSeq"];
	@BigIntIdFieldOptionalMetadata({ nullable: true })
	declare createdBySeq: TaskSchema["createdBySeq"];

	space?: Space;
	createdBy?: User;
	@ClassField(() => Exercise) exercise?: Exercise;
	@ClassField(() => Activity, { isArray: true }) activities?: Activity[];
}
