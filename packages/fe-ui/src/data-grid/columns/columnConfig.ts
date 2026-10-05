import type {
	DataGridColumnConfig,
	DataGridColumnsState,
	DataGridQueryStates,
} from "@cocrepo/type";
import type { ColumnDef } from "@tanstack/react-table";
import {
	filterGroupByColumnIds,
	getQueryGroupByValues,
	hasQueryGroupBy,
} from "../state/grouping";

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

export function getOrderedColumnConfigs<
	TData,
	const TConfigs extends HeterogeneousDataGridColumns<TData>,
>(
	configs: TConfigs & HeterogeneousDataGridColumns<TData>,
	columnsState: DataGridColumnsState,
): TConfigs[number][] {
	const typedConfigs = configs as TConfigs;
	const configById = new Map<string, TConfigs[number]>(
		typedConfigs.map((config) => [getColumnConfigId(config), config]),
	);
	const orderedConfigs = columnsState.order
		.map((columnId) => configById.get(columnId))
		.filter((config): config is TConfigs[number] => Boolean(config));
	const orderedIds = new Set(orderedConfigs.map(getColumnConfigId));
	const remainingConfigs = typedConfigs.filter(
		(config) => !orderedIds.has(getColumnConfigId(config)),
	);

	return [...orderedConfigs, ...remainingConfigs];
}

export function getVisibleColumnConfigs<
	TData,
	const TConfigs extends HeterogeneousDataGridColumns<TData>,
>(
	configs: TConfigs & HeterogeneousDataGridColumns<TData>,
	columnsState: DataGridColumnsState,
): TConfigs[number][] {
	return getOrderedColumnConfigs<TData, TConfigs>(configs, columnsState).filter(
		(config) => {
			if (config.isRequired) {
				return true;
			}

			return columnsState.visibility[getColumnConfigId(config)] !== false;
		},
	);
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

export function getDefaultGroupingColumnIds<TData>(
	configs: HeterogeneousDataGridColumns<TData>,
) {
	return configs
		.filter((config) => config.rowGroup === true)
		.map(getColumnConfigId);
}

export function getGroupingColumnIds<TData>(
	configs: HeterogeneousDataGridColumns<TData>,
	columnsState: DataGridColumnsState,
	queryValues?: DataGridQueryStates,
) {
	const visibleColumnIds = new Set(configs.map(getColumnConfigId));
	const queryGrouping = queryValues
		? filterGroupByColumnIds(getQueryGroupByValues(queryValues), [...configs])
		: [];
	const stateGrouping = columnsState.grouping.filter((columnId) =>
		visibleColumnIds.has(columnId),
	);

	if (columnsState.isGroupingCustomized === true) {
		return stateGrouping;
	}
	if (queryValues && hasQueryGroupBy(queryValues)) {
		return queryGrouping;
	}

	return getDefaultGroupingColumnIds(configs);
}

function toColumnDef<TData, TValue = unknown>(
	config: DataGridColumnConfig<TData, TValue>,
	columnsState: DataGridColumnsState,
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
	const columnSize =
		columnsState.sizing[columnId] ??
		("size" in columnDefProps && typeof columnDefProps.size === "number"
			? columnDefProps.size
			: undefined);

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
		enableGrouping:
			columnDefProps.enableGrouping ??
			(rowGroup === true || enableRowGroup === true),
		size: columnSize,
	} as ColumnDef<TData, TValue>;
}

export function toColumnDefs<TData>(
	configs: HeterogeneousDataGridColumns<TData>,
	columnsState: DataGridColumnsState,
): ColumnDef<TData, unknown>[] {
	return configs.map((config) => toColumnDef(config, columnsState));
}
