import {
	BigIntIdFieldOptional,
	BooleanFieldOptional,
} from "@cocrepo/decorator/field";

/**
 * 타이핑 상태 설정 DTO
 */
export class SetTypingDto {
	@BooleanFieldOptional({
		description: "타이핑 중 여부",
	})
	isTyping?: boolean;

	@BigIntIdFieldOptional({
		description: "타이핑 중인 스레드 ID",
	})
	threadId?: bigint;
}
