"use client";

import { useCreateOidcClient } from "@cocrepo/api/core/oidc-clients";
import {
	Button,
	buildOidcClientLoginUi,
	isValidOidcLoginUiBrandColor,
	OidcClientEditScreen,
	type OidcClientFormState,
} from "@cocrepo/ui";
import { ArrowLeft, Save } from "lucide-react";
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

	const onSubmit = () => {
		if (!validateCreateOidcClient(state)) {
			return;
		}

		createClient({
			data: {
				clientId: state.clientId,
				name: state.name,
				clientSecret: state.isPublic ? undefined : state.clientSecret,
				tokenEndpointAuthMethod: state.tokenEndpointAuthMethod,
				grantTypes: state.grantTypes,
				responseTypes: state.responseTypes,
				scope: state.scope,
				isFirstParty: state.isFirstParty,
				skipConsent: state.isFirstParty ? state.skipConsent : false,
				redirectUris: state.redirectUris.filter((uri) => uri.trim()),
				loginUrl: state.loginUrl || undefined,
				defaultReturnTo: state.defaultReturnTo || undefined,
				logoUri: state.logoUri || undefined,
				policyUri: state.policyUri || undefined,
				tosUri: state.tosUri || undefined,
				loginUi: buildOidcClientLoginUi(state),
			},
		});
	};

	return (
		<OidcClientEditScreen
			title="OIDC Client 등록"
			description="새 OIDC Client를 등록합니다."
			state={state}
			actions={
				<div className="flex gap-2">
					<Button
						variant="ghost"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push("/settings/auth/oidc-clients" as Route);
						}}
					>
						목록으로
					</Button>
					<Button
						variant="primary"
						startContent={<Save className="h-4 w-4" />}
						onPress={onSubmit}
						isLoading={isPending}
					>
						등록
					</Button>
				</div>
			}
		/>
	);
});

const isValidRedirectUri = (uri: string) =>
	/^[a-z][a-z0-9+.-]*:\/\//i.test(uri.trim());

function validateCreateOidcClient(state: OidcClientFormState) {
	const errors: Record<string, string> = {};
	const redirectUriErrors: Record<number, string> = {};
	let isValid = true;

	if (!state.clientId.trim()) {
		errors.clientId = "Client ID를 입력해주세요.";
		isValid = false;
	} else if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(state.clientId)) {
		errors.clientId =
			"영문 소문자, 숫자, 하이픈만 사용 가능합니다. (예: my-app-client)";
		isValid = false;
	}

	if (!state.name.trim()) {
		errors.name = "이름을 입력해주세요.";
		isValid = false;
	}

	if (!state.isPublic && !state.clientSecret.trim()) {
		errors.clientSecret = "Client Secret을 입력하거나 자동 생성해주세요.";
		isValid = false;
	}

	if (state.grantTypes.length === 0) {
		errors.grantTypes = "최소 1개의 Grant Type을 선택해주세요.";
		isValid = false;
	}

	if (state.responseTypes.length === 0) {
		errors.responseTypes = "최소 1개의 Response Type을 선택해주세요.";
		isValid = false;
	}

	if (
		state.useCustomLoginUi &&
		!isValidOidcLoginUiBrandColor(state.loginUiBrandColor)
	) {
		errors.loginUiBrandColor = "브랜드 컬러는 #2563eb 형식으로 입력해주세요.";
		isValid = false;
	}

	const validUris = state.redirectUris.filter((uri) => uri.trim());
	if (validUris.length === 0) {
		errors.redirectUris = "최소 1개의 Redirect URI를 입력해주세요.";
		isValid = false;
	}

	state.redirectUris.forEach((uri, index) => {
		if (uri.trim() && !isValidRedirectUri(uri)) {
			redirectUriErrors[index] = "scheme:// 형식으로 입력해야 합니다.";
			isValid = false;
		}
	});

	state.errors = errors;
	state.redirectUriErrors = redirectUriErrors;
	return isValid;
}
