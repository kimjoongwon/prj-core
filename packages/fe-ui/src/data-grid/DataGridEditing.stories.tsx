import type {
	DataGridConfig,
	DataGridEditorOption,
	DataGridRowMoveEvent,
} from "@cocrepo/type";
import type { Meta, StoryObj } from "@storybook/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
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
								editor: {
									type: "text",
									placeholder: "카테고리 이름 입력",
								},
								triggers: ["click", "enter", "f2"],
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

interface BuiltInEditorRow {
	id: string;
	name: string;
	age: number;
	status: string;
	tags: string[];
	active: boolean;
	startedAt: string;
	owner: string;
}

const builtInEditorRows: BuiltInEditorRow[] = [
	{
		id: "editor-1",
		name: "Ada Lovelace",
		age: 36,
		status: "활성",
		tags: ["수학", "컴퓨팅"],
		active: true,
		startedAt: "2026-01-15",
		owner: "ada",
	},
	{
		id: "editor-2",
		name: "Grace Hopper",
		age: 85,
		status: "대기",
		tags: ["컴파일러"],
		active: false,
		startedAt: "2026-02-20",
		owner: "grace",
	},
];

const editorOptions: DataGridEditorOption[] = [
	{ value: "활성", label: "활성" },
	{ value: "대기", label: "대기" },
	{ value: "중지", label: "중지" },
];

const ownerOptions: DataGridEditorOption[] = [
	{ value: "ada", label: "Ada Lovelace" },
	{ value: "grace", label: "Grace Hopper" },
];

const BuiltInEditorsStory = observer(function BuiltInEditorsStory() {
	const [rows, setRows] = useState(builtInEditorRows);
	const [state] = useState(
		() =>
			new DataGridState({
				queryStates: { skip: 0, take: 20 },
				setQueryStates: async () => new URLSearchParams(),
			}),
	);
	const config: DataGridConfig<BuiltInEditorRow> = {
		entity: "BuiltInEditor",
		columns: [
			{
				field: "name",
				label: "이름",
				editable: {
					editor: { type: "text", placeholder: "이름 입력" },
					validate: ({ value }) =>
						String(value).trim() ? undefined : "이름은 필수입니다.",
				},
			},
			{
				field: "age",
				label: "나이",
				editable: { editor: { type: "number" } },
			},
			{
				field: "status",
				label: "상태",
				editable: { editor: { type: "select", options: editorOptions } },
			},
			{
				field: "tags",
				label: "태그",
				cell: ({ getValue }) => String((getValue() as string[]).join(", ")),
				editable: {
					editor: { type: "multi-select", options: ownerOptions },
				},
			},
			{
				field: "active",
				label: "활성",
				cell: ({ getValue }) => (getValue() ? "예" : "아니오"),
				editable: { editor: { type: "boolean" } },
			},
			{
				field: "startedAt",
				label: "시작일",
				editable: { editor: { type: "date" } },
			},
			{
				field: "owner",
				label: "담당자",
				editable: { editor: { type: "autocomplete", options: ownerOptions } },
			},
		],
	};

	return (
		<div className="space-y-3">
			<DataGrid
				config={config}
				state={state}
				rows={rows}
				totalCount={rows.length}
			/>
			<button
				type="button"
				className="rounded border px-3 py-1 text-sm"
				onClick={() => {
					const snapshot = state.changes.toJSON<BuiltInEditorRow>();
					setRows((currentRows) =>
						currentRows.map((row) => ({
							...row,
							...(snapshot.updated.find((item) => item.id === row.id)?.changes ?? {}),
						})),
					);
					state.changes.clear();
				}}
			>
				변경 snapshot 적용
			</button>
			<pre className="rounded border border-dashed border-border p-3 text-xs whitespace-pre-wrap">
				{JSON.stringify(state.changes.toJSON<BuiltInEditorRow>(), null, 2)}
			</pre>
		</div>
	);
});

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

export const BuiltInEditors: Story = {
	render: () => <BuiltInEditorsStory />,
	parameters: {
		docs: {
			description: {
				story:
					"DataGrid가 제공하는 built-in text, number, select, multi-select, boolean, date, autocomplete editor와 validation을 보여줍니다. Enter는 commit, Escape는 cancel, Tab은 다음 editable cell로 이동합니다.",
			},
		},
	},
};
