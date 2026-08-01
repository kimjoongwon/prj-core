import type { InquiryTag as InquiryTagEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { Inquiry } from "./inquiry.entity";

/**
 * 문의 태그 (분류/검색용)
 *
 * 문의에 태그를 부여하여 분류 및 검색에 활용합니다.
 */
export class InquiryTag
	extends AbstractEntity
	implements DomainEntityModel<InquiryTagEntity>
{
	// ============================================================================
	// 필수 필드
	// ============================================================================
	inquiryId!: string;
	name!: string;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	color!: string | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	inquiry?: Inquiry;
}
