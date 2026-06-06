"use client";

import {
	useDeleteOidcClient,
	useGetOidcClient,
	useToggleActiveOidcClient,
} from "@cocrepo/api/idp/oidc-clients";
import type { OidcClientLoginUi } from "@cocrepo/type";
import { OidcClientDetailPage } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

export default observer(function OidcClientDetailPageRoute() {
	const oidcClientId = useParams<{ oidcClientId: string }>().oidcClientId;
	const router = useRouter();
	const { data: response, isLoading } = useGetOidcClient(oidcClientId);
	const client = response?.data;
	const { mutate: deleteClient, isPending: isDeleting } = useDeleteOidcClient({
		mutation: {
			onSuccess: () => {
				router.push("/settings/auth/oidc-clients" as Route);
			},
		},
	});
	const { mutate: toggleActive, isPending: isToggling } =
		useToggleActiveOidcClient();

	return (
		<OidcClientDetailPage
			client={
				client
					? {
							clientId: client.clientId,
							clientSecret: client.clientSecret,
							name: client.name,
							isActive: client.isActive,
							isFirstParty: client.isFirstParty,
							skipConsent: client.skipConsent,
							createdAt: client.createdAt,
							loginUrl: client.loginUrl,
							defaultReturnTo: client.defaultReturnTo,
							tokenEndpointAuthMethod: client.tokenEndpointAuthMethod,
							grantTypes: client.grantTypes,
							responseTypes: client.responseTypes,
							scope: client.scope,
							redirectUris: client.redirectUris,
							logoUri: client.logoUri,
							policyUri: client.policyUri,
							tosUri: client.tosUri,
							loginUi: client.loginUi as OidcClientLoginUi | null | undefined,
						}
					: undefined
			}
			isLoading={isLoading}
			isDeleting={isDeleting}
			isToggling={isToggling}
			onClickBackButton={() => {
				router.push("/settings/auth/oidc-clients" as Route);
			}}
			onClickEditButton={() => {
				router.push(
					`/settings/auth/oidc-clients/${oidcClientId}/edit` as Route,
				);
			}}
			onClickToggleActiveButton={() => {
				toggleActive({ oidcClientId });
			}}
			onClickDeleteConfirmButton={() => {
				deleteClient({ oidcClientId });
			}}
		/>
	);
});
