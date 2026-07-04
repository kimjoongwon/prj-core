"use client";

import {
	useGetOidcClient,
	useUpdateOidcClient,
} from "@cocrepo/api/idp/oidc-clients";
import type { OidcClientLoginUi } from "@cocrepo/type";
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
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type OidcClientRouteFormState = OidcClientFormState & {
	isInitialized: boolean;
};

export default observer(function OidcClientEditRoute() {
	const oidcClientId = useParams<{ oidcClientId: string }>().oidcClientId;
	const router = useRouter();
	const state = useLocalObservable<OidcClientRouteFormState>(() => ({
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
	const { mutate: updateClient, isPending } = useUpdateOidcClient({
		mutation: {
			onSuccess: () => {
				router.push(`/settings/auth/oidc-clients/${oidcClientId}` as Route);
			},
		},
	});

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
		state.isPublic = client.tokenEndpointAuthMethod === "none";
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

	const onSubmit = () => {
		if (!validateUpdateOidcClient(state)) {
			return;
		}

		updateClient({
			oidcClientId,
			data: {
				name: state.name,
				clientSecret:
					state.tokenEndpointAuthMethod === "none"
						? undefined
						: state.clientSecret || undefined,
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
			title="OIDC Client 수정"
			description={
				client
					? `${client.clientId} Client를 수정합니다.`
					: "OIDC Client를 찾을 수 없습니다."
			}
			state={client ? state : undefined}
			isLoading={isLoading}
			notFound={!isLoading && !client}
			notFoundAction={
				<Button
					variant="flat"
					onPress={() => {
						router.push("/settings/auth/oidc-clients" as Route);
					}}
				>
					목록으로
				</Button>
			}
			actions={
				<div className="flex gap-2">
					<Button
						variant="light"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={() => {
							router.push(
								`/settings/auth/oidc-clients/${oidcClientId}` as Route,
							);
						}}
					>
						상세로 돌아가기
					</Button>
					<Button
						color="primary"
						startContent={<Save className="h-4 w-4" />}
						onPress={onSubmit}
						isLoading={isPending}
					>
						저장
					</Button>
				</div>
			}
		/>
	);
});

const isValidRedirectUri = (uri: string) =>
	/^[a-z][a-z0-9+.-]*:\/\//i.test(uri.trim());

function validateUpdateOidcClient(state: OidcClientFormState) {
	const errors: Record<string, string> = {};
	const redirectUriErrors: Record<number, string> = {};
	let isValid = true;

	if (!state.name.trim()) {
		errors.name = "이름을 입력해주세요.";
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
