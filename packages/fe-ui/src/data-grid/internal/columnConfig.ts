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
} from "./grouping";

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

export function getColumnConfigId<TData>(config: DataGridColumnConfig<TData>) {
	return String(config.field);
}

export function getOrderedColumnConfigs<TData>(
	configs: DataGridColumnConfig<TData, unknown>[],
	columnsState: DataGridColumnsState,
) {
	const configById = new Map(
		configs.map((config) => [getColumnConfigId(config), config]),
	);
	const orderedConfigs = columnsState.order
		.map((columnId) => configById.get(columnId))
		.filter((config): config is DataGridColumnConfig<TData> => Boolean(config));
	const orderedIds = new Set(orderedConfigs.map(getColumnConfigId));
	const remainingConfigs = configs.filter(
		(config) => !orderedIds.has(getColumnConfigId(config)),
	);

	return [...orderedConfigs, ...remainingConfigs];
}

export function getVisibleColumnConfigs<TData>(
	configs: DataGridColumnConfig<TData, unknown>[],
	columnsState: DataGridColumnsState,
) {
	return getOrderedColumnConfigs(configs, columnsState).filter((config) => {
		if (config.isRequired) {
			return true;
		}

		return columnsState.visibility[getColumnConfigId(config)] !== false;
	});
}

export function isRowGroupableColumn<TData>(
	config: DataGridColumnConfig<TData, unknown>,
) {
	return (
		config.rowGroup === true ||
		config.enableRowGroup === true ||
		config.enableGrouping === true
	);
}

export function getRowGroupableColumnConfigs<TData>(
	configs: DataGridColumnConfig<TData, unknown>[],
) {
	return configs.filter(isRowGroupableColumn);
}

export function getDefaultGroupingColumnIds<TData>(
	configs: DataGridColumnConfig<TData, unknown>[],
) {
	return configs
		.filter((config) => config.rowGroup === true)
		.map(getColumnConfigId);
}

export function getGroupingColumnIds<TData>(
	configs: DataGridColumnConfig<TData, unknown>[],
	columnsState: DataGridColumnsState,
	queryValues?: DataGridQueryStates,
) {
	const visibleColumnIds = new Set(configs.map(getColumnConfigId));
	const queryGrouping = queryValues
		? filterGroupByColumnIds(getQueryGroupByValues(queryValues), configs)
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
	configs: DataGridColumnConfig<TData, unknown>[],
	columnsState: DataGridColumnsState,
): ColumnDef<TData, unknown>[] {
	return configs.map((config) => toColumnDef(config, columnsState));
}
