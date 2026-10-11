import type { ComponentType, ReactNode } from "react";

// ============================================
// DataGrid 메인 인터페이스
// ============================================

export type DataGridQueryState = Record<string, unknown>;
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

export interface DataGridSelectionState {
	/** 선택된 키 목록 */
	selectedKeys?: Set<string>;

	/** 선택 변경 핸들러 */
	setSelectedKeys?: (keys: Set<string>) => void;

	/** 선택 초기화 핸들러 */
	clear?: () => void;
}

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

/** ColumnSettings가 컬럼 표시 여부를 토글하는 데 필요한 최소 컬럼 정보입니다. */
export interface DataGridColumnSettingItem {
	id: string;
	label: string;
	isRequired?: boolean;
}

/** DataGrid의 grouping panel 표시 정책을 선언합니다. */
export interface DataGridGroupPanelConfig {
	show?: "never" | "always" | "onlyWhenGrouping";
}

/** GroupPanel이 그룹 기준으로 제안할 수 있는 최소 컬럼 정보입니다. */
export interface DataGridGroupableColumnItem {
	id: string;
	label: string;
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

	/** 선택 변경 핸들러 (DataGridState.selection 우선) */
	onSelectionChange?: (keys: Set<string>) => void;

	/** 선택 시 하단 액션바 */
	actionBar?: {
		/** 선택된 항목 수 표시 */
		showCount?: boolean;
	};
}
