import type { Meta, StoryObj } from "@storybook/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { createDataGridState } from "../../data-grid";
import { clearChanges, getChangesSnapshot } from "../../data-grid/useHandlers";
import {
	CategoryEditor,
	type CategoryEditorDataGridState,
	type CategoryEditorRow,
} from "./CategoryEditor";

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
	{
		id: "category-space-team",
		name: "팀 공간",
		parentId: "category-space",
		sortOrder: 0,
	},
	{
		id: "category-space-team-admin",
		name: "관리자 공간",
		parentId: "category-space-team",
		sortOrder: 0,
	},
	{
		id: "category-space-personal",
		name: "개인 공간",
		parentId: "category-space",
		sortOrder: 1,
	},
	{ id: "category-asset", name: "자산", parentId: null, sortOrder: 2 },
];

const readOnlyApiRows: CategoryEditorRow[] = [
	{ id: "category-user", name: "사용자", parentId: null, sortOrder: 0 },
	{ id: "category-space", name: "공용 공간", parentId: null, sortOrder: 1 },
	{
		id: "category-space-team",
		name: "팀 공간",
		parentId: "category-space",
		sortOrder: 0,
	},
	{
		id: "category-space-team-admin",
		name: "관리자 공간",
		parentId: "category-space-team",
		sortOrder: 0,
	},
	{
		id: "category-space-personal",
		name: "개인 공간",
		parentId: "category-space",
		sortOrder: 1,
	},
];

function createCategoryDataGridState(): CategoryEditorDataGridState {
	return createDataGridState<CategoryEditorRow>({
		query: { skip: 0, take: 20 },
		setQueryStates: async () => new URLSearchParams(),
		toolbar: {},
		groupPanel: { show: "never" },
		table: {
			columns: [],
		},
	});
}

const CategoryEditorStory = observer(function CategoryEditorStory({
	rows: sourceRows,
	state,
	totalCount,
	isReadOnly = false,
}: {
	rows: CategoryEditorRow[];
	state: CategoryEditorDataGridState;
	totalCount: number;
	isReadOnly?: boolean;
}) {
	// API 응답 원본은 rows에만 두고, 저장 전 변경은 state에 둡니다.
	const [rows, setRows] = useState<CategoryEditorRow[]>(() => [...sourceRows]);
	const changesSnapshot = getChangesSnapshot(state);

	const saveSnapshot = () => {
		const snapshot = getChangesSnapshot(state);
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
		clearChanges(state);
	};

	return (
		<>
			<CategoryEditor
				rows={rows}
				state={state}
				totalCount={totalCount}
				isReadOnly={isReadOnly}
			/>
			{!isReadOnly && (
				<div className="space-y-3 p-3">
					<button
						type="button"
						className="rounded border px-3 py-1 text-sm"
						onClick={saveSnapshot}
					>
						변경 저장
					</button>
					<div
						role="status"
						aria-label="변경 사항"
						className="rounded border border-dashed border-border p-3 text-xs whitespace-pre-wrap"
					>
						{JSON.stringify(changesSnapshot, null, 2)}
					</div>
				</div>
			)}
		</>
	);
});

export const Editable: Story = {
	args: {
		rows: editableApiRows,
		state: createCategoryDataGridState(),
		totalCount: editableApiRows.length,
	},
	render: ({ rows, state, totalCount }) => (
		<CategoryEditorStory rows={rows} state={state} totalCount={totalCount} />
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const expandSpace = canvas.getByRole("button", {
			name: "공용 공간 하위 행 펼치기",
		});
		await userEvent.click(expandSpace);
		await expect(canvas.getByText("팀 공간")).toBeInTheDocument();

		await userEvent.click(canvas.getByText("운영자 역할"));
		const nameEditor = canvas.getByRole("textbox", { name: "name" });
		await userEvent.clear(nameEditor);
		await userEvent.type(nameEditor, "운영 담당자");
		await userEvent.keyboard("{Enter}");
		const changes = canvas.getByLabelText("변경 사항");
		await expect(changes).toHaveTextContent('"id": "category-role"');
		await expect(changes).toHaveTextContent('"name": "운영 담당자"');

		const spaceRow = canvas.getByText("공용 공간").closest("tr");
		if (!spaceRow) throw new Error("공용 공간 행을 찾을 수 없습니다.");
		await userEvent.click(
			within(spaceRow).getByRole("button", { name: "추가" }),
		);
		const createdNameEditor = canvas.getByRole("textbox", { name: "name" });
		await userEvent.type(createdNameEditor, "새 팀 공간");
		await userEvent.keyboard("{Enter}");
		await expect(
			canvas.queryByRole("textbox", { name: "name" }),
		).not.toBeInTheDocument();
		await expect(changes).toHaveTextContent('"created":');
		await expect(changes).toHaveTextContent('"name": "새 팀 공간"');

		const assetRow = canvas.getByText("자산").closest("tr");
		if (!assetRow) throw new Error("자산 행을 찾을 수 없습니다.");
		await userEvent.click(
			within(assetRow).getByRole("button", { name: "삭제" }),
		);
		await expect(changes).toHaveTextContent('"category-asset"');

		await userEvent.click(canvas.getByRole("button", { name: "변경 저장" }));
		await expect(canvas.getByLabelText("변경 사항")).toHaveTextContent(
			'"created": []',
		);
		await expect(canvas.getByLabelText("변경 사항")).toHaveTextContent(
			'"updated": []',
		);
		await expect(canvas.getByLabelText("변경 사항")).toHaveTextContent(
			'"deleted": []',
		);
		await expect(
			canvas.queryByRole("textbox", { name: "name" }),
		).not.toBeInTheDocument();
		await expect(canvas.getByText("운영 담당자")).toBeInTheDocument();
		await expect(canvas.queryByText("자산")).not.toBeInTheDocument();
	},
	parameters: {
		docs: {
			description: {
				story:
					"API 원본 rows를 렌더링하고, 새 행은 created, 삭제는 deleted, inline edit는 updated에 기록합니다. 변경 저장 시 getChangesSnapshot 결과를 rows에 반영한 뒤 clearChanges를 호출합니다.",
			},
		},
	},
};

export const ReadOnly: Story = {
	args: {
		rows: readOnlyApiRows,
		state: createCategoryDataGridState(),
		totalCount: readOnlyApiRows.length,
		isReadOnly: true,
	},
	render: ({ rows, state, totalCount, isReadOnly }) => (
		<CategoryEditorStory
			rows={rows}
			state={state}
			totalCount={totalCount}
			isReadOnly={isReadOnly}
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(
			canvas.queryByRole("button", { name: "카테고리 추가" }),
		).not.toBeInTheDocument();
		await expect(
			canvas.queryByRole("button", { name: "추가" }),
		).not.toBeInTheDocument();
		await expect(
			canvas.queryByRole("button", { name: "삭제" }),
		).not.toBeInTheDocument();
		await expect(canvas.queryByRole("textbox")).not.toBeInTheDocument();

		await userEvent.click(
			canvas.getByRole("button", { name: "공용 공간 하위 행 펼치기" }),
		);
		await expect(canvas.getByText("팀 공간")).toBeInTheDocument();
	},
	parameters: {
		docs: {
			description: {
				story: "API 원본 rows만 표시하는 읽기 전용 collection editor입니다.",
			},
		},
	},
};
