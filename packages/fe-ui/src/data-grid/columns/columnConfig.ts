import type {
	DataGridColumnSettingItem,
	DataGridGroupableColumnItem,
} from "@cocrepo/type";
import type { TableOptions } from "@tanstack/react-table";

type HeterogeneousColumnDefs<TData> = NonNullable<
	TableOptions<TData>["columns"]
>;

function getColumnId<TData>(columnDef: HeterogeneousColumnDefs<TData>[number]) {
	if (columnDef.id) return columnDef.id;
	if ("accessorKey" in columnDef && columnDef.accessorKey)
		return String(columnDef.accessorKey).replace(/\./g, "_");
	return typeof columnDef.header === "string" ? columnDef.header : "";
}

function getColumnHeader<TData>(
	columnDef: HeterogeneousColumnDefs<TData>[number],
	id: string,
) {
	return typeof columnDef.header === "string" ? columnDef.header : id;
}

/** ColumnSettings가 표시 토글에 필요한 정보를 ColumnDef에서 읽습니다. */
export function getColumnSettingItems<TData>(
	columnDefs: HeterogeneousColumnDefs<TData>,
): DataGridColumnSettingItem[] {
	return columnDefs.map((columnDef) => {
		const id = getColumnId(columnDef);
		return {
			id,
			label: getColumnHeader(columnDef, id),
			isRequired: columnDef.enableHiding === false,
		};
	});
}

/** GroupPanel이 TanStack의 enableGrouping 설정을 따르는 컬럼을 제안합니다. */
export function getGroupableColumnItems<TData>(
	columnDefs: HeterogeneousColumnDefs<TData>,
): DataGridGroupableColumnItem[] {
	return columnDefs
		.filter((columnDef) => columnDef.enableGrouping !== false)
		.map((columnDef) => {
			const id = getColumnId(columnDef);
			return { id, label: getColumnHeader(columnDef, id) };
		});
}
