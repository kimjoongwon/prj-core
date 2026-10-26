"use client";

import { CategoryFormSchema } from "@cocrepo/schema";
import type { InputStateProps } from "@cocrepo/type";
import { ButtonGroup } from "@heroui/react";
import type { CellContext } from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { DataGrid, type DataGridState } from "../../data-grid";
import { Button } from "../Button";
import { useHandlers as useCategoryHandlers } from "./useHandlers";

export type { CategoryEditorState } from "./useHandlers";
export { createCategoryEditorState } from "./useHandlers";

/** CategoryFormSchema의 name을 편집하는 DataGrid 행입니다. */
export interface CategoryEditorRow {
	id: string;
	name: CategoryFormSchema["name"];
	parentId: string | null;
	sortOrder?: number;
}
/** CategoryEditor의 생성·수정·삭제 delta를 보관하는 외부 grid 상태입니다. */
export type CategoryEditorDataGridState = DataGridState<CategoryEditorRow>;
/** Category 원본 행과 DataGrid 변경분을 조합하는 collection editor props입니다. */
export interface CategoryEditorProps extends InputStateProps {
	/** 상위 Feature 또는 Screen이 보관하는 API 원본 행입니다. */
	rows: CategoryEditorRow[];
	/** 상위 계층이 getChangesSnapshot() snapshot을 소비할 grid 상태입니다. */
	state: CategoryEditorDataGridState;
	/** pagination wrapper 제거 후에도 공개 계약을 보존하는 API 목록 행 수입니다. */
	totalCount: number;
}

export const CategoryEditor = observer(
	({
		rows,
		state,
		totalCount: _totalCount,
		isReadOnly = false,
	}: CategoryEditorProps) => {
		const categoryHandlers = useCategoryHandlers(rows, state);
		const categoryColumns = useMemo(
			() => [
				{
					accessorKey: "name",
					header: "이름",
					meta: isReadOnly
						? { label: "이름", rowExpander: true }
						: {
								label: "이름",
								rowExpander: true,
								editable: {
									onCommit: categoryHandlers.finishCategoryEdit,
									onCancel: categoryHandlers.finishCategoryEdit,
									editor: { type: "text" as const },
								},
							},
				},
				...(isReadOnly
					? []
					: [
							{
								accessorKey: "actions",
								header: "관리",
								cell: ({
									row: categoryRow,
								}: CellContext<CategoryEditorRow, unknown>) => (
									<ButtonGroup variant="secondary">
										<Button
											onPress={() =>
												categoryHandlers.addChildCategory(categoryRow.original)
											}
										>
											추가
										</Button>
										<ButtonGroup.Separator />
										<Button
											onPress={() =>
												categoryHandlers.deleteCategory(categoryRow.original.id)
											}
										>
											삭제
										</Button>
									</ButtonGroup>
								),
							},
						]),
			],
			[state, isReadOnly, rows, categoryHandlers],
		);
		return (
			<>
				{!isReadOnly && (
					<div className="flex justify-end p-3">
						<Button size="sm" onPress={categoryHandlers.addRootCategory}>
							카테고리 추가
						</Button>
					</div>
				)}
				<DataGrid
					state={state}
					table={{
						rows,
						columns: categoryColumns,
						getSubRows: categoryHandlers.getCategorySubRows,
						getRowsWithChanges: categoryHandlers.getRootCategoryRows,
					}}
					show={{
						toolbar: false,
						groupPanel: false,
						pagination: false,
						actionBar: false,
					}}
				/>
			</>
		);
	},
);
