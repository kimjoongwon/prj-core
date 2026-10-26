import { BigIntIdFieldOptional } from "@cocrepo/decorator/field";
import { InquiryParticipant } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

/**
 * 문의 참여자 상태 업데이트 DTO
 */
export class UpdateInquiryParticipantDto extends PartialType(
	PickType(InquiryParticipant, ["isOnline", "isTyping"] as const),
	{ skipNullProperties: false },
) {
	@BigIntIdFieldOptional({
		description: "타이핑 중인 스레드 ID",
	})
	threadId?: bigint;
}
