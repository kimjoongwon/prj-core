import {
	BooleanField,
	ClassField,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";
import type { Action, Prisma } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";

/**
 * Action 응답 DTO
 * CASL Action 정의 - 행위의 완전한 정의 (마스킹 설정 포함)
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

/**
 * Action 간략 DTO (Ability 내 중첩용)
 */
export class ActionSummaryDto {
	@UUIDField()
	id!: string;

	@StringField()
	name!: string;

	@StringFieldOptional()
	displayName!: string | null;

	@StringFieldOptional()
	group!: string | null;

	config!: Prisma.JsonValue | null;
}
