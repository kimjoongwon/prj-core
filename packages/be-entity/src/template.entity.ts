import {
	BooleanFieldMetadata,
	ClassField,
	EnumFieldMetadata,
	StringFieldMetadata,
	StringFieldOptionalMetadata,
} from "@cocrepo/decorator/field";
import { TemplateType } from "@cocrepo/enum";
import { TemplateSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { TemplateVariable } from "./template-variable.entity";

@AbstractEntityFields()
export class Template extends TemplateSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare templateId: TemplateSchema["templateId"];

	// ============================================================================
	// 필수 필드
	// ============================================================================

	/** 고유 코드 */
	@StringFieldMetadata({ description: "고유 코드" })
	declare code: TemplateSchema["code"];
	/** 템플릿 이름 */
	@StringFieldMetadata({ description: "템플릿 이름" })
	declare name: TemplateSchema["name"];
	/** 템플릿 유형 (EMAIL, SMS, PUSH) */
	@EnumFieldMetadata(() => TemplateType, { description: "템플릿 유형" })
	declare type: TemplateSchema["type"];
	/** 본문 */
	@StringFieldMetadata({ description: "본문" })
	declare content: TemplateSchema["content"];
	/** 활성 상태 */
	@BooleanFieldMetadata({ description: "활성 상태" })
	declare isActive: TemplateSchema["isActive"];

	// ============================================================================
	// Nullable 필드
	// ============================================================================

	/** 제목 */
	@StringFieldOptionalMetadata({ nullable: true, description: "제목" })
	declare subject: TemplateSchema["subject"];
	/** 설명 */
	@StringFieldOptionalMetadata({ nullable: true, description: "설명" })
	declare description: TemplateSchema["description"];

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================

	/** 변수 목록 */
	@ClassField(() => TemplateVariable, {
		required: false,
		each: true,
		isArray: true,
	})
	variables?: TemplateVariable[];

	// ============================================================================
	// 도메인 메서드
	// ============================================================================

	/**
	 * 이메일 템플릿인지 확인합니다
	 */
	isEmail(): boolean {
		return this.type === "EMAIL";
	}

	/**
	 * SMS 템플릿인지 확인합니다
	 */
	isSms(): boolean {
		return this.type === "SMS";
	}

	/**
	 * 푸시 템플릿인지 확인합니다
	 */
	isPush(): boolean {
		return this.type === "PUSH";
	}

	/**
	 * 활성 상태인지 확인합니다
	 */
	isEnabled(): boolean {
		return this.isActive && this.removedAt === null;
	}

	/**
	 * 본문에서 변수 플레이스홀더를 추출합니다
	 * 예: "안녕하세요 {{name}}님" -> ["name"]
	 */
	extractVariablePlaceholders(): string[] {
		const regex = /\{\{(\w+)\}\}/g;
		const placeholders: string[] = [];
		let match: RegExpExecArray | null;

		match = regex.exec(this.content);
		while (match !== null) {
			placeholders.push(match[1]);
			match = regex.exec(this.content);
		}

		return [...new Set(placeholders)];
	}

	/**
	 * 제목이 있는 템플릿인지 확인합니다 (이메일 등)
	 */
	hasSubject(): boolean {
		return this.subject !== null && this.subject.length > 0;
	}
}
