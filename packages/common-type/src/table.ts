import type { ColumnDef, RowData } from "@tanstack/react-table";
import type { ComponentType, ReactNode } from "react";

// ============================================
// DataGrid 메인 인터페이스
// ============================================

export type DataGridQueryStates = Record<string, unknown>;
export type DataGridRowKey = string | number;

export type DataGridSetQueryStates = (
	values: Record<string, unknown | null>,
	options?: { history?: "push" | "replace" },
) => Promise<URLSearchParams>;

export interface DataGridQueryState {
	/** 페이지 또는 route 가 소유한 query state 값 */
	values: DataGridQueryStates;

	/** 페이지 또는 route 가 소유한 query state setter */
	setValues: DataGridSetQueryStates;
}

export interface DataGridColumnsStateSnapshot {
	order: string[];
	visibility: Record<string, boolean>;
	sizing: Record<string, number>;
	grouping?: string[];
}

export interface DataGridColumnsState extends DataGridColumnsStateSnapshot {
	/** row grouping 컬럼 id 목록 */
	grouping: string[];

	/** grouping 상태가 config 기본값을 덮어썼는지 여부 */
	isGroupingCustomized?: boolean;

	/** 컬럼 표시 순서 변경 */
	setOrder?: (order: string[]) => void;

	/** 컬럼 표시 여부 변경 */
	setVisibility?: (visibility: Record<string, boolean>) => void;

	/** 단일 컬럼 표시 여부 변경 */
	setColumnVisibility?: (columnId: string, isVisible: boolean) => void;

	/** 컬럼 너비 변경 */
	setSizing?: (sizing: Record<string, number>) => void;

	/** 단일 컬럼 너비 변경 */
	setColumnSizing?: (columnId: string, size: number | null) => void;

	/** row grouping 컬럼 변경 */
	setGrouping?: (grouping: string[]) => void;

	/** 단일 컬럼 row grouping 여부 변경 */
	setColumnGrouping?: (columnId: string, isGrouped: boolean) => void;

	/** 저장 snapshot 복원 */
	restore?: (snapshot?: unknown) => void;

	/** 저장 가능한 snapshot 반환 */
	toJSON?: () => DataGridColumnsStateSnapshot;
}

export interface DataGridSelectionState {
	/** 선택된 키 목록 */
	selectedKeys?: Set<string>;

	/** 선택 변경 핸들러 */
	setSelectedKeys?: (keys: Set<string>) => void;

	/** 선택 초기화 핸들러 */
	clear?: () => void;
}

export interface DataGridState {
	/** 컬럼 표시, 순서, 크기 상태 */
	columns: DataGridColumnsState;

	/** 검색/필터/페이지네이션 query 상태 */
	query: DataGridQueryState;

	/** row selection 같은 grid interaction 상태 */
	selection?: DataGridSelectionState;
}

/**
 * DataGrid 설정 인터페이스
 * 메타데이터 기반 선언적 DataGrid 구성
 */
export interface DataGridConfig<T> {
	/** 엔티티명 (컬럼 가시성 시스템 연동) */
	entity: string;

	/** 컬럼 정의 (TanStack Table ColumnDef 확장) */
	columns: DataGridColumnConfig<T>[];

	/** 상단 좌측 영역 (검색, 필터 등) */
	leftInputs?: InputConfig[];

	/** 상단 우측 영역 (버튼, 액션 등) */
	rightInputs?: InputConfig[];

	/** AG Grid row group panel과 같은 grouping 컨트롤 표시 방식 */
	rowGroupPanelShow?: "never" | "always" | "onlyWhenGrouping";

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
// DataGridColumnConfig (TanStack Table ColumnDef 확장)
// ============================================

/**
 * TanStack Table의 ColumnDef를 확장한 컬럼 설정
 * 기본 ColumnDef의 모든 기능을 사용하면서 추가 메타데이터 제공
 */
export interface DataGridColumnConfig<TData, TValue = unknown>
	extends Omit<ColumnDef<TData, TValue>, "id"> {
	/** 필드명 (ColumnDef의 id로도 사용됨) */
	field: keyof TData | string;

	/** 표시 라벨 (header의 기본값) */
	label: string;

	/** 필수 여부 (필수 컬럼은 디바이스와 관계없이 항상 표시) */
	isRequired?: boolean;

	/** 정렬 방향 */
	align?: "left" | "center" | "right";

	/** 정렬 가능 여부 */
	isSortable?: boolean;

	/** AG Grid `rowGroup`처럼 해당 컬럼을 기본 row grouping 기준으로 사용 */
	rowGroup?: boolean;

	/** AG Grid `enableRowGroup`처럼 panel에서 grouping 기준으로 선택 가능 */
	enableRowGroup?: boolean;

	/** 컬럼 header 아래에 표시할 필터 입력 */
	headerInput?: InputConfig;

	/** header 아래 floating filter row에 `headerInput`을 노출할지 여부 */
	floatingFilter?: boolean;
}

// ============================================
// InputConfig (입력 컴포넌트)
// ============================================

/**
 * 입력 컴포넌트 타입
 */
export type InputType =
	| "search" // 검색 입력
	| "select" // 셀렉트 박스
	| "multi-select" // 다중 선택
	| "date-range" // 날짜 범위
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

	/** 고유 식별자 (query state key로 사용) */
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
	// Search
	queryKey?: string; // 기본값: id

	// Select / MultiSelect
	options?: SelectOption[];
	defaultValue?: string | string[];
	isClearable?: boolean;

	// DateRange
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
	component?: ComponentType<unknown>;
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

	/** 선택된 키 목록 (DataGridState.selection 우선) */
	selectedKeys?: Set<string>;

	/** 선택 변경 핸들러 (DataGridState.selection 우선) */
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
	// biome-ignore lint/correctness/noUnusedVariables: TanStack module augmentation must keep upstream generic names.
	interface ColumnMeta<TData extends RowData, TValue> {
		/** 필수 컬럼 여부 */
		isRequired?: boolean;
		/** 정렬 방향 */
		align?: "left" | "center" | "right";
		/** 표시 라벨 */
		label?: string;
		/** 정렬 가능 여부 */
		isSortable?: boolean;
		/** 기본 row grouping 컬럼 여부 */
		rowGroup?: boolean;
		/** row group panel에서 선택 가능한 컬럼 여부 */
		enableRowGroup?: boolean;
		/** 컬럼 header filter 입력 */
		headerInput?: InputConfig;
		/** header 아래 floating filter row 표시 여부 */
		floatingFilter?: boolean;
	}
}
