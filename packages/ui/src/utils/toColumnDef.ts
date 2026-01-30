import type { MetaDataGridColumnConfig } from "@cocrepo/type";
import type { ColumnDef } from "@tanstack/react-table";

/**
 * MetaDataGridColumnConfig를 TanStack Table의 ColumnDef로 변환
 */
export function toColumnDef<TData, TValue = unknown>(
	config: MetaDataGridColumnConfig<TData, TValue>,
): ColumnDef<TData, TValue> {
	const { field, label, isRequired, align, ...columnDefProps } = config;

	// accessorKey가 columnDefProps에 있으면 사용, 없으면 field 사용
	const accessorKey =
		"accessorKey" in columnDefProps
			? (columnDefProps.accessorKey as string)
			: (field as string);

	return {
		id: String(field),
		accessorKey,
		header: ("header" in columnDefProps ? columnDefProps.header : label) as
			| string
			| undefined,
		meta: {
			isRequired,
			align,
			label,
			...("meta" in columnDefProps ? columnDefProps.meta : {}),
		},
		...columnDefProps,
	} as ColumnDef<TData, TValue>;
}

/**
 * 여러 컬럼 일괄 변환
 */
export function toColumnDefs<TData>(
	configs: MetaDataGridColumnConfig<TData, unknown>[],
): ColumnDef<TData, unknown>[] {
	return configs.map(toColumnDef);
}
