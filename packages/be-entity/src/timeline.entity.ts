import { AbstractEntity } from "./abstract.entity";
import type { Session } from "./session.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Timeline extends AbstractEntity {
	/** 공개 식별자 ULID */
	timelineId!: string;

	spaceId!: bigint;
	createdById!: bigint | null;
	name!: string;
	description!: string | null;

	space?: Space;
	createdBy?: User;
	sessions?: Session[];
}
