import {
	BooleanField,
	ClassField,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";
import type { Ability, Prisma } from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";
import { ActionDto } from "../action.dto";
import { SubjectSummaryDto } from "../subject.dto";

/**
 * Ability 응답 DTO (Policy 기반)
 * 재사용 가능한 권한 정의
 * - Role 연결은 Policy/RolePolicy 테이블에서 관리
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

	// 메타데이터
	@StringField()
	name!: string; // Required unique identifier

	@StringFieldOptional()
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
