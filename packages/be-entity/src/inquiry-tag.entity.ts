import { InquiryTagSchema } from "@cocrepo/schema";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import type { Inquiry } from "./inquiry.entity";

/**
 * 문의 태그 (분류/검색용)
 *
 * 문의에 태그를 부여하여 분류 및 검색에 활용합니다.
 */
@AbstractEntityFields()
export class InquiryTag extends InquiryTagSchema {
	/** 공개 식별자 ULID */
	declare inquiryTagId: InquiryTagSchema["inquiryTagId"];

	// ============================================================================
	// 필수 필드
	// ============================================================================
	declare inquiryId: InquiryTagSchema["inquiryId"];
	declare name: InquiryTagSchema["name"];

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	declare color: InquiryTagSchema["color"];

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	inquiry?: Inquiry;
}
