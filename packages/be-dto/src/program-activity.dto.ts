import {
	BigIntIdField,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { ProgramActivity as ProgramActivityEntity } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";

export class ProgramActivityDto
	extends AbstractDto
	implements DomainEntityModel<ProgramActivityEntity, "programActivityId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly programActivityId?: never;

	@BigIntIdField()
	programId: bigint;

	@BigIntIdField()
	taskId: bigint;

	@NumberField()
	order: number;

	@NumberField()
	repetitions: number;

	@NumberField()
	restTime: number;

	@StringFieldOptional({ nullable: true })
	notes: string | null;

	@StringField()
	exerciseName: string;

	@StringFieldOptional({ nullable: true })
	exerciseDescription: string | null;

	@NumberField()
	exerciseDuration: number;

	@NumberField()
	exerciseCount: number;

	@UUIDFieldOptional({ nullable: true })
	imageFileId: string | null;

	@UUIDFieldOptional({ nullable: true })
	videoFileId: string | null;
}
