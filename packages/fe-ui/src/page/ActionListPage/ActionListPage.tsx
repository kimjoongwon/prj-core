"use client";

import type { ActionDto } from "@cocrepo/api/core/actions";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildActionTableColumns,
	DataGrid,
	DataGridStateModel,
	PageTitleBar,
	Surface,
} from "@cocrepo/ui";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "이름으로 검색...",
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

export interface ActionListPageQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	group: string;
}
export type ActionListPageSetQueryStates = DataGridSetQueryStates;

export interface ActionListPageProps {
	actions?: ActionDto[];
	totalCount: number;
	isLoading: boolean;
	queryStates: ActionListPageQueryStates;
	setQueryStates: ActionListPageSetQueryStates;
	onClickCreateButton: () => void;
}

const actionTableColumns = buildActionTableColumns<ActionDto>();

function filterActions(actions: ActionDto[], search?: string) {
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

export const ActionListPage = observer(
	({
		actions,
		totalCount: totalActionCount,
		isLoading,
		queryStates,
		setQueryStates,
		onClickCreateButton,
	}: ActionListPageProps) => {
		const gridState = useLocalObservable(
			() => new DataGridStateModel({ queryStates, setQueryStates }),
		);

		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const actionRows = actions ?? [];
		const filteredActions = filterActions(actionRows, queryStates.search);
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
					<DataGrid
						config={{
							entity: "Action",
							columns: actionTableColumns,
							leftInputs,
							rightInputs,
							emptyMessage: "조회된 Action이 없습니다.",
						}}
						rows={filteredActions}
						totalCount={totalCount}
						isLoading={false}
						state={gridState}
					/>
				</Surface>
			</div>
		);
	},
);

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
