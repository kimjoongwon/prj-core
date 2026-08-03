import {
	NumberField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Action, Prisma } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";

/**
 * Action 응답 DTO
 * CASL Action 정의 - 행위의 완전한 정의 (마스킹 설정 포함)
 *
 * 사용 예시:
 * - 목록 조회: exclude: ['config', 'description', 'order']
 * - 상세 조회: exclude 없음 (전체 필드 반환)
 */
export class ActionDto
	extends AbstractDto
	implements DomainEntityModel<Action, "actionId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly actionId?: never;

	@StringField()
	name!: string;

	@StringFieldOptional()
	displayName!: string | null;

	@StringFieldOptional()
	description!: string | null;

	@StringFieldOptional()
	group!: string | null;

	@NumberField()
	order!: number;

	// JSON 필드는 타입만 정의 (별도 데코레이터 없음)
	config!: Prisma.JsonValue | null;
}
