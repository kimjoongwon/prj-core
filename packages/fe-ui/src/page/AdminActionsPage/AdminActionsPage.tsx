"use client";

import type { useMetaDataGridQueryStates } from "@cocrepo/hook";
import type { InputConfig } from "@cocrepo/type";
import {
	buildActionTableColumns,
	MetaDataGrid,
	PageTitleBar,
	Surface,
} from "@cocrepo/ui";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "이름으로 검색...",
		props: {
			debounceMs: 300,
		},
	},
];

const groupQueryInputs: InputConfig[] = [
	{
		type: "select",
		id: "group",
		props: {
			defaultValue: "",
		},
	},
];

export const adminActionsPageQueryInputs: InputConfig[] = [
	...leftInputs,
	...groupQueryInputs,
];

export type AdminActionsPageQueryStates = ReturnType<
	typeof useMetaDataGridQueryStates
>[0];
export type AdminActionsPageSetQueryStates = ReturnType<
	typeof useMetaDataGridQueryStates
>[1];

export interface AdminActionsPageAction {
	id: string;
	name: string;
	displayName?: string | null;
	group?: string | null;
	order: number;
	isSystem: boolean;
	createdAt: string | Date | null;
	removedAt?: string | null;
}

export interface AdminActionsPageProps {
	actions: AdminActionsPageAction[];
	totalCount: number;
	isLoading: boolean;
	queryStates: AdminActionsPageQueryStates;
	setQueryStates: AdminActionsPageSetQueryStates;
	onClickCreateButton: () => void;
}

const actionTableColumns = buildActionTableColumns<AdminActionsPageAction>();

function filterActions(actions: AdminActionsPageAction[], search?: string) {
	const searchKeyword = search?.trim().toLowerCase() ?? "";
	if (!searchKeyword) {
		return actions;
	}

	return actions.filter((action) =>
		[action.name, action.displayName]
			.filter(Boolean)
			.some((value) => value!.toLowerCase().includes(searchKeyword)),
	);
}

function buildRightInputs(onClickCreateButton: () => void): InputConfig[] {
	return [
		{
			type: "button",
			id: "create",
			label: "등록",
			props: {
				variant: "flat",
				color: "primary",
				startContent: <Plus className="h-4 w-4" />,
			},
			handlers: {
				onClick: onClickCreateButton,
			},
		},
	];
}

export const AdminActionsPage = observer(function AdminActionsPage({
	actions,
	totalCount: totalActionCount,
	isLoading,
	queryStates,
	setQueryStates,
	onClickCreateButton,
}: AdminActionsPageProps) {
	const filteredActions = filterActions(actions, queryStates.search);
	const totalCount = queryStates.search?.trim().length
		? filteredActions.length
		: totalActionCount;
	const rightInputs = buildRightInputs(onClickCreateButton);

	if (isLoading) {
		return <ActionsPageFallback />;
	}

	return (
		<div className="space-y-5">
			<PageTitleBar
				title="Action 목록"
				description="시스템에 등록된 Action을 조회합니다."
			/>
			<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
				<MetaDataGrid
					config={{
						entity: "Action",
						data: filteredActions,
						totalCount,
						isLoading: false,
						queryStates,
						setQueryStates,
						columns: actionTableColumns,
						leftInputs,
						rightInputs,
						emptyMessage: "조회된 Action이 없습니다.",
					}}
				/>
			</Surface>
		</div>
	);
});

function ActionsPageFallback() {
	return (
		<div className="space-y-5">
			<PageTitleBar
				title="Action 목록"
				description="시스템에 등록된 Action을 조회합니다."
			/>
			<Surface className="h-32 rounded-2xl border-divider/80 bg-content1/70">
				{null}
			</Surface>
		</div>
	);
}

export default AdminActionsPage;
