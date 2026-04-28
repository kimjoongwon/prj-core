"use client";

import { useGetActions } from "@cocrepo/api/core/actions";
import { ActionListPage } from "@cocrepo/ui";
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
	const { data: response, isLoading } = useGetActions({
		group: queryStates.group || undefined,
	});

	const totalCount = response?.meta?.total ?? response?.data?.length ?? 0;

	return (
		<ActionListPage
			actions={response?.data}
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
