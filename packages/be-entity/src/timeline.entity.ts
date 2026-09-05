import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Session } from "./session.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Timeline extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true }) timelineId!: string;

	@BigIntIdField() spaceId!: bigint;
	@BigIntIdFieldOptional({ nullable: true }) createdById!: bigint | null;
	@StringField() name!: string;
	@StringFieldOptional({ nullable: true }) description!: string | null;

	space?: Space;
	createdBy?: User;
	@ClassField(() => Session, { isArray: true }) sessions?: Session[];
}
