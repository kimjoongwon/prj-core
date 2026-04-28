"use client";

import { useGetSpaces } from "@cocrepo/api/core/spaces";
import { SpaceListPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export default observer(function SpacesPageRoute() {
	const router = useRouter();
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		search: parseAsString.withDefault(""),
	});
	const { data: response, isLoading } = useGetSpaces();

	return (
		<SpaceListPage
			spaces={response?.data}
			totalCount={response?.meta?.total ?? response?.data?.length ?? 0}
			isLoading={isLoading}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			onClickCreateButton={() => {
				router.push("/spaces/new" as Route);
			}}
			onClickSpaceGroundName={(spaceId) => {
				router.push(`/spaces/${spaceId}/ground` as Route);
			}}
		/>
	);
});
