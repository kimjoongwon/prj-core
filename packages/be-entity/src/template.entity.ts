import type {
	Template as TemplateEntity,
	TemplateType,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { TemplateVariable } from "./template-variable.entity";

export class Template extends AbstractEntity implements TemplateEntity {
	// ============================================================================
	// 필수 필드
	// ============================================================================

	/** 고유 코드 */
	code!: string;
	/** 템플릿 이름 */
	name!: string;
	/** 템플릿 유형 (EMAIL, SMS, PUSH) */
	type!: TemplateType;
	/** 본문 */
	content!: string;
	/** 활성 상태 */
	isActive!: boolean;

	// ============================================================================
	// Nullable 필드
	// ============================================================================

	/** 제목 */
	subject!: string | null;
	/** 설명 */
	description!: string | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================

	/** 변수 목록 */
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
