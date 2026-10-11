import type {
	DataGridColumnConfig,
	DataGridColumnSettingItem,
	DataGridGroupableColumnItem,
} from "@cocrepo/type";
import type { ColumnDef } from "@tanstack/react-table";

/**
 * 서로 다른 TValue를 가진 ColumnDef를 한 배열로 다루는 TanStack 경계입니다.
 * 이 경계 전후의 개별 컬럼은 각자의 TValue를 보존합니다.
 */
type HeterogeneousDataGridColumnConfig<TData> = DataGridColumnConfig<
	TData,
	// biome-ignore lint/suspicious/noExplicitAny: TanStack heterogeneous ColumnDef 배열의 TValue 경계입니다.
	any
>;

type HeterogeneousDataGridColumns<TData> =
	readonly HeterogeneousDataGridColumnConfig<TData>[];

export function getColumnAlignClassName<T extends object>(
	column: ColumnDef<T, unknown>,
) {
	const align = column.meta?.align ?? "left";
	if (align === "left") {
		return undefined;
	}
	if (align === "right") {
		return "text-right";
	}
	return "text-center";
}

export function getColumnConfigId<TData, TValue>(
	config: DataGridColumnConfig<TData, TValue>,
) {
	return String(config.field);
}

export function isRowGroupableColumn<TData>(
	config: HeterogeneousDataGridColumnConfig<TData>,
) {
	return (
		config.rowGroup === true ||
		config.enableRowGroup === true ||
		config.enableGrouping === true
	);
}

export function getRowGroupableColumnConfigs<TData>(
	configs: HeterogeneousDataGridColumns<TData>,
) {
	return configs.filter(isRowGroupableColumn);
}

/** ColumnSettings가 표시 토글에 필요한 최소 정보로 전체 컬럼을 변환합니다. */
export function getColumnSettingItems<TData>(
	configs: HeterogeneousDataGridColumns<TData>,
): DataGridColumnSettingItem[] {
	return configs.map((config) => ({
		id: getColumnConfigId(config),
		label: config.label,
		isRequired: config.isRequired,
	}));
}

/** GroupPanel이 그룹 후보로 제안할 groupable 컬럼만 최소 정보로 변환합니다. */
export function getGroupableColumnItems<TData>(
	configs: HeterogeneousDataGridColumns<TData>,
): DataGridGroupableColumnItem[] {
	return getRowGroupableColumnConfigs(configs).map((config) => ({
		id: getColumnConfigId(config),
		label: config.label,
	}));
}

function toColumnDef<TData, TValue = unknown>(
	config: DataGridColumnConfig<TData, TValue>,
): ColumnDef<TData, TValue> {
	const {
		field,
		label,
		isRequired,
		align,
		headerInput,
		floatingFilter,
		isSortable,
		rowGroup,
		enableRowGroup,
		rowExpander,
		editable,
		...columnDefProps
	} = config;
	const accessorKey =
		"accessorKey" in columnDefProps
			? (columnDefProps.accessorKey as string)
			: (field as string);
	const header = "header" in columnDefProps ? columnDefProps.header : label;
	const columnId = String(field);

	return {
		id: columnId,
		accessorKey,
		header: header as ColumnDef<TData, TValue>["header"],
		meta: {
			isRequired,
			align,
			headerInput,
			floatingFilter,
			isSortable: isSortable ?? columnDefProps.enableSorting === true,
			rowGroup,
			enableRowGroup,
			rowExpander,
			editable,
			label,
			...("meta" in columnDefProps ? columnDefProps.meta : {}),
		},
		...columnDefProps,
		enableHiding: isRequired ? false : columnDefProps.enableHiding,
		enableGrouping:
			columnDefProps.enableGrouping ??
			(rowGroup === true || enableRowGroup === true),
		sortDescFirst: false,
	} as ColumnDef<TData, TValue>;
}

export function toColumnDefs<TData>(
	configs: HeterogeneousDataGridColumns<TData>,
): ColumnDef<TData, unknown>[] {
	return configs.map((config) => toColumnDef(config));
}
