import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Timeline } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { SessionDto } from "./session.dto";

export class TimelineDto
	extends AbstractDto
	implements DomainEntityModel<Timeline, "timelineId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly timelineId?: never;

	@BigIntIdField()
	spaceId: bigint;

	@BigIntIdFieldOptional({ nullable: true })
	createdById: bigint | null;

	@StringField()
	name: string;

	@StringFieldOptional({ nullable: true })
	description: string | null;

	@ClassField(() => SessionDto, { isArray: true })
	sessions?: SessionDto[];
}
