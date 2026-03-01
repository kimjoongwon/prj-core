import type { ColumnDef, RowData } from "@tanstack/react-table";
import type { ReactNode } from "react";

// ============================================
// MetaDataGrid 메인 인터페이스
// ============================================

/**
 * MetaDataGrid 설정 인터페이스
 * 메타데이터 기반 선언적 DataGrid 구성
 */
export interface MetaDataGridConfig<T> {
	/** 엔티티명 (컬럼 가시성 시스템 연동) */
	entity: string;

	/** 데이터 배열 */
	data: T[];

	/** 전체 데이터 수 (페이지네이션용) */
	totalCount: number;

	/** 로딩 상태 */
	isLoading?: boolean;

	/** nuqs queryStates (페이지에서 주입) */
	queryStates: Record<string, unknown>;

	/** nuqs setQueryStates (페이지에서 주입) */
	setQueryStates: (
		values: Record<string, unknown | null>,
		options?: { history?: "push" | "replace" },
	) => Promise<URLSearchParams>;

	/** 컬럼 정의 (TanStack Table ColumnDef 확장) */
	columns: MetaDataGridColumnConfig<T>[];

	/** 상단 좌측 영역 (검색, 필터 등) */
	leftInputs?: InputConfig[];

	/** 상단 우측 영역 (버튼, 액션 등) */
	rightInputs?: InputConfig[];

	/** 선택 설정 */
	selection?: SelectionConfig;

	/** 모바일 대응 설정 */
	responsive?: ResponsiveConfig<T>;

	/** 행 클릭 핸들러 */
	onRowClick?: (row: T) => void;

	/** 빈 상태 메시지 */
	emptyMessage?: string;
}

// ============================================
// MetaDataGridColumnConfig (TanStack Table ColumnDef 확장)
// ============================================

/**
 * TanStack Table의 ColumnDef를 확장한 컬럼 설정
 * 기본 ColumnDef의 모든 기능을 사용하면서 추가 메타데이터 제공
 */
export interface MetaDataGridColumnConfig<TData, TValue = unknown>
	extends Omit<ColumnDef<TData, TValue>, "id"> {
	/** 필드명 (ColumnDef의 id로도 사용됨) */
	field: keyof TData | string;

	/** 표시 라벨 (header의 기본값) */
	label: string;

	/** 필수 여부 (필수 컬럼은 디바이스와 관계없이 항상 표시) */
	isRequired?: boolean;

	/** 정렬 방향 */
	align?: "left" | "center" | "right";
}

// ============================================
// InputConfig (입력 컴포넌트)
// ============================================

/**
 * 입력 컴포넌트 타입
 */
export type InputType =
	| "search" // 검색 입력 (nuqs 연동)
	| "select" // 셀렉트 박스 (nuqs 연동)
	| "multi-select" // 다중 선택
	| "date-range" // 날짜 범위 (nuqs 연동)
	| "button" // 버튼
	| "dropdown" // 드롭다운 메뉴
	| "chip-group" // 필터 칩 그룹
	| "custom"; // 커스텀 컴포넌트

/**
 * 입력 컴포넌트 설정
 */
export interface InputConfig {
	/** 입력 타입 */
	type: InputType;

	/** 고유 식별자 (nuqs querystring key로 사용) */
	id: string;

	/** 표시 라벨 */
	label?: string;

	/** placeholder */
	placeholder?: string;

	/** 권한 체크 (CASL Subject) */
	permission?: {
		action: string;
		subject: string;
	};

	/** 디바이스별 표시 여부 */
	showOn?: ("desktop" | "tablet" | "mobile")[];

	/** 타입별 Props */
	props?: InputTypeProps;

	/** 이벤트 핸들러 */
	handlers?: InputHandlers;
}

/**
 * 입력 타입별 설정
 */
export interface InputTypeProps {
	// Search - nuqs 자동 연동
	debounceMs?: number;
	queryKey?: string; // 기본값: id

	// Select / MultiSelect - nuqs 자동 연동
	options?: SelectOption[];
	defaultValue?: string | string[];

	// DateRange - nuqs 자동 연동
	queryKeys?: { start: string; end: string };

	// Button
	variant?: "solid" | "bordered" | "light" | "flat" | "ghost";
	color?:
		| "default"
		| "primary"
		| "secondary"
		| "success"
		| "warning"
		| "danger";
	size?: "sm" | "md" | "lg";
	startContent?: ReactNode;

	// Dropdown
	items?: DropdownItem[];

	// Custom
	component?: React.ComponentType<unknown>;
	componentProps?: Record<string, unknown>;
}

/**
 * 셀렉트 옵션
 */
export interface SelectOption {
	label: string;
	value: string;
}

/**
 * 드롭다운 아이템
 */
export interface DropdownItem {
	key: string;
	label: string;
	onClick?: () => void;
	permission?: { action: string; subject: string };
}

/**
 * 입력 이벤트 핸들러
 */
export interface InputHandlers {
	onClick?: () => void;
	onChange?: (value: unknown) => void;
}

// ============================================
// SelectionConfig (선택 설정)
// ============================================

/**
 * 선택 설정
 */
export interface SelectionConfig {
	/** 선택 모드 */
	mode: "none" | "single" | "multiple";

	/** 선택된 키 목록 (외부 상태) */
	selectedKeys?: Set<string>;

	/** 선택 변경 핸들러 */
	onSelectionChange?: (keys: Set<string>) => void;

	/** 선택 시 하단 액션바 */
	actionBar?: {
		/** 선택된 항목 수 표시 */
		showCount?: boolean;
		/** 액션 버튼들 */
		actions?: InputConfig[];
	};
}

// ============================================
// ResponsiveConfig (반응형 설정)
// ============================================

/**
 * 반응형 설정
 */
export interface ResponsiveConfig<T> {
	/** 모바일 카드 뷰 사용 여부 */
	mobileCardView?: boolean;

	/** 카드 렌더러 */
	cardRender?: (row: T) => ReactNode;
}

// ============================================
// TanStack Table 메타 타입 확장
// ============================================

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends RowData, TValue> {
		/** 필수 컬럼 여부 */
		isRequired?: boolean;
		/** 정렬 방향 */
		align?: "left" | "center" | "right";
		/** 표시 라벨 */
		label?: string;
	}
}
