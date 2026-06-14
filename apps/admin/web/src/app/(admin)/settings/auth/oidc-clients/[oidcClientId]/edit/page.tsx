"use client";

import {
	useGetOidcClient,
	useUpdateOidcClient,
} from "@cocrepo/api/idp/oidc-clients";
import type { OidcClientLoginUi } from "@cocrepo/type";
import {
	OidcClientEditScreen,
	type OidcClientEditScreenFormState,
} from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default observer(function OidcClientEditScreenRoute() {
	const oidcClientId = useParams<{ oidcClientId: string }>().oidcClientId;
	const router = useRouter();
	const state = useLocalObservable<OidcClientEditScreenFormState>(() => ({
		clientId: "",
		name: "",
		clientSecret: "",
		isPublic: false,
		tokenEndpointAuthMethod: "client_secret_basic",
		grantTypes: [],
		responseTypes: [],
		scope: "",
		isFirstParty: false,
		skipConsent: false,
		redirectUris: [""],
		loginUrl: "",
		defaultReturnTo: "",
		logoUri: "",
		policyUri: "",
		tosUri: "",
		useCustomLoginUi: false,
		loginUiVariant: "default",
		loginUiHeadline: "",
		loginUiDescription: "",
		loginUiBrandLabel: "",
		loginUiBrandColor: "",
		loginUiShowIntroPanel: true,
		loginUiMobileFullScreen: false,
		errors: {},
		redirectUriErrors: {},
		isInitialized: false,
	}));
	const { data: response, isLoading } = useGetOidcClient(oidcClientId);
	const client = response?.data;
	useEffect(() => {
		if (
			!client ||
			(state.isInitialized && state.clientId === client.clientId)
		) {
			return;
		}
		const loginUi = client.loginUi as OidcClientLoginUi | null | undefined;
		state.clientId = client.clientId;
		state.name = client.name;
		state.clientSecret = client.clientSecret || "";
		state.tokenEndpointAuthMethod = client.tokenEndpointAuthMethod;
		state.grantTypes = [...client.grantTypes];
		state.responseTypes = [...client.responseTypes];
		state.scope = client.scope;
		state.isFirstParty = client.isFirstParty;
		state.skipConsent = client.skipConsent;
		state.redirectUris =
			client.redirectUris.length > 0 ? [...client.redirectUris] : [""];
		state.loginUrl = client.loginUrl || "";
		state.defaultReturnTo = client.defaultReturnTo || "";
		state.logoUri = client.logoUri || "";
		state.policyUri = client.policyUri || "";
		state.tosUri = client.tosUri || "";
		state.useCustomLoginUi = Boolean(loginUi);
		state.loginUiVariant = loginUi?.variant ?? "default";
		state.loginUiHeadline = loginUi?.headline ?? "";
		state.loginUiDescription = loginUi?.description ?? "";
		state.loginUiBrandLabel = loginUi?.brandLabel ?? "";
		state.loginUiBrandColor = loginUi?.brandColor ?? "";
		state.loginUiShowIntroPanel = loginUi?.showIntroPanel ?? true;
		state.loginUiMobileFullScreen = loginUi?.mobileFullScreen ?? false;
		state.isInitialized = true;
	}, [client, state]);
	const { mutate: updateClient, isPending } = useUpdateOidcClient({
		mutation: {
			onSuccess: () => {
				router.push(`/settings/auth/oidc-clients/${oidcClientId}` as Route);
			},
		},
	});

	return (
		<>
			<OidcClientEditScreen
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
								isFirstParty: client.isFirstParty,
								skipConsent: client.skipConsent,
								redirectUris: client.redirectUris,
								loginUrl: client.loginUrl,
								defaultReturnTo: client.defaultReturnTo,
								logoUri: client.logoUri,
								policyUri: client.policyUri,
								tosUri: client.tosUri,
								loginUi: client.loginUi as OidcClientLoginUi | null | undefined,
							}
						: undefined
				}
				formState={state}
				isLoading={isLoading}
				isSubmitting={isPending}
				onClickBackButton={() => {
					router.push(`/settings/auth/oidc-clients/${oidcClientId}` as Route);
				}}
				onClickListButton={() => {
					router.push("/settings/auth/oidc-clients" as Route);
				}}
				onSubmit={(input) => {
					updateClient({
						oidcClientId,
						data: input,
					});
				}}
			/>
		</>
	);
});
