import type { InquiriesRepository } from "@cocrepo/repository";

/**
 * 문의 생성 시 Aggregate가 Repository에 전달하는 내부 숫자 ID 기반 입력입니다.
 */
type InquiryNumericIds = {
	spaceId: bigint;
	createdById?: bigint | null;
	customerId?: bigint | null;
	assigneeId?: bigint | null;
};

export type CreateInquiryAggregateInput = Omit<
	Parameters<InquiriesRepository["create"]>[0],
	"inquiryNumber" | keyof InquiryNumericIds
> &
	InquiryNumericIds;

/**
 * 문의 수정 시 Aggregate가 Repository에 전달하는 내부 숫자 ID 기반 입력입니다.
 */
export type UpdateInquiryAggregateInput = Parameters<
	InquiriesRepository["updateById"]
>[1];
