import {
	EnumField,
	EnumFieldOptional,
	StringField,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import {
	type Inquiry,
	InquiryCategory,
	InquiryChannel,
	InquiryPriority,
	InquirySource,
} from "@cocrepo/prisma";

/**
 * 문의 생성 DTO
 */
export class CreateInquiryDto {
	@StringField({
		minLength: 2,
		maxLength: 200,
		description: "문의 제목",
	})
	title: string;

	@EnumField(() => InquiryCategory, {
		description: "문의 카테고리",
	})
	category: InquiryCategory;

	@EnumField(() => InquiryChannel, {
		description: "문의 채널",
	})
	channel: InquiryChannel;

	@EnumFieldOptional(() => InquirySource, {
		description: "문의 접수 유형 (기본값: ONLINE)",
	})
	source?: InquirySource;

	@EnumFieldOptional(() => InquiryPriority, {
		description: "문의 우선순위 (기본값: NORMAL)",
	})
	priority?: InquiryPriority;

	@UUIDFieldOptional({
		description: "고객 ID",
	})
	customerId?: string;

	@UUIDFieldOptional({
		description: "담당자 ID",
	})
	assigneeId?: string;

	@StringFieldOptional({
		description: "문의 내용 (첫 메시지)",
	})
	content?: string;

	/**
	 * DTO → Entity 변환
	 */
	toEntity(): Partial<Inquiry> {
		const entity: Partial<Inquiry> = {
			title: this.title,
			category: this.category,
			channel: this.channel,
			source: this.source ?? InquirySource.ONLINE,
			priority: this.priority ?? InquiryPriority.NORMAL,
		};

		if (this.customerId) {
			entity.customerId = this.customerId;
		}
		if (this.assigneeId) {
			entity.assigneeId = this.assigneeId;
		}

		return entity;
	}
}
