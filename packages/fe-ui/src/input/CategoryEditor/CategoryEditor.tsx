"use client";

import {
	CategoryFormSchema,
	validateFieldSync,
} from "@cocrepo/schema";
import type {
	DataGridConfig,
	DataGridEditRequest,
	DataGridExpandRequest,
	InputStateProps,
} from "@cocrepo/type";
import type { CellContext } from "@tanstack/react-table";
import { ButtonGroup } from "@heroui/react";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import {
	DataGrid,
	type DataGridChangesState,
	type DataGridState,
} from "../../data-grid";
import { Button } from "../Button";

/** CategoryFormSchema의 name을 편집하는 DataGrid 행입니다. */
export interface CategoryEditorRow {
	id: string;
	name: CategoryFormSchema["name"];
	parentId: string | null;
	sortOrder?: number;
}

/** CategoryEditor의 생성·수정·삭제 delta를 보관하는 외부 grid 상태입니다. */
export type CategoryEditorDataGridState = DataGridState & {
	changes: DataGridChangesState;
};

export interface CategoryEditorProps extends InputStateProps {
	/** 상위 Feature 또는 Screen이 보관하는 API 원본 행입니다. */
	rows: CategoryEditorRow[];
	/** 상위 계층이 toJSON<CategoryEditorRow>() snapshot을 소비할 grid 상태입니다. */
	dataGridState: CategoryEditorDataGridState;
	/** API 목록 조회 결과의 전체 행 수입니다. */
	totalCount: number;
	isLoading?: boolean;
}

class State {
	rows: CategoryEditorRow[];
	dataGridState: CategoryEditorDataGridState;
	requestSequence = 0;
	expandRequest?: DataGridExpandRequest;
	editRequest?: DataGridEditRequest;

	constructor(
		rows: CategoryEditorRow[],
		dataGridState: CategoryEditorDataGridState,
	) {
		this.rows = rows;
		this.dataGridState = dataGridState;
		makeAutoObservable(this, {}, { autoBind: true });
	}

	setSource(
		rows: CategoryEditorRow[],
		dataGridState: CategoryEditorDataGridState,
	) {
		this.rows = rows;
		this.dataGridState = dataGridState;
	}

	get categoryRowsWithChanges() {
		const categoryChangesSnapshot =
			this.dataGridState.changes.toJSON<CategoryEditorRow>();
		const deletedCategoryIds = new Set(categoryChangesSnapshot.deleted);
		const originalCategoryIds = new Set(
			this.rows.map((categoryRow) => categoryRow.id),
		);
		const existingCategoryRows = this.rows
			.filter((categoryRow) => !deletedCategoryIds.has(categoryRow.id))
			.map((categoryRow) => this.dataGridState.changes.getRow(categoryRow));
		const createdCategoryRows = categoryChangesSnapshot.created.filter(
			(categoryRow) => !originalCategoryIds.has(categoryRow.id),
		);

		return [...existingCategoryRows, ...createdCategoryRows].filter(
			(categoryRow) => !deletedCategoryIds.has(categoryRow.id),
		) as CategoryEditorRow[];
	}

	get rootCategoryRows() {
		return this.sortCategoryRowsForDisplay(
			this.categoryRowsWithChanges.filter(
				(categoryRow) => categoryRow.parentId == null,
			),
		);
	}

	getCategorySubRows(parentCategoryRow: CategoryEditorRow) {
		return this.sortCategoryRowsForDisplay(
			this.categoryRowsWithChanges.filter(
				(categoryRow) => categoryRow.parentId === parentCategoryRow.id,
			),
		);
	}

	addRootCategory() {
		this.addCategory(null);
	}

	addChildCategory(parentCategoryRow: CategoryEditorRow) {
		this.addCategory(parentCategoryRow);
	}

	deleteCategory(categoryId: string) {
		this.dataGridState.changes.deleteRow(categoryId);
	}

	private addCategory(parentCategoryRow: CategoryEditorRow | null) {
		const siblingCategoryRows = parentCategoryRow
			? this.getCategorySubRows(parentCategoryRow)
			: this.rootCategoryRows;
		const requestId = this.issueRequestId();
		const newCategoryRow = this.createNewCategoryRow(
			parentCategoryRow?.id ?? null,
			siblingCategoryRows.length,
		);

		this.dataGridState.changes.addRow(newCategoryRow);
		if (parentCategoryRow) {
			this.expandRequest = {
				rowId: parentCategoryRow.id,
				requestId,
			};
		}
		this.editRequest = {
			rowId: newCategoryRow.id,
			columnId: "name",
			requestId,
		};
	}

	private issueRequestId() {
		this.requestSequence += 1;
		return this.requestSequence;
	}

	private createNewCategoryRow(
		parentId: string | null,
		sortOrder: number,
	): CategoryEditorRow {
		return {
			id: `temporary-${crypto.randomUUID()}`,
			name: "",
			parentId,
			sortOrder,
		};
	}

	private sortCategoryRowsForDisplay(categoryRows: CategoryEditorRow[]) {
		return categoryRows
			.map((categoryRow, originalIndex) => ({ categoryRow, originalIndex }))
			.sort((a, b) => {
				const aSortOrder = a.categoryRow.sortOrder ?? a.originalIndex;
				const bSortOrder = b.categoryRow.sortOrder ?? b.originalIndex;
				return aSortOrder - bSortOrder || a.originalIndex - b.originalIndex;
			})
			.map(({ categoryRow }) => categoryRow);
	}
}

/** Category 원본 행과 DataGrid changes delta를 조합하는 collection editor입니다. */
export const CategoryEditor = observer(
	({
		rows,
		dataGridState,
		totalCount,
		isLoading = false,
		isReadOnly = false,
	}: CategoryEditorProps) => {
		const state = useLocalObservable(() => new State(rows, dataGridState));
		state.setSource(rows, dataGridState);
		const config: DataGridConfig<CategoryEditorRow> = {
			toolbar: {
				rightInputs: isReadOnly
					? []
					: [
							{
								id: "add-category",
								type: "button",
								label: "카테고리 추가",
								props: { size: "sm" },
								handlers: { onClick: state.addRootCategory },
							},
						],
			},
			groupPanel: { show: "never" },
			table: {
				entity: "Category",
				columns: [
				{
					field: "name",
					label: "이름",
					isRequired: true,
					rowExpander: true,
					...(isReadOnly
						? {}
						: {
								editable: {
									editor: {
										type: "text",
										placeholder: "카테고리 이름 입력",
									},
									triggers: ["click", "enter", "f2"],
									validate: ({ value }) =>
										validateFieldSync(
											CategoryFormSchema,
											{ name: value },
											"name",
										)?.messages[0],
								},
							}),
				},
				...(isReadOnly
					? []
					: [
							{
								field: "actions",
								label: "관리",
								align: "center" as const,
								cell: ({
									row: categoryRow,
								}: CellContext<CategoryEditorRow, unknown>) => (
									<ButtonGroup variant="secondary">
										<Button
											onPress={() =>
												state.addChildCategory(categoryRow.original)
											}
										>
											추가
										</Button>
										<ButtonGroup.Separator />
										<Button
											onPress={() =>
												state.deleteCategory(categoryRow.original.id)
											}
										>
											삭제
										</Button>
									</ButtonGroup>
								),
							},
						]),
				],
				getSubRows: state.getCategorySubRows,
				expandRequest: state.expandRequest,
				editRequest: state.editRequest,
			},
		};

		return (
			<DataGrid
				config={config}
				state={dataGridState}
				rows={state.rootCategoryRows}
				totalCount={totalCount}
				isLoading={isLoading}
			/>
		);
	},
);
