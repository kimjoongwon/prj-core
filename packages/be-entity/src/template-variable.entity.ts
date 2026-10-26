import {
	BigIntIdFieldMetadata,
	BooleanFieldMetadata,
	ClassField,
	DateFieldMetadata,
	DateFieldOptionalMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { TemplateVariableSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Template } from "./template.entity";

@AbstractEntityFields()
export class TemplateVariable extends TemplateVariableSchema {
	@BigIntIdFieldMetadata({ description: "ID" })
	declare id: bigint;
	@DateFieldMetadata({ description: "생성일" })
	declare createdAt: Date;
	@DateFieldOptionalMetadata({ nullable: true, description: "수정일" })
	declare updatedAt: Date | null;

	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare templateVariableId: TemplateVariableSchema["templateVariableId"];

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@StringFieldMetadata({ description: "변수명" })
	declare name: TemplateVariableSchema["name"];
	@BooleanFieldMetadata({ description: "필수 여부" })
	declare isRequired: TemplateVariableSchema["isRequired"];
	@BigIntIdFieldMetadata({ description: "템플릿 ID" })
	declare templateId: TemplateVariableSchema["templateId"];

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@StringFieldOptionalMetadata({ nullable: true, description: "변수 설명" })
	declare description: TemplateVariableSchema["description"];
	@StringFieldOptionalMetadata({ nullable: true, description: "기본값" })
	declare defaultValue: TemplateVariableSchema["defaultValue"];

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	@ClassField(() => Template, { required: false }) template?: Template;

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
