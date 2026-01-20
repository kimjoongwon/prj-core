import {
	BooleanField,
	ClassField,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import type { Ability, Prisma } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { ActionDto } from "./action.dto";
import { SubjectSummaryDto } from "./subject.dto";

/**
 * Ability 응답 DTO
 * CASL ABAC 권한 - Role/User와 Subject+Action의 연결
 */
export class AbilityDto extends AbstractDto implements Ability {
	// CASL 필수 필드
	@UUIDField()
	actionId!: string;

	fields!: string[];

	conditions!: Prisma.JsonValue | null;

	@BooleanField()
	inverted!: boolean;

	@StringFieldOptional()
	reason!: string | null;

	// 연결 대상
	@UUIDField()
	subjectId!: string;

	@UUIDFieldOptional()
	roleId!: string | null;

	@UUIDFieldOptional()
	userId!: string | null;

	// 메타데이터
	@StringFieldOptional()
	name!: string | null;

	@StringFieldOptional()
	description!: string | null;

	@BooleanField()
	isActive!: boolean;

	@NumberField()
	priority!: number;

	// 관계 (중첩 DTO)
	@ClassField(() => ActionDto, { required: false })
	action?: ActionDto;

	@ClassField(() => SubjectSummaryDto, { required: false })
	subject?: SubjectSummaryDto;
}

/**
 * Ability 간략 DTO (목록 조회용)
 */
export class AbilitySummaryDto {
	@UUIDField()
	id!: string;

	@UUIDField()
	actionId!: string;

	@UUIDField()
	subjectId!: string;

	@BooleanField()
	inverted!: boolean;

	@BooleanField()
	isActive!: boolean;

	@NumberField()
	priority!: number;

	@ClassField(() => ActionDto, { required: false })
	action?: ActionDto;

	@ClassField(() => SubjectSummaryDto, { required: false })
	subject?: SubjectSummaryDto;
}
