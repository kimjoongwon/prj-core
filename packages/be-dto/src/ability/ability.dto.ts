import {
	BigIntIdField,
	BooleanField,
	ClassField,
	NumberField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Ability, Prisma } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "../abstract.dto";
import { ActionDto } from "../action.dto";
import { SubjectSummaryDto } from "../subject.dto";

/**
 * Ability 응답 DTO (Policy 기반)
 * 재사용 가능한 권한 정의
 * - Role 연결은 Policy/RoleAssignment 테이블에서 관리
 */
export class AbilityDto
	extends AbstractDto
	implements DomainEntityModel<Ability, "abilityId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly abilityId?: never;

	// CASL 필수 필드
	@BigIntIdField()
	actionId!: bigint;

	fields!: string[];

	conditions!: Prisma.JsonValue | null;

	@BooleanField()
	inverted!: boolean;

	@StringFieldOptional({ nullable: true })
	reason!: string | null;

	// 연결 대상
	@BigIntIdField()
	subjectId!: bigint;

	// 메타데이터
	@StringField()
	name!: string; // Required unique identifier

	@StringFieldOptional({ nullable: true })
	description!: string | null;

	// 관계 (중첩 DTO)
	@ClassField(() => ActionDto, { required: false })
	action?: ActionDto;

	@ClassField(() => SubjectSummaryDto, { required: false })
	subject?: SubjectSummaryDto;

	// Policy assignment에서 조회할 때 설정되는 필드 (optional)
	@NumberField({ required: false })
	priority?: number;
}
