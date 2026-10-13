import type { DataGridRow } from "../DataGrid";
import type { DataGridActionBarState } from "./DataGridActionBar";

/** 선택 원본에서 액션바에 표시할 값을 읽습니다. */
export const useHandlers = <TData extends DataGridRow>(
	state: DataGridActionBarState<TData>,
) => ({
	selectedCount:
		state.table.selectionSource?.selectedKeys?.size ??
		state.table.selectedRowKeys.size,
	showCount: state.showCount,
});
