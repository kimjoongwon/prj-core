import { BooleanFieldOptional, UUIDFieldOptional } from "@cocrepo/decorator";

/**
 * 문의 참여자 상태 업데이트 DTO
 */
export class UpdateInquiryParticipantDto {
	@BooleanFieldOptional({
		description: "온라인 여부",
	})
	isOnline?: boolean;

	@BooleanFieldOptional({
		description: "타이핑 중 여부",
	})
	isTyping?: boolean;

	@UUIDFieldOptional({
		description: "타이핑 중인 스레드 ID",
	})
	threadId?: string;
}

/**
 * 타이핑 상태 설정 DTO
 */
export class SetTypingDto {
	@BooleanFieldOptional({
		description: "타이핑 중 여부",
	})
	isTyping?: boolean;

	@UUIDFieldOptional({
		description: "타이핑 중인 스레드 ID",
	})
	threadId?: string;
}
