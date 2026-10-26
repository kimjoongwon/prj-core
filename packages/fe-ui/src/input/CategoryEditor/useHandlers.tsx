import { computed, makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { useMemo } from "react";
import { ensureRowExpanded } from "../../data-grid/DataGridTable/useHandlers";
import {
	addRow,
	deleteRow,
	getChangesSnapshot,
	getRow,
} from "../../data-grid/useHandlers";
import type {
	CategoryEditorDataGridState,
	CategoryEditorRow,
} from "./CategoryEditor";

/** CategoryEditor의 임시 행·편집 요청·변경 동작을 보유하는 local state factory입니다. */
export function createCategoryEditorState() {
	let requestSequence = 0;
	const state = {
		getCategoryRowsWithChanges(
			categoryRows: CategoryEditorRow[],
			state: CategoryEditorDataGridState,
		) {
			const categoryChangesSnapshot = getChangesSnapshot(state);
			const deletedCategoryIds = new Set(categoryChangesSnapshot.deleted);
			const originalCategoryIds = new Set(
				categoryRows.map((categoryRow) => categoryRow.id),
			);
			return [
				...categoryRows
					.filter((categoryRow) => !deletedCategoryIds.has(categoryRow.id))
					.map((categoryRow) => getRow(state, categoryRow)),
				...categoryChangesSnapshot.created.filter(
					(categoryRow) => !originalCategoryIds.has(categoryRow.id),
				),
			].filter(
				(categoryRow) => !deletedCategoryIds.has(categoryRow.id),
			) as CategoryEditorRow[];
		},
		sortCategoryRowsForDisplay(categoryRows: CategoryEditorRow[]) {
			return categoryRows
				.map((categoryRow, originalIndex) => ({ categoryRow, originalIndex }))
				.sort(
					(a, b) =>
						(a.categoryRow.sortOrder ?? a.originalIndex) -
							(b.categoryRow.sortOrder ?? b.originalIndex) ||
						a.originalIndex - b.originalIndex,
				)
				.map(({ categoryRow }) => categoryRow);
		},
		getRootCategoryRows(
			categoryRows: CategoryEditorRow[],
			state: CategoryEditorDataGridState,
		) {
			return this.sortCategoryRowsForDisplay(
				this.getCategoryRowsWithChanges(categoryRows, state).filter(
					(categoryRow) => categoryRow.parentId == null,
				),
			);
		},
		getCategorySubRows(
			parentCategoryRow: CategoryEditorRow,
			categoryRows: CategoryEditorRow[],
			state: CategoryEditorDataGridState,
		) {
			return this.sortCategoryRowsForDisplay(
				this.getCategoryRowsWithChanges(categoryRows, state).filter(
					(categoryRow) => categoryRow.parentId === parentCategoryRow.id,
				),
			);
		},
		createNewCategoryRow(
			parentId: string | null,
			sortOrder: number,
		): CategoryEditorRow {
			return {
				id: `temporary-${crypto.randomUUID()}`,
				name: "",
				parentId,
				sortOrder,
			};
		},
		addCategory(
			parentCategoryRow: CategoryEditorRow | null,
			categoryRows: CategoryEditorRow[],
			state: CategoryEditorDataGridState,
		) {
			const siblingCategoryRows = parentCategoryRow
				? this.getCategorySubRows(parentCategoryRow, categoryRows, state)
				: this.getRootCategoryRows(categoryRows, state);
			const newCategoryRow = this.createNewCategoryRow(
				parentCategoryRow?.id ?? null,
				siblingCategoryRows.length,
			);
			addRow(state, newCategoryRow);
			if (parentCategoryRow)
				ensureRowExpanded(state.table, parentCategoryRow.id);
			requestSequence += 1;
			state.table.row.editRequest = {
				rowId: newCategoryRow.id,
				columnId: "name",
				requestId: requestSequence,
			};
		},
		addRootCategory(
			categoryRows: CategoryEditorRow[],
			state: CategoryEditorDataGridState,
		) {
			this.addCategory(null, categoryRows, state);
		},
		addChildCategory(
			parentCategoryRow: CategoryEditorRow,
			categoryRows: CategoryEditorRow[],
			state: CategoryEditorDataGridState,
		) {
			this.addCategory(parentCategoryRow, categoryRows, state);
		},
		deleteCategory(categoryId: string, state: CategoryEditorDataGridState) {
			deleteRow(state, categoryId);
		},
		clearCategoryEditRequest(
			categoryId: string,
			state: CategoryEditorDataGridState,
		) {
			if (state.table.row.editRequest?.rowId === categoryId) {
				state.table.row.editRequest = undefined;
			}
		},
	};
	return makeAutoObservable(
		state,
		{},
		{ autoBind: true, name: "CategoryEditorState" },
	);
}

export type CategoryEditorState = ReturnType<typeof createCategoryEditorState>;

/** CategoryEditor의 최신 원본·delta를 조합하고 도메인 동작을 연결합니다. */
export function useHandlers(
	categoryRows: CategoryEditorRow[],
	dataGrid: CategoryEditorDataGridState,
) {
	const state = useLocalObservable(createCategoryEditorState);
	const categoryRowsWithChanges = useMemo(
		() =>
			computed(() => state.getCategoryRowsWithChanges(categoryRows, dataGrid)),
		[categoryRows, dataGrid, state],
	).get();
	const rootCategoryRows = useMemo(
		() =>
			state.sortCategoryRowsForDisplay(
				categoryRowsWithChanges.filter(
					(categoryRow) => categoryRow.parentId == null,
				),
			),
		[categoryRowsWithChanges, state],
	);
	return useMemo(
		() => ({
			categoryRowsWithChanges,
			rootCategoryRows,
			getRootCategoryRows: () => rootCategoryRows,
			getCategorySubRows: (parentCategoryRow: CategoryEditorRow) =>
				state.sortCategoryRowsForDisplay(
					categoryRowsWithChanges.filter(
						(categoryRow) => categoryRow.parentId === parentCategoryRow.id,
					),
				),
			addRootCategory: () => state.addRootCategory(categoryRows, dataGrid),
			addChildCategory: (parentCategoryRow: CategoryEditorRow) =>
				state.addChildCategory(parentCategoryRow, categoryRows, dataGrid),
			deleteCategory: (categoryId: string) =>
				state.deleteCategory(categoryId, dataGrid),
			finishCategoryEdit: ({ row }: { row: CategoryEditorRow }) =>
				state.clearCategoryEditRequest(row.id, dataGrid),
		}),
		[categoryRows, dataGrid, categoryRowsWithChanges, state, rootCategoryRows],
	);
}
