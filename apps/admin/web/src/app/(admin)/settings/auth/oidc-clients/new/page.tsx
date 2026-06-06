"use client";

import { useCreateOidcClient } from "@cocrepo/api/idp/oidc-clients";
import { OidcClientCreatePage, type OidcClientFormState } from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function OidcClientNewPageRoute() {
	const router = useRouter();
	const state = useLocalObservable<OidcClientFormState>(() => ({
		clientId: "",
		name: "",
		clientSecret: "",
		isPublic: false,
		tokenEndpointAuthMethod: "client_secret_basic",
		grantTypes: ["authorization_code"],
		responseTypes: ["code"],
		scope: "openid profile email",
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
	}));
	const { mutate: createClient, isPending } = useCreateOidcClient({
		mutation: {
			onSuccess: () => {
				router.push("/settings/auth/oidc-clients" as Route);
			},
		},
	});

	return (
		<OidcClientCreatePage
			formState={state}
			isSubmitting={isPending}
			onClickBackButton={() => {
				router.push("/settings/auth/oidc-clients" as Route);
			}}
			onSubmit={(input) => {
				createClient({ data: input });
			}}
		/>
	);
});
