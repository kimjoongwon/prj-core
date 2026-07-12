"use client";

import { LanguageCode } from "@cocrepo/api/core/model";
import { useGetSpaces } from "@cocrepo/api/core/spaces";
import { SpaceListScreen } from "@cocrepo/ui";
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
		contentLanguageCode: parseAsString.withDefault(""),
	});
	const contentLanguageCode = Object.values(LanguageCode).includes(
		queryStates.contentLanguageCode as LanguageCode,
	)
		? (queryStates.contentLanguageCode as LanguageCode)
		: undefined;
	const { data: response, isLoading } = useGetSpaces({
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
		contentLanguageCode,
	});

	return (
		<SpaceListScreen
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
