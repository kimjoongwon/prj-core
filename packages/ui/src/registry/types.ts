/**
 * Registry 시스템 타입 정의
 *
 * 코드 기반 FieldRegistry + ViewRegistry와
 * DB 오버라이드를 병합하기 위한 타입들입니다.
 */

import type { ComponentType } from "react";

// ============================================================================
// 디바이스 타입
// ============================================================================

/**
 * 디바이스 타입 enum
 * - DESKTOP: >= 1280px
 * - TABLET: 768-1279px
 * - MOBILE: < 768px
 */
export enum DeviceType {
	DESKTOP = "desktop",
	TABLET = "tablet",
	MOBILE = "mobile",
}

/**
 * 반응형 설정
 */
export interface ResponsiveConfig {
	mobile: boolean;
	tablet: boolean;
	desktop: boolean;
}

// ============================================================================
// 필드 정의 (코드 기본값)
// ============================================================================

/**
 * 필드 메타데이터 정의
 * FieldRegistry에 등록되는 각 필드의 기본 설정입니다.
 */
export interface FieldDefinition {
	/** 필드명 (entity의 속성명과 매칭) */
	field: string;
	/** 표시 라벨 */
	label: string;
	/** 필드 설명 (툴팁 등에 사용) */
	description?: string;

	// 테이블 관련
	/** 컬럼 너비 (px 또는 %) */
	width?: number | string;
	/** 최소 너비 (px) */
	minWidth?: number;
	/** 정렬 가능 여부 */
	sortable?: boolean;
	/** 텍스트 정렬 */
	align?: "left" | "center" | "right";

	// 렌더링 관련
	/** 커스텀 렌더링 컴포넌트 */
	component?: ComponentType<{ value: unknown }>;
	/** 값 포맷터 함수 */
	formatter?: (value: unknown) => string;

	// 폼 관련
	/** 수정 가능 여부 */
	editable?: boolean;
	/** 필수 입력 여부 */
	required?: boolean;

	// 반응형 기본값
	/** 디바이스별 표시 여부 */
	responsive?: ResponsiveConfig;
}

/**
 * Entity별 필드 정의 타입
 * 타입 안전한 필드 정의를 위한 Record 타입입니다.
 */
export type EntityFields<T extends string = string> = Record<
	T,
	FieldDefinition
>;

// ============================================================================
// 뷰 정의 (코드 기본값)
// ============================================================================

/**
 * 뷰 타입
 */
export type ViewType = "table" | "form" | "detail" | "card";

/**
 * 정렬 설정
 */
export interface SortConfig {
	field: string;
	direction: "asc" | "desc";
}

/**
 * 뷰 정의
 * ViewRegistry에 등록되는 각 뷰의 기본 설정입니다.
 */
export interface ViewDefinition {
	/** 대상 Entity */
	entity: string;
	/** 뷰 타입 */
	view: ViewType;
	/** 기본 필드 순서 */
	fields: string[];
	/** 기본 정렬 */
	defaultSort?: SortConfig;
	/** 페이지 크기 */
	pageSize?: number;
}

// ============================================================================
// DB 오버라이드 타입
// ============================================================================

/**
 * 필드별 오버라이드 설정 (DB에서 로드)
 */
export interface FieldConfig {
	/** 필드명 */
	field: string;
	/** 표시 여부 */
	visible: boolean;
	/** 표시 순서 */
	order: number;
	/** 라벨 오버라이드 */
	label?: string;
	/** 너비 오버라이드 */
	width?: string | number;
}

/**
 * 테이블 뷰 오버라이드 설정
 */
export interface TableViewConfig {
	fields: FieldConfig[];
	defaultSort?: SortConfig;
	pageSize?: number;
}

/**
 * 폼 뷰 오버라이드 설정
 */
export interface FormViewConfig {
	fields: FieldConfig[];
}

/**
 * 상세 뷰 오버라이드 설정
 */
export interface DetailViewConfig {
	fields: FieldConfig[];
}

// ============================================================================
// 병합 결과 타입
// ============================================================================

/**
 * 병합된 필드 정보
 * 코드 기본값 + DB 오버라이드 + 권한 필터링 결과
 */
export interface ResolvedField extends FieldDefinition {
	/** 표시 여부 */
	visible: boolean;
	/** 표시 순서 */
	order: number;
}

/**
 * 병합된 뷰 설정
 */
export interface ResolvedViewConfig {
	entity: string;
	view: ViewType;
	fields: ResolvedField[];
	defaultSort?: SortConfig;
	pageSize?: number;
}

// ============================================================================
// 병합 컨텍스트
// ============================================================================

/**
 * CASL Ability 인터페이스 (외부 주입용)
 * 실제 AppAbility 타입은 앱에서 정의됩니다.
 */
export interface AbilityLike {
	can(action: string, subject: string, field?: string): boolean;
}

/**
 * 병합 컨텍스트
 * ConfigMerger가 필드 병합 시 사용하는 컨텍스트 정보입니다.
 */
export interface MergeContext {
	/** 대상 Entity */
	entity: string;
	/** 뷰 타입 */
	view: ViewType;
	/** CASL Ability (권한 필터링용) */
	ability?: AbilityLike;
	/** 현재 디바이스 타입 (반응형 필터링용) */
	deviceType?: DeviceType;
}

// ============================================================================
// 유틸리티 타입
// ============================================================================

/**
 * 필드 등록 옵션
 */
export interface RegisterOptions {
	/** 기존 등록 덮어쓰기 허용 */
	override?: boolean;
}
