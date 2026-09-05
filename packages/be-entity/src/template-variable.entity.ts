import {
	BigIntIdField,
	BooleanField,
	ClassField,
	DateField,
	DateFieldOptional,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Template } from "./template.entity";

export class TemplateVariable extends AbstractEntity {
	@BigIntIdField({ description: "ID" })
	declare id: bigint;
	@DateField({ description: "생성일" })
	declare createdAt: Date;
	@DateFieldOptional({ nullable: true, description: "수정일" })
	declare updatedAt: Date | null;

	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true }) templateVariableId!: string;

	// ============================================================================
	// 필수 필드
	// ============================================================================
	@StringField({ description: "변수명" }) name!: string;
	@BooleanField({ description: "필수 여부" }) isRequired!: boolean;
	@BigIntIdField({ description: "템플릿 ID" }) templateId!: bigint;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	@StringFieldOptional({ nullable: true, description: "변수 설명" })
	description!: string | null;
	@StringFieldOptional({ nullable: true, description: "기본값" }) defaultValue!:
		| string
		| null;

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
