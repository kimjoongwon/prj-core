import type { Meta, StoryObj } from "@storybook/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import {
	CategoryEditor,
	type CategoryEditorDataGridState,
	type CategoryEditorRow,
} from "./CategoryEditor";
import { DataGridChangesState } from "../../data-grid/DataGridChangesState";
import { DataGridState } from "../../data-grid/DataGridState";

const meta = {
	title: "input/CategoryEditor",
	component: CategoryEditor,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"Category collection editor backed by API rows and a DataGrid changes snapshot.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof CategoryEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

const editableApiRows: CategoryEditorRow[] = [
	{ id: "category-role", name: "운영자 역할", parentId: null, sortOrder: 0 },
	{ id: "category-space", name: "공용 공간", parentId: null, sortOrder: 1 },
	{ id: "category-space-team", name: "팀 공간", parentId: "category-space", sortOrder: 0 },
	{ id: "category-space-team-admin", name: "관리자 공간", parentId: "category-space-team", sortOrder: 0 },
	{ id: "category-space-personal", name: "개인 공간", parentId: "category-space", sortOrder: 1 },
	{ id: "category-asset", name: "자산", parentId: null, sortOrder: 2 },
];

const readOnlyApiRows: CategoryEditorRow[] = [
	{ id: "category-user", name: "사용자", parentId: null, sortOrder: 0 },
	{ id: "category-space", name: "공용 공간", parentId: null, sortOrder: 1 },
	{ id: "category-space-team", name: "팀 공간", parentId: "category-space", sortOrder: 0 },
	{ id: "category-space-team-admin", name: "관리자 공간", parentId: "category-space-team", sortOrder: 0 },
	{ id: "category-space-personal", name: "개인 공간", parentId: "category-space", sortOrder: 1 },
];

function createCategoryDataGridState(): CategoryEditorDataGridState {
	return new DataGridState({
		queryStates: { skip: 0, take: 20 },
		setQueryStates: async () => new URLSearchParams(),
		changes: new DataGridChangesState(),
	}) as CategoryEditorDataGridState;
}

const CategoryEditorStory = observer(function CategoryEditorStory({
	initialRows,
	isReadOnly = false,
}: {
	initialRows: CategoryEditorRow[];
	isReadOnly?: boolean;
}) {
	// API 응답 원본은 rows에만 두고, 저장 전 변경은 dataGridState.changes에 둡니다.
	const [rows, setRows] = useState<CategoryEditorRow[]>(() => [...initialRows]);
	const [dataGridState] = useState(createCategoryDataGridState);
	const changesSnapshot = dataGridState.changes.toJSON<CategoryEditorRow>();

	const saveSnapshot = () => {
		const snapshot = dataGridState.changes.toJSON<CategoryEditorRow>();
		const updatedById = new Map(
			snapshot.updated.map((update) => [update.id, update.changes]),
		);
		const deletedIds = new Set(snapshot.deleted);

		setRows((currentRows) => [
			...currentRows
				.filter((row) => !deletedIds.has(row.id))
				.map((row) => ({ ...row, ...(updatedById.get(row.id) ?? {}) })),
			...snapshot.created,
		]);
		// 실제 Feature/Screen도 서버 저장 성공 후 같은 경계에서 snapshot을 비웁니다.
		dataGridState.changes.clear();
	};

	return (
		<div className="space-y-3">
			<CategoryEditor
				rows={rows}
				dataGridState={dataGridState}
				totalCount={rows.length}
				isReadOnly={isReadOnly}
			/>
			{!isReadOnly && (
				<>
					<button
						type="button"
						className="rounded border px-3 py-1 text-sm"
						onClick={saveSnapshot}
					>
						변경 저장
					</button>
					<pre className="rounded border border-dashed border-border p-3 text-xs whitespace-pre-wrap">
						{JSON.stringify(changesSnapshot, null, 2)}
					</pre>
				</>
			)}
		</div>
	);
});

export const Editable: Story = {
	args: {
		rows: editableApiRows,
		dataGridState: createCategoryDataGridState(),
		totalCount: editableApiRows.length,
	},
	render: ({ rows }) => <CategoryEditorStory initialRows={rows} />,
	parameters: {
		docs: {
			description: {
				story:
					"API 원본 rows를 렌더링하고, 새 행은 changes.addRow, 삭제는 deleteRow, inline edit는 changes.updated에 기록합니다. 변경 저장 시 snapshot을 rows에 반영한 뒤 changes.clear를 호출합니다.",
			},
		},
	},
};

export const ReadOnly: Story = {
	args: {
		rows: readOnlyApiRows,
		dataGridState: createCategoryDataGridState(),
		totalCount: readOnlyApiRows.length,
		isReadOnly: true,
	},
	render: ({ rows, isReadOnly }) => (
		<CategoryEditorStory initialRows={rows} isReadOnly={isReadOnly} />
	),
	parameters: {
		docs: {
			description: {
				story: "API 원본 rows만 표시하는 읽기 전용 collection editor입니다.",
			},
		},
	},
};
