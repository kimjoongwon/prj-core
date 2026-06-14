"use client";

import { useGetActions } from "@cocrepo/api/core/actions";
import { ActionListScreen } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export default observer(function ActionsPageRoute() {
	const router = useRouter();
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		search: parseAsString.withDefault(""),
		group: parseAsString.withDefault(""),
	});
	const { data: response, isLoading } = useGetActions(undefined);
	const onClickCreateButton = () => {
		router.push("/actions/new" as Route);
	};
	const onClickActionRow = (actionId: string) => {
		router.push(`/actions/${actionId}` as Route);
	};

	return (
		<>
			<ActionListScreen
				actions={response?.data}
				isLoading={isLoading}
				queryStates={queryStates}
				setQueryStates={setQueryStates}
				onClickCreateButton={onClickCreateButton}
				onClickActionRow={onClickActionRow}
			/>
		</>
	);
});
