"use client";

import { useGetOidcClients } from "@cocrepo/api/idp/oidc-clients";
import {
	idpConsoleOidcClientsPageQueryInputs,
	IdpConsoleOidcClientsPage,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function OidcClientsPageRoute() {
	const router = useRouter();
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(
		idpConsoleOidcClientsPageQueryInputs,
	);
	const { data: response, isLoading } = useGetOidcClients({
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
	});

	return (
		<IdpConsoleOidcClientsPage
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
