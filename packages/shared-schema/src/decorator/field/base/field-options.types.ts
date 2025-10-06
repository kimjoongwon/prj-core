import type { ApiPropertyOptions } from "@nestjs/swagger";

/**
 * 모든 필드 데코레이터의 기본 옵션 인터페이스
 */
export interface BaseFieldOptions {
	/** 필수 여부 (기본값: true) */
	required?: boolean;
	/** 배열 여부 */
	each?: boolean;
	/** Swagger 문서 생성 여부 (기본값: true) */
	swagger?: boolean;
	/** null 허용 여부 */
	nullable?: boolean;
	/** class-validator 그룹 */
	groups?: string[];
	/** 폼 타입 (커스텀 메타데이터) */
	formType?: string;
}

/**
 * 숫자 필드 옵션
 */
export interface NumberFieldOptions extends BaseFieldOptions {
	/** 최소값 */
	min?: number;
	/** 최대값 */
	max?: number;
	/** 정수 여부 */
	int?: boolean;
	/** 양수 여부 */
	isPositive?: boolean;
}

/**
 * 문자열 필드 옵션
 */
export interface StringFieldOptions extends BaseFieldOptions {
	/** 최소 길이 */
	minLength?: number;
	/** 최대 길이 */
	maxLength?: number;
	/** 소문자 변환 여부 */
	toLowerCase?: boolean;
	/** 대문자 변환 여부 */
	toUpperCase?: boolean;
	/** 정규식 패턴 */
	pattern?: string;
	/** 커스텀 검증 메시지 */
	message?: string;
}

/**
 * Swagger ApiProperty 옵션과 함께 사용하는 타입 헬퍼
 */
export type FieldDecoratorOptions<T extends BaseFieldOptions> = Omit<
	ApiPropertyOptions,
	"type"
> &
	T;

/**
 * Optional 필드용 옵션 (required 제외)
 */
export type OptionalFieldOptions<T extends BaseFieldOptions> = Omit<
	FieldDecoratorOptions<T>,
	"required"
>;
