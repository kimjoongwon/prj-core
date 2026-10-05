import { DocumentSchema } from "@cocrepo/schema";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import type { Asset } from "./asset.entity";

@AbstractEntityFields()
export class Document extends DocumentSchema {
	/** 공개 식별자 ULID */
	declare documentId: DocumentSchema["documentId"];

	// ============================================================================
	// 필수 필드
	// ============================================================================
	declare assetId: DocumentSchema["assetId"];

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	declare pageCount: DocumentSchema["pageCount"];
	declare wordCount: DocumentSchema["wordCount"];
	declare author: DocumentSchema["author"];
	declare title: DocumentSchema["title"];
	declare subject: DocumentSchema["subject"];
	declare keywords: DocumentSchema["keywords"];

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	asset?: Asset;

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * 문서 유형에 따른 콘텐츠 수를 반환합니다
	 */
	getContentCount(): number | null {
		if (this.pageCount !== null) return this.pageCount;
		if (this.wordCount !== null) return this.wordCount;
		return null;
	}

	/**
	 * 메타데이터 기반으로 문서 유형을 추정합니다
	 */
	getDocumentType(): string {
		// author, title 등의 메타데이터로 추정
		// 실제 파일 확장자는 Asset에서 확인 필요
		if (this.pageCount !== null) {
			return "PDF";
		}
		if (this.wordCount !== null) {
			return "문서";
		}
		return "알 수 없음";
	}

	/**
	 * 텍스트 추출 여부를 확인합니다
	 * (현재 스키마에 extractedTextKey가 없으므로 wordCount 기준)
	 */
	hasExtractedText(): boolean {
		return this.wordCount !== null && this.wordCount > 0;
	}
}
