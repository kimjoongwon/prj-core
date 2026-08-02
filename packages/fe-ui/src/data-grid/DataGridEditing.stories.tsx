import type { DataGridConfig, DataGridRowMoveEvent } from "@cocrepo/type";
import type { Meta, StoryObj } from "@storybook/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { InputCell } from "./cell/InputCell";
import { DataGrid } from "./DataGrid";
import { DataGridState } from "./DataGridState";

interface CategoryRow {
	id: string;
	name: string;
	parentId: string | null;
	sortOrder: number;
}

const initialCategoryRows: CategoryRow[] = [
	{
		id: "cat-fashion",
		name: "의류",
		parentId: null,
		sortOrder: 0,
	},
	{
		id: "cat-fashion-top",
		name: "상의",
		parentId: "cat-fashion",
		sortOrder: 0,
	},
	{
		id: "cat-fashion-bottom",
		name: "하의",
		parentId: "cat-fashion",
		sortOrder: 1,
	},
	{
		id: "cat-beauty",
		name: "뷰티",
		parentId: null,
		sortOrder: 1,
	},
	{
		id: "cat-beauty-skin",
		name: "스킨케어",
		parentId: "cat-beauty",
		sortOrder: 0,
	},
];

const toSortedRows = (rows: CategoryRow[]) =>
	[...rows].sort((a, b) => a.sortOrder - b.sortOrder);

function createCategoryConfig({
	editable,
	onRowMove,
}: {
	editable: boolean;
	onRowMove?: (event: DataGridRowMoveEvent<CategoryRow>) => void;
}): DataGridConfig<CategoryRow> {
	return {
		entity: "Category",
		columns: [
			{
				field: "name",
				label: "이름",
				rowExpander: true,
				...(editable
					? {
							editable: {
								render: ({ value, onValueChange, onFinish, onCancel }) => (
									<InputCell
										aria-label="카테고리 이름 입력"
										value={String(value ?? "")}
										onValueChange={onValueChange}
										onFinish={onFinish}
										onCancel={onCancel}
									/>
								),
							},
						}
					: {}),
			},
		],
		onRowMove,
	};
}

function applyMoveEvent(
	rows: CategoryRow[],
	event: DataGridRowMoveEvent<CategoryRow>,
	state: DataGridState,
) {
	const parentId = event.parent?.id ?? null;
	const siblingById = new Map(
		event.siblings.map((sibling, index) => [String(sibling.id), index]),
	);
	const sourceRow =
		rows.find((row) => String(row.id) === String(event.row.id)) ?? event.row;

	const nextRows = rows.map((row) => {
		const siblingIndex = siblingById.get(String(row.id));
		if (siblingIndex == null) {
			return row;
		}

		return {
			...row,
			parentId,
			sortOrder: siblingIndex,
		};
	});

	state.changes.setValue(sourceRow, "parentId", parentId);

	event.siblings.forEach((sibling, index) => {
		state.changes.setValue(sibling, "sortOrder", index);
	});

	return nextRows;
}

const EditableCategoryTreeStory = observer(
	function EditableCategoryTreeStory() {
		const [rows, setRows] = useState(initialCategoryRows);
		const [nextCategoryNo, setNextCategoryNo] = useState(1);
		const [deletedCategoryId, setDeletedCategoryId] = useState<string | null>(
			null,
		);
		const [state] = useState(
			() =>
				new DataGridState({
					queryStates: { skip: 0, take: 100 },
					setQueryStates: async () => new URLSearchParams(),
				}),
		);
		const getRootRows = () =>
			toSortedRows(rows.filter((row) => row.parentId == null));
		const getSubRows = (row: CategoryRow) =>
			toSortedRows(rows.filter((category) => category.parentId === row.id));
		const handleRowMove = (event: DataGridRowMoveEvent<CategoryRow>) => {
			const nextRows = applyMoveEvent(rows, event, state);
			setRows(nextRows);
		};
		const config = createCategoryConfig({
			editable: true,
			onRowMove: handleRowMove,
		});

		const handleAddRow = () => {
			const newCategory: CategoryRow = {
				id: `temporary-${nextCategoryNo}`,
				name: `새 카테고리 ${nextCategoryNo}`,
				parentId: null,
				sortOrder: getRootRows().length,
			};

			setRows((current) => [...current, newCategory]);
			state.changes.addRow(newCategory);
			setNextCategoryNo((current) => current + 1);
		};

		const handleDeleteRow = () => {
			const targetRowId = "cat-beauty";
			state.changes.deleteRow(targetRowId);
			setDeletedCategoryId(targetRowId);
		};

		const handleRestoreRow = () => {
			if (!deletedCategoryId) {
				return;
			}

			state.changes.restoreRow(deletedCategoryId);
			setDeletedCategoryId(null);
		};

		const handleClearChanges = () => {
			state.changes.clear();
			setRows(initialCategoryRows);
			setNextCategoryNo(1);
			setDeletedCategoryId(null);
		};

		return (
			<div className="space-y-3">
				<div className="flex flex-wrap gap-2">
					<button
						type="button"
						className="rounded border px-3 py-1 text-sm"
						onClick={handleAddRow}
					>
						행 추가
					</button>
					<button
						type="button"
						className="rounded border px-3 py-1 text-sm"
						onClick={handleDeleteRow}
					>
						카테고리 삭제
					</button>
					<button
						type="button"
						className="rounded border px-3 py-1 text-sm"
						onClick={handleRestoreRow}
						disabled={!deletedCategoryId}
					>
						카테고리 복원
					</button>
					<button
						type="button"
						className="rounded border px-3 py-1 text-sm"
						onClick={handleClearChanges}
					>
						변경 내역 초기화
					</button>
				</div>
				<div className="rounded border border-border">
					<DataGrid
						config={{
							...config,
							getSubRows,
						}}
						state={state}
						rows={getRootRows()}
						totalCount={rows.length}
					/>
				</div>
				<pre className="rounded border border-dashed border-border p-3 text-xs whitespace-pre-wrap">
					{JSON.stringify(state.changes.toJSON<CategoryRow>(), null, 2)}
				</pre>
			</div>
		);
	},
);

const ReadOnlyCategoryTreeStory = observer(
	function ReadOnlyCategoryTreeStory() {
		const [rows] = useState(initialCategoryRows);
		const [state] = useState(
			() =>
				new DataGridState({
					queryStates: { skip: 0, take: 100 },
					setQueryStates: async () => new URLSearchParams(),
				}),
		);
		const getRootRows = () =>
			toSortedRows(rows.filter((row) => row.parentId == null));
		const getSubRows = (row: CategoryRow) =>
			toSortedRows(rows.filter((category) => category.parentId === row.id));
		const config = createCategoryConfig({
			editable: false,
			onRowMove: undefined,
		});

		return (
			<div className="space-y-3">
				<p className="text-xs text-muted-foreground">
					이 뷰는 이동 및 편집이 비활성화된 읽기 전용 카테고리 트리입니다.
				</p>
				<DataGrid
					config={{
						...config,
						getSubRows,
					}}
					state={state}
					rows={getRootRows()}
					totalCount={rows.length}
				/>
			</div>
		);
	},
);

const meta = {
	title: "data-grid/DataGridEditing",
	parameters: { layout: "padded" },
	tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const EditableCategoryTree: Story = {
	render: () => <EditableCategoryTreeStory />,
};

export const ReadOnlyCategoryTree: Story = {
	render: () => <ReadOnlyCategoryTreeStory />,
};
