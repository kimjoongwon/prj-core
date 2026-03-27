"use client";

import {
	type ActionDto,
	useGetActionsSuspense,
} from "@cocrepo/api/core/actions";
import type { InputConfig } from "@cocrepo/type";
import {
	actionTableColumns,
	MetaDataGrid,
	PageTitleBar,
	Surface,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

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

type ActionsQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[0];
type SetActionsQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[1];

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

const ActionsPageContent = observer(function ActionsPageContent({
	queryStates,
	setQueryStates,
	rightInputs,
}: {
	queryStates: ActionsQueryStates;
	setQueryStates: SetActionsQueryStates;
	rightInputs: InputConfig[];
}) {
	const { data: response } = useGetActionsSuspense({
		group: queryStates.group || undefined,
	});
	const actions = response?.data ?? [];
	const filteredActions = filterActions(actions, queryStates.search);
	const totalCount = queryStates.search?.trim().length
		? filteredActions.length
		: (response?.meta?.total ?? actions.length);

	return (
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

const ActionsPageInner = observer(function ActionsPageInner() {
	const router = useRouter();
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates([
		...leftInputs,
		...groupQueryInputs,
	]);

	const onClickCreateButton = () => {
		router.push("/actions/new" as Route);
	};

	const rightInputs = buildRightInputs(onClickCreateButton);

	return (
		<div className="space-y-5">
			<PageTitleBar
				title="Action 목록"
				description="시스템에 등록된 Action을 조회합니다."
			/>
			<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
				<Suspense
					fallback={
						<MetaDataGrid
							config={{
								entity: "Action",
								data: [],
								totalCount: 0,
								isLoading: true,
								queryStates,
								setQueryStates,
								columns: actionTableColumns,
								leftInputs,
								rightInputs,
								emptyMessage: "조회된 Action이 없습니다.",
							}}
						/>
					}
				>
					<ActionsPageContent
						queryStates={queryStates}
						setQueryStates={setQueryStates}
						rightInputs={rightInputs}
					/>
				</Suspense>
			</Surface>
		</div>
	);
});

export const AdminActionsPage = observer(function ActionsPage() {
	return (
		<Suspense fallback={<ActionsPageFallback />}>
			<ActionsPageInner />
		</Suspense>
	);
});

export default AdminActionsPage;
