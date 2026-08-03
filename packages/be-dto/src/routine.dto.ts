import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
	StringField,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Routine } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { ActivityDto } from "./activity.dto";
import { ProgramDto } from "./program.dto";

export class RoutineDto
	extends AbstractDto
	implements DomainEntityModel<Routine, "routineId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly routineId?: never;

	@StringField()
	name: string;

	@StringField()
	label: string;

	@BigIntIdField()
	spaceId: bigint;

	@BigIntIdFieldOptional({ nullable: true })
	createdById: bigint | null;

	@ClassField(() => ProgramDto, { isArray: true })
	programs?: ProgramDto[];

	@ClassField(() => ActivityDto, { isArray: true })
	activities?: ActivityDto[];
}
