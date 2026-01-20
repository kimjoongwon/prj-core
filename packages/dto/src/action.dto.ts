import {
	BooleanField,
	NumberField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator";
import type { Action, Prisma } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";

/**
 * Action 응답 DTO
 * CASL Action 정의 - 행위의 완전한 정의 (마스킹 설정 포함)
 *
 * 사용 예시:
 * - 목록 조회: exclude: ['config', 'description', 'order', 'isSystem']
 * - 상세 조회: exclude 없음 (전체 필드 반환)
 */
export class ActionDto extends AbstractDto implements Action {
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

	@BooleanField()
	isSystem!: boolean;

	// JSON 필드는 타입만 정의 (별도 데코레이터 없음)
	config!: Prisma.JsonValue | null;
}
