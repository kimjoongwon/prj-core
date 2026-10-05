import type { ColumnDef, RowData } from "@tanstack/react-table";
import type { ComponentType, ReactNode } from "react";

// ============================================
// DataGrid 메인 인터페이스
// ============================================

export type DataGridQueryStates = Record<string, unknown>;
export type DataGridRowKey = string | number;

/** DataGrid가 렌더링하고 변경을 추적할 수 있는 최소 행 계약입니다. */
export interface DataGridRowData {
	id: DataGridRowKey;
}

export interface DataGridExpandRequest {
	rowId: DataGridRowKey;
	requestId: number;
}

export interface DataGridEditRequest {
	rowId: DataGridRowKey;
	columnId: string;
	requestId: number;
}

/** 기존 행 하나에 누적된 필드 변경입니다. */
export interface DataGridUpdatedRow<TData extends DataGridRowData> {
	id: DataGridRowKey;
	changes: Partial<TData>;
}

/** 저장 요청으로 변환할 생성·수정·삭제 배열입니다. */
export interface DataGridChangesSnapshot<TData extends DataGridRowData> {
	created: TData[];
	updated: DataGridUpdatedRow<TData>[];
	deleted: DataGridRowKey[];
}

/** DataGrid가 원본 행을 바꾸지 않고 생성·수정·삭제 내역을 보관하는 계약입니다. */
export interface DataGridChangesState {
	created: DataGridRowData[];
	updated: Array<{
		id: DataGridRowKey;
		changes: Record<string, unknown>;
	}>;
	deleted: DataGridRowKey[];

	addRow: <TData extends DataGridRowData>(row: TData) => void;
	setValue: <TData extends DataGridRowData, TField extends keyof TData>(
		row: TData,
		field: TField,
		value: TData[TField],
	) => void;
	clearValue: (rowId: DataGridRowKey, field: string) => void;
	deleteRow: (rowId: DataGridRowKey) => void;
	restoreRow: (rowId: DataGridRowKey) => void;
	clear: () => void;
	isDeleted: (rowId: DataGridRowKey) => boolean;
	getRow: <TData extends DataGridRowData>(row: TData) => TData;
	getCreatedRows: <TData extends DataGridRowData>() => TData[];
	toJSON: <TData extends DataGridRowData>() => DataGridChangesSnapshot<TData>;
}

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

	/** 저장 전 행 생성·수정·삭제 내역 */
	changes?: DataGridChangesState;
}

export type DataGridEditTrigger = "click" | "doubleClick" | "enter" | "f2";

export type DataGridEditorType =
	| "text"
	| "number"
	| "date"
	| "date-time"
	| "select"
	| "multi-select"
	| "boolean"
	| "autocomplete"
	| "custom";

export interface DataGridEditorOption {
	value: string;
	label: string;
}

export interface DataGridEditorConfig {
	type: DataGridEditorType;
	options?: DataGridEditorOption[];
	placeholder?: string;
	allowEmpty?: boolean;
}

export interface DataGridEditValidationContext<TData, TValue = unknown> {
	row: TData;
	field: string;
	value: TValue;
	initialValue: TValue;
}

export type DataGridEditValidationResult = string | null | undefined;

/** 편집 renderer가 현재 행과 값을 읽고 완료 또는 취소하는 데 필요한 값입니다. */
export interface DataGridEditCellContext<TData, TValue = unknown> {
	row: TData;
	field: string;
	value: TValue;
	initialValue: TValue;
	errorMessage?: string;
	isValidating: boolean;
	onValueChange: (value: TValue) => void;
	onFinish: (direction?: "next" | "previous") => void;
	onCancel: () => void;
}

/** DataGrid가 제공하는 셀 편집 계약입니다. */
export interface DataGridEditableConfig<TData, TValue = unknown> {
	editor?: DataGridEditorConfig;
	triggers?: DataGridEditTrigger[];
	isEnabled?: (row: TData) => boolean;
	validate?: (
		context: DataGridEditValidationContext<TData, TValue>,
	) => DataGridEditValidationResult | Promise<DataGridEditValidationResult>;
	onCommit?: (
		context: DataGridEditValidationContext<TData, TValue>,
	) => void | Promise<void>;
	onCancel?: (
		context: DataGridEditValidationContext<TData, TValue>,
	) => void | Promise<void>;
	render?: (context: DataGridEditCellContext<TData, TValue>) => ReactNode;
}

/** 행 이동 후 상위 데이터가 적용할 부모와 형제 순서입니다. */
export interface DataGridRowMoveEvent<TData> {
	row: TData;
	parent: TData | null;
	index: number;
	siblings: TData[];
}

/** DataGrid의 상단 입력과 column settings 표시를 선언합니다. */
export interface DataGridToolbarConfig {
	leftInputs?: InputConfig[];
	rightInputs?: InputConfig[];
}

/** DataGrid의 grouping panel 표시 정책을 선언합니다. */
export interface DataGridGroupPanelConfig {
	show?: "never" | "always" | "onlyWhenGrouping";
}

/** 독립 Table과 DataGrid 본문이 공유하는 선언형 계약입니다. */
export interface DataGridTableConfig<T> {
	entity: string;
	columns: DataGridColumnConfig<T>[];
	selection?: SelectionConfig;
	responsive?: ResponsiveConfig<T>;
	onRowClick?: (row: T) => void;
	getSubRows?: (row: T, index: number) => T[] | undefined;
	expandRequest?: DataGridExpandRequest;
	editRequest?: DataGridEditRequest;
	onRowMove?: (event: DataGridRowMoveEvent<T>) => void;
	emptyMessage?: string;
}

/** ownership별 설정을 조합하는 DataGrid 최상위 선언 계약입니다. */
export interface DataGridConfig<T> {
	toolbar?: DataGridToolbarConfig;
	groupPanel?: DataGridGroupPanelConfig;
	table: DataGridTableConfig<T>;
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

	/** 계층 행의 펼침 버튼과 들여쓰기를 표시할 컬럼 */
	rowExpander?: boolean;

	/** 셀 클릭 시 사용할 인라인 편집 렌더러 */
	editable?: DataGridEditableConfig<TData, TValue>;
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
		/** 계층 행 펼침과 들여쓰기 표시 여부 */
		rowExpander?: boolean;
		/** 셀 인라인 편집 계약 */
		editable?: DataGridEditableConfig<TData, TValue>;
	}
}
