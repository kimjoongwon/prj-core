import type { InquiriesRepository } from "@cocrepo/repository";

/**
 * 문의 생성 시 Aggregate가 Repository에 전달하는 공개 ID 기반 입력입니다.
 */
export type CreateInquiryAggregateInput = Omit<
	Parameters<InquiriesRepository["create"]>[0],
	"inquiryNumber"
>;

/**
 * 문의 수정 시 Aggregate가 Repository에 전달하는 공개 ID 기반 입력입니다.
 */
export type UpdateInquiryAggregateInput = Parameters<
	InquiriesRepository["updateById"]
>[1];
