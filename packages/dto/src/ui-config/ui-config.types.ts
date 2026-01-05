/**
 * UI Config 타입 정의
 *
 * 하이브리드 UI Config 시스템에서 사용되는 타입들입니다.
 * - 코드 기본값: FieldRegistry (프론트엔드)
 * - DB 오버라이드: UIConfig 테이블
 * - 권한 필터: CASL fields
 */

/**
 * UIConfig 스코프 Enum
 *
 * Prisma에서 생성된 UIConfigScope과 동일합니다.
 * 설정의 적용 범위를 나타냅니다.
 * 우선순위: USER > ROLE > GLOBAL
 */
export enum UIConfigScopeEnum {
	/** Space 전체 기본값 */
	GLOBAL = "GLOBAL",
	/** Role별 설정 */
	ROLE = "ROLE",
	/** 사용자 개인 설정 */
	USER = "USER",
}

/**
 * 정렬 방향
 */
export type SortDirection = "asc" | "desc";

/**
 * 정렬 설정
 */
export interface SortConfig {
	/** 정렬 기준 필드명 */
	field: string;
	/** 정렬 방향 */
	direction: SortDirection;
}

/**
 * 필드별 설정 (DB 오버라이드용)
 *
 * 사용자가 테이블 컬럼 표시/숨김, 순서, 너비 등을 커스터마이징할 때 저장되는 설정입니다.
 */
export interface FieldConfig {
	/** 필드명 (예: 'name', 'email', 'createdAt') */
	field: string;
	/** 표시 여부 */
	visible: boolean;
	/** 표시 순서 (0부터 시작) */
	order: number;
	/** 라벨 오버라이드 (선택) */
	label?: string;
	/** 너비 오버라이드 (선택) - 픽셀 또는 비율 */
	width?: string | number;
}

/**
 * 테이블 뷰 설정
 *
 * 테이블 형태의 목록 화면에서 사용되는 설정입니다.
 */
export interface TableViewConfig {
	/** 필드별 설정 목록 */
	fields: FieldConfig[];
	/** 기본 정렬 설정 (선택) */
	defaultSort?: SortConfig;
	/** 페이지 크기 (선택) */
	pageSize?: number;
}

/**
 * 폼 필드 설정
 */
export interface FormFieldConfig extends FieldConfig {
	/** 읽기 전용 여부 */
	readonly?: boolean;
	/** 필수 입력 여부 */
	required?: boolean;
	/** 플레이스홀더 텍스트 */
	placeholder?: string;
}

/**
 * 폼 뷰 설정
 *
 * 폼(생성/수정) 화면에서 사용되는 설정입니다.
 */
export interface FormViewConfig {
	/** 필드별 설정 목록 */
	fields: FormFieldConfig[];
	/** 폼 레이아웃 (1열 또는 2열) */
	layout?: "single" | "double";
}

/**
 * 상세 뷰 설정
 *
 * 상세 조회 화면에서 사용되는 설정입니다.
 */
export interface DetailViewConfig {
	/** 필드별 설정 목록 */
	fields: FieldConfig[];
	/** 섹션 구분 (선택) */
	sections?: {
		title: string;
		fields: string[];
	}[];
}

/**
 * 카드 뷰 설정
 *
 * 카드 형태의 목록 화면에서 사용되는 설정입니다.
 */
export interface CardViewConfig {
	/** 필드별 설정 목록 */
	fields: FieldConfig[];
	/** 카드당 표시할 필드 수 */
	fieldsPerCard?: number;
}

/**
 * UI Config JSON 타입
 *
 * UIConfig.config 컬럼에 저장되는 JSON 데이터의 유니온 타입입니다.
 */
export type UIConfigJson =
	| TableViewConfig
	| FormViewConfig
	| DetailViewConfig
	| CardViewConfig;

/**
 * 뷰 타입
 */
export type ViewType = "table" | "form" | "detail" | "card";
