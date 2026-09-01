import {
	NumberField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Subject } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "../abstract.dto";

/**
 * Subject 응답 DTO
 * CASL Subject 정의 - 권한 대상 (entity:xxx, menu:xxx, feature:xxx, ui:xxx)
 */
export class SubjectDto
	extends AbstractDto
	implements DomainEntityModel<Subject, "subjectId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly subjectId?: never;

	@StringField()
	name!: string;

	@StringFieldOptional({ nullable: true })
	displayName!: string | null;

	@StringFieldOptional({ nullable: true })
	icon!: string | null;

	@StringFieldOptional({ nullable: true })
	group!: string | null;

	@NumberField()
	order!: number;
}
