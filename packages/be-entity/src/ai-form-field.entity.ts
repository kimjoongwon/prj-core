import type {
	AIFormField as AIFormFieldEntity,
	FormFieldType,
	Prisma,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { AIFormTemplate } from "./ai-form-template.entity";

/**
 * 폼 필드 옵션 타입
 */
interface FieldOption {
	value: string;
	label: string;
}

/**
 * AI 폼 필드 엔티티
 *
 * AI 폼 템플릿에서 AI가 채울 개별 필드의 설정을 정의합니다.
 * 각 필드는 대상 필드명, 프롬프트, 필수 여부, 기본값 등을 설정할 수 있습니다.
 */
export class AIFormField extends AbstractEntity implements AIFormFieldEntity {
	// ============================================================================
	// 필수 필드
	// ============================================================================
	templateId!: string;
	fieldName!: string;
	fieldType!: FormFieldType;
	prompt!: string;
	isRequired!: boolean;
	order!: number;

	// ============================================================================
	// Nullable 필드
	// ============================================================================
	fieldLabel!: string | null;
	defaultValue!: string | null;
	validationRegex!: string | null;
	validationMessage!: string | null;
	maxLength!: number | null;
	options!: Prisma.JsonValue | null;
	groupId!: string | null;
	metadata!: Prisma.JsonValue | null;

	// ============================================================================
	// 관계 필드 (선택적)
	// ============================================================================
	template?: AIFormTemplate;
	group?: AIFormField | null;
	children?: AIFormField[];

	// ============================================================================
	// 값 검증 메서드
	// ============================================================================

	/**
	 * 값의 유효성을 검증합니다
	 */
	isValidValue(value: unknown): boolean {
		// 필수 필드 검증
		if (this.isRequired) {
			if (value === null || value === undefined || value === "") {
				return false;
			}
		}

		// 빈 값이면 통과 (필수가 아닌 경우)
		if (value === null || value === undefined || value === "") {
			return true;
		}

		const stringValue = String(value);

		// 정규식 검증
		if (this.validationRegex) {
			try {
				const regex = new RegExp(this.validationRegex);
				if (!regex.test(stringValue)) {
					return false;
				}
			} catch {
				// 정규식이 유효하지 않으면 검증 스킵
			}
		}

		// 최대 길이 검증
		if (this.maxLength !== null && stringValue.length > this.maxLength) {
			return false;
		}

		// 타입별 검증
		switch (this.fieldType) {
			case "EMAIL":
				return this.isValidEmail(stringValue);
			case "PHONE":
				return this.isValidPhone(stringValue);
			case "URL":
				return this.isValidUrl(stringValue);
			case "NUMBER":
				return !Number.isNaN(Number(stringValue));
			case "SELECT":
			case "RADIO":
				return this.isValidOption(stringValue);
			case "MULTI_SELECT":
				return this.isValidMultiSelect(stringValue);
			default:
				return true;
		}
	}

	/**
	 * 이메일 형식 검증
	 */
	private isValidEmail(value: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(value);
	}

	/**
	 * 전화번호 형식 검증
	 */
	private isValidPhone(value: string): boolean {
		const phoneRegex = /^[0-9\-+\s()]+$/;
		return phoneRegex.test(value) && value.replace(/\D/g, "").length >= 8;
	}

	/**
	 * URL 형식 검증
	 */
	private isValidUrl(value: string): boolean {
		try {
			new URL(value);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * 단일 선택 옵션 검증
	 */
	private isValidOption(value: string): boolean {
		const options = this.getOptions();
		return options.some((opt) => opt.value === value);
	}

	/**
	 * 다중 선택 옵션 검증
	 */
	private isValidMultiSelect(value: string): boolean {
		try {
			const values = JSON.parse(value);
			if (!Array.isArray(values)) return false;
			const options = this.getOptions();
			return values.every((v) => options.some((opt) => opt.value === v));
		} catch {
			return false;
		}
	}

	// ============================================================================
	// 프롬프트 관련 메서드
	// ============================================================================

	/**
	 * 프롬프트와 기본값을 조합하여 유효한 프롬프트를 반환합니다
	 */
	getEffectivePrompt(): string {
		let effectivePrompt = this.prompt;

		if (this.defaultValue) {
			effectivePrompt += `\n\n기본값: ${this.defaultValue}`;
		}

		if (this.fieldLabel) {
			effectivePrompt = `[${this.fieldLabel}]\n${effectivePrompt}`;
		}

		return effectivePrompt;
	}

	// ============================================================================
	// 옵션 관련 메서드
	// ============================================================================

	/**
	 * 선택 옵션 목록을 반환합니다
	 */
	getOptions(): FieldOption[] {
		if (!this.options) return [];

		try {
			const parsed = this.options;
			if (Array.isArray(parsed)) {
				return parsed
					.map((opt) => {
						if (typeof opt === "string") {
							return { value: opt, label: opt };
						}
						if (
							typeof opt === "object" &&
							opt !== null &&
							"value" in opt &&
							"label" in opt
						) {
							return { value: String(opt.value), label: String(opt.label) };
						}
						return null;
					})
					.filter((opt): opt is FieldOption => opt !== null);
			}
			return [];
		} catch {
			return [];
		}
	}

	// ============================================================================
	// 값 포맷팅 메서드
	// ============================================================================

	/**
	 * 타입에 맞게 값을 포맷팅합니다
	 */
	formatValue(value: unknown): unknown {
		if (value === null || value === undefined) {
			return this.defaultValue ?? null;
		}

		switch (this.fieldType) {
			case "NUMBER":
				return Number(value);
			case "CHECKBOX":
				return Boolean(value);
			case "DATE":
			case "DATETIME": {
				const date = new Date(String(value));
				return Number.isNaN(date.getTime()) ? null : date;
			}
			case "MULTI_SELECT": {
				if (Array.isArray(value)) return value;
				try {
					return JSON.parse(String(value));
				} catch {
					return [value];
				}
			}
			default:
				return String(value);
		}
	}

	// ============================================================================
	// 유틸리티 메서드
	// ============================================================================

	/**
	 * 필드 타입 라벨을 반환합니다
	 */
	getFieldTypeLabel(): string {
		switch (this.fieldType) {
			case "TEXT":
				return "단행 텍스트";
			case "TEXTAREA":
				return "여러 줄 텍스트";
			case "NUMBER":
				return "숫자";
			case "SELECT":
				return "단일 선택";
			case "MULTI_SELECT":
				return "다중 선택";
			case "CHECKBOX":
				return "체크박스";
			case "RADIO":
				return "라디오 버튼";
			case "DATE":
				return "날짜";
			case "DATETIME":
				return "날짜/시간";
			case "EMAIL":
				return "이메일";
			case "PHONE":
				return "전화번호";
			case "URL":
				return "URL";
			default:
				return "알 수 없음";
		}
	}

	/**
	 * 그룹 필드인지 확인합니다
	 */
	isGroupField(): boolean {
		return this.children !== undefined && this.children.length > 0;
	}
}
