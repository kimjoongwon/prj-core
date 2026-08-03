import {
	BigIntIdFieldOptional,
	BooleanFieldOptional,
} from "@cocrepo/decorator/field";

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

	@BigIntIdFieldOptional({
		description: "타이핑 중인 스레드 ID",
	})
	threadId?: bigint;
}
