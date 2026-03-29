"use client";

import { useGetActions } from "@cocrepo/api/core/actions";
import {
	AdminActionsPage,
	type AdminActionsPageAction,
	adminActionsPageQueryInputs,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function ActionsPageRoute() {
	const router = useRouter();
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(
		adminActionsPageQueryInputs,
	);
	const { data: response, isLoading } = useGetActions({
		group: queryStates.group || undefined,
	});

	const actions = (response?.data ?? []).map(mapActionListItem);
	const totalCount = response?.meta?.total ?? actions.length;

	return (
		<AdminActionsPage
			actions={actions}
			totalCount={totalCount}
			isLoading={isLoading}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			onClickCreateButton={() => {
				router.push("/actions/new" as Route);
			}}
		/>
	);
});

function mapActionListItem(action: {
	id: string;
	name: string;
	displayName?: string | null;
	group?: string | null;
	order: number;
	isSystem: boolean;
	createdAt: string;
	removedAt?: string | null;
}): AdminActionsPageAction {
	return {
		id: action.id,
		name: action.name,
		displayName: action.displayName,
		group: action.group,
		order: action.order,
		isSystem: action.isSystem,
		createdAt: action.createdAt,
		removedAt: action.removedAt,
	};
}
