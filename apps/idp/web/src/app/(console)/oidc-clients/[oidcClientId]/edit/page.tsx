"use client";

import {
	useGetOidcClient,
	useUpdateOidcClient,
} from "@cocrepo/api/idp/oidc-clients";
import { IdpConsoleOidcClientsOidcClientIdEditPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

export default observer(function OidcClientEditPageRoute() {
	const oidcClientId = useParams<{ oidcClientId: string }>().oidcClientId;
	const router = useRouter();
	const { data: response, isLoading } = useGetOidcClient(oidcClientId);
	const client = response?.data;
	const { mutate: updateClient, isPending } = useUpdateOidcClient({
		mutation: {
			onSuccess: () => {
				router.push(`/oidc-clients/${oidcClientId}` as Route);
			},
		},
	});

	return (
		<IdpConsoleOidcClientsOidcClientIdEditPage
			client={
				client
					? {
							oidcClientId,
							clientId: client.clientId,
							name: client.name,
							clientSecret: client.clientSecret,
							tokenEndpointAuthMethod: client.tokenEndpointAuthMethod,
							grantTypes: client.grantTypes,
							responseTypes: client.responseTypes,
							scope: client.scope,
							redirectUris: client.redirectUris,
							loginUrl: client.loginUrl,
							defaultReturnTo: client.defaultReturnTo,
							logoUri: client.logoUri,
							policyUri: client.policyUri,
							tosUri: client.tosUri,
						}
					: undefined
			}
			isLoading={isLoading}
			isSubmitting={isPending}
			onClickBackButton={() => {
				router.push(`/oidc-clients/${oidcClientId}` as Route);
			}}
			onClickListButton={() => {
				router.push("/oidc-clients" as Route);
			}}
			onSubmit={(input) => {
				updateClient({
					oidcClientId,
					data: input,
				});
			}}
		/>
	);
});
