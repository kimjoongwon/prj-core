import {
	BooleanFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
	ULIDFieldOptional,
} from "@cocrepo/decorator";
import {
	InquiryCategory,
	InquiryPriority,
	InquiryStatus,
} from "@cocrepo/prisma";

/**
 * 문의 수정 DTO
 */
export class UpdateInquiryDto {
	@StringFieldOptional({
		minLength: 2,
		maxLength: 200,
		description: "문의 제목",
	})
	title?: string;

	@EnumFieldOptional(() => InquiryCategory, {
		description: "문의 카테고리",
	})
	category?: InquiryCategory;

	@EnumFieldOptional(() => InquiryStatus, {
		description: "문의 상태",
	})
	status?: InquiryStatus;

	@EnumFieldOptional(() => InquiryPriority, {
		description: "문의 우선순위",
	})
	priority?: InquiryPriority;

	@ULIDFieldOptional({
		description: "담당자 ID",
	})
	assigneeId?: string;

	@BooleanFieldOptional({
		description: "실시간 채팅 활성화 여부",
	})
	isRealtimeChat?: boolean;
}
