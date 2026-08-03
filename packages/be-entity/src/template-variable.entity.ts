import { AbstractEntity } from "./abstract.entity";
import type { Template } from "./template.entity";

export class TemplateVariable extends AbstractEntity {
	/** 공개 식별자 ULID */
	templateVariableId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	name!: string;
	isRequired!: boolean;
	templateId!: bigint;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	description!: string | null;
	defaultValue!: string | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	template?: Template;

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * 기본값이 설정되어 있는지 확인합니다
	 */
	hasDefaultValue(): boolean {
		return this.defaultValue !== null && this.defaultValue.length > 0;
	}

	/**
	 * 플레이스홀더 형태로 반환합니다
	 * 예: "name" -> "{{name}}"
	 */
	toPlaceholder(): string {
		return `{{${this.name}}}`;
	}
}
