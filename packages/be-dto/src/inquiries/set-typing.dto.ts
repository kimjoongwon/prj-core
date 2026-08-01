import { BooleanFieldOptional, ULIDFieldOptional } from "@cocrepo/decorator";

/**
 * 타이핑 상태 설정 DTO
 */
export class SetTypingDto {
	@BooleanFieldOptional({
		description: "타이핑 중 여부",
	})
	isTyping?: boolean;

	@ULIDFieldOptional({
		description: "타이핑 중인 스레드 ID",
	})
	threadId?: string;
}
