"use client";

import { useCreateOidcClient } from "@cocrepo/api/idp/oidc-clients";
import { IdpConsoleOidcClientsNewPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function OidcClientNewPageRoute() {
	const router = useRouter();
	const { mutate: createClient, isPending } = useCreateOidcClient({
		mutation: {
			onSuccess: () => {
				router.push("/oidc-clients" as Route);
			},
		},
	});

	return (
		<IdpConsoleOidcClientsNewPage
			isSubmitting={isPending}
			onClickBackButton={() => {
				router.push("/oidc-clients" as Route);
			}}
			onSubmit={(input) => {
				createClient({ data: input });
			}}
		/>
	);
});
