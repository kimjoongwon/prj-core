"use client";

import {
	useGetOidcClient,
	useUpdateOidcClient,
} from "@cocrepo/api/idp/oidc-clients";
import {
	OidcClientEditPage,
	type OidcClientEditPageFormState,
} from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default observer(function OidcClientEditPageRoute() {
	const oidcClientId = useParams<{ oidcClientId: string }>().oidcClientId;
	const router = useRouter();
	const state =
		useLocalObservable<OidcClientEditPageFormState>(
			() => ({
				clientId: "",
				name: "",
				clientSecret: "",
				isPublic: false,
				tokenEndpointAuthMethod: "client_secret_basic",
				grantTypes: [],
				responseTypes: [],
				scope: "",
				redirectUris: [""],
				loginUrl: "",
				defaultReturnTo: "",
				logoUri: "",
				policyUri: "",
				tosUri: "",
				errors: {},
				redirectUriErrors: {},
				isInitialized: false,
			}),
		);
	const { data: response, isLoading } = useGetOidcClient(oidcClientId);
	const client = response?.data;
	useEffect(() => {
		if (!client || (state.isInitialized && state.clientId === client.clientId)) {
			return;
		}
		state.clientId = client.clientId;
		state.name = client.name;
		state.clientSecret = client.clientSecret || "";
		state.tokenEndpointAuthMethod = client.tokenEndpointAuthMethod;
		state.grantTypes = [...client.grantTypes];
		state.responseTypes = [...client.responseTypes];
		state.scope = client.scope;
		state.redirectUris =
			client.redirectUris.length > 0 ? [...client.redirectUris] : [""];
		state.loginUrl = client.loginUrl || "";
		state.defaultReturnTo = client.defaultReturnTo || "";
		state.logoUri = client.logoUri || "";
		state.policyUri = client.policyUri || "";
		state.tosUri = client.tosUri || "";
		state.isInitialized = true;
	}, [client, state]);
	const { mutate: updateClient, isPending } = useUpdateOidcClient({
		mutation: {
			onSuccess: () => {
				router.push(`/oidc-clients/${oidcClientId}` as Route);
			},
		},
	});

	return (
		<OidcClientEditPage
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
			formState={state}
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
