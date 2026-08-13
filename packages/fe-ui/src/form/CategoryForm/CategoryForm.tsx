"use client";

import type { CategorySchema } from "@cocrepo/schema";
import type {
	DataGridChangesState,
	DataGridConfig,
	DataGridState,
} from "@cocrepo/type";
import type { CellContext } from "@tanstack/react-table";
import { observer } from "mobx-react-lite";
import { ActionButtonCell, DataGrid, InputCell } from "../../data-grid";
 

/** CategorySchema의 name을 편집하는 DataGrid 행입니다. */
export interface CategoryFormRow {
	id: string;
	name: CategorySchema["name"];
}

/** CategoryForm의 생성·수정·삭제 delta를 보관하는 외부 grid 상태입니다. */
export type CategoryFormDataGridState = DataGridState & {
	changes: DataGridChangesState;
};

export interface CategoryFormProps {
	/** 상위 Feature 또는 Screen이 보관하는 API 원본 행입니다. */
	rows: CategoryFormRow[];
	/** 상위 계층이 toJSON<CategoryFormRow>() snapshot을 소비할 grid 상태입니다. */
	dataGridState: CategoryFormDataGridState;
	/** API 목록 조회 결과의 전체 행 수입니다. */
	totalCount: number;
	isLoading?: boolean;
	readOnly?: boolean;
}

function createCategoryRow(): CategoryFormRow {
	return {
		id: `temporary-${crypto.randomUUID()}`,
		name: "",
	};
}

function createCategoryFormConfig(
	dataGridState: CategoryFormDataGridState,
	readOnly: boolean,
): DataGridConfig<CategoryFormRow> {
	return {
		entity: "Category",
		columns: [
			{
				field: "name",
				label: "이름",
				isRequired: true,
				...(readOnly
					? {}
					: {
							editable: {
								render: ({ value, onValueChange, onFinish, onCancel }) => (
									<InputCell
										aria-label="카테고리 이름 입력"
										value={String(value ?? "")}
										onValueChange={(nextValue) => onValueChange(nextValue)}
										onFinish={onFinish}
										onCancel={onCancel}
									/>
								),
							},
						}),
			},
			...(readOnly
				? []
				: [
						{
							field: "actions",
							label: "관리",
							align: "center" as const,
							cell: ({ row }: CellContext<CategoryFormRow, unknown>) => (
								<ActionButtonCell
									color="danger"
									variant="light"
									onPress={() =>
										dataGridState.changes.deleteRow(row.original.id)
									}
								>
									삭제
								</ActionButtonCell>
							),
						},
					]),
		],
		rightInputs: readOnly
			? []
			: [
					{
						id: "add-category",
						type: "button",
						label: "카테고리 추가",
						props: { size: "sm" },
						handlers: {
							onClick: () => dataGridState.changes.addRow(createCategoryRow()),
						},
					},
				],
		rowGroupPanelShow: "never",
	};
}

/** Category 원본 행과 DataGrid changes delta를 조합하는 collection editor입니다. */
export const CategoryForm = observer(
	({
		rows,
		dataGridState,
		totalCount,
		isLoading = false,
		readOnly = false,
	}: CategoryFormProps) => (
		<DataGrid
			config={createCategoryFormConfig(dataGridState, readOnly)}
			state={dataGridState}
			rows={rows}
			totalCount={totalCount}
			isLoading={isLoading}
		/>
	),
);
