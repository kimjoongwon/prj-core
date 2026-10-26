import {
	BigIntIdFieldMetadata,
	BigIntIdFieldOptionalMetadata,
	ClassField,
} from "@cocrepo/decorator/field";
import { TaskSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Activity } from "./activity.entity";
import { Exercise } from "./exercise.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

@AbstractEntityFields()
export class Task extends TaskSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true }) declare taskId: TaskSchema["taskId"];

	@BigIntIdFieldMetadata() declare spaceId: TaskSchema["spaceId"];
	@BigIntIdFieldOptionalMetadata({ nullable: true })
	declare createdById: TaskSchema["createdById"];

	space?: Space;
	createdBy?: User;
	@ClassField(() => Exercise) exercise?: Exercise;
	@ClassField(() => Activity, { isArray: true }) activities?: Activity[];
}
