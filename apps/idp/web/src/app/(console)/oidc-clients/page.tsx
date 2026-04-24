"use client";

import { useGetOidcClients } from "@cocrepo/api/idp/oidc-clients";
import { OidcClientListPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export default observer(function OidcClientsPageRoute() {
	const router = useRouter();
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		search: parseAsString.withDefault(""),
	});
	const { data: response, isLoading } = useGetOidcClients({
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
	});

	return (
		<OidcClientListPage
			oidcClients={response?.data ?? []}
			totalCount={response?.meta?.totalCount ?? 0}
			isLoading={isLoading}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			onClickCreateButton={() => {
				router.push("/oidc-clients/new" as Route);
			}}
		/>
	);
});
