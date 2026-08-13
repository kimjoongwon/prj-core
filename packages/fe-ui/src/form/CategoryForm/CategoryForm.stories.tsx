import type { Meta, StoryObj } from "@storybook/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import {
	CategoryForm,
	type CategoryFormDataGridState,
	type CategoryFormRow,
} from "./CategoryForm";
import { DataGridChangesState } from "../../data-grid/DataGridChangesState";
import { DataGridState } from "../../data-grid/DataGridState";

const meta = {
	title: "form/CategoryForm",
	component: CategoryForm,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"Category collection editor backed by API rows and a DataGrid changes snapshot.",
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof CategoryForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const editableApiRows: CategoryFormRow[] = [
	{ id: "category-role", name: "운영자 역할" },
	{ id: "category-space", name: "공용 공간" },
	{ id: "category-asset", name: "자산" },
];

const readOnlyApiRows: CategoryFormRow[] = [
	{ id: "category-user", name: "사용자" },
	{ id: "category-space", name: "공용 공간" },
];

function createCategoryDataGridState(): CategoryFormDataGridState {
	return new DataGridState({
		queryStates: { skip: 0, take: 20 },
		setQueryStates: async () => new URLSearchParams(),
		changes: new DataGridChangesState(),
	}) as CategoryFormDataGridState;
}

const CategoryFormStory = observer(function CategoryFormStory({
	initialRows,
	readOnly = false,
}: {
	initialRows: CategoryFormRow[];
	readOnly?: boolean;
}) {
	// API 응답 원본은 rows에만 두고, 저장 전 변경은 dataGridState.changes에 둡니다.
	const [rows, setRows] = useState<CategoryFormRow[]>(() => [...initialRows]);
	const [dataGridState] = useState(createCategoryDataGridState);
	const changesSnapshot = dataGridState.changes.toJSON<CategoryFormRow>();

	const saveSnapshot = () => {
		const snapshot = dataGridState.changes.toJSON<CategoryFormRow>();
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
		<div className="w-[640px] max-w-[calc(100vw-32px)] space-y-3">
			<CategoryForm
				rows={rows}
				dataGridState={dataGridState}
				totalCount={rows.length}
				readOnly={readOnly}
			/>
			{!readOnly && (
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
	render: ({ rows }) => <CategoryFormStory initialRows={rows} />,
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
		readOnly: true,
	},
	render: ({ rows, readOnly }) => (
		<CategoryFormStory initialRows={rows} readOnly={readOnly} />
	),
	parameters: {
		docs: {
			description: {
				story: "API 원본 rows만 표시하는 읽기 전용 collection editor입니다.",
			},
		},
	},
};
