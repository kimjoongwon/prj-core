"use client";

import { useCreateOidcClient } from "@cocrepo/api/idp/oidc-clients";
import {
	BackButton,
	FormPage,
	FormPageSurface,
	FormSection,
	FormSectionCard,
	OidcClientForm,
	type OidcClientFormState,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

function OidcClientNewPage() {
	return <OidcClientNewPageClient />;
}

/**
 * OIDC 클라이언트 등록 페이지 - 클라이언트 컴포넌트
 */
function OidcClientNewPageClient() {
	const router = useRouter();

	const { mutate: createClient, isPending } = useCreateOidcClient({
		mutation: {
			onSuccess: () => {
				router.push("/oidc-clients" as Route);
			},
		},
	});

	const state = useLocalObservable<OidcClientFormState>(() => ({
		clientId: "",
		clientName: "",
		clientSecret: "",
		isPublic: false,
		tokenEndpointAuthMethod: "client_secret_basic",
		grantTypes: ["authorization_code"],
		responseTypes: ["code"],
		scope: "openid profile email",
		redirectUris: [""],
		loginUrl: "",
		defaultReturnTo: "",
		logoUri: "",
		policyUri: "",
		tosUri: "",
		errors: {},
		redirectUriErrors: {},
	}));

	const validate = (): boolean => {
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

		if (!state.clientName.trim()) {
			errors.clientName = "이름을 입력해주세요.";
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

		const validUris = state.redirectUris.filter((uri) => uri.trim());
		if (validUris.length === 0) {
			errors.redirectUris = "최소 1개의 Redirect URI를 입력해주세요.";
			isValid = false;
		}

		state.redirectUris.forEach((uri, index) => {
			if (
				uri.trim() &&
				!uri.startsWith("http://") &&
				!uri.startsWith("https://")
			) {
				redirectUriErrors[index] = "http:// 또는 https://로 시작해야 합니다.";
				isValid = false;
			}
		});

		state.errors = errors;
		state.redirectUriErrors = redirectUriErrors;
		return isValid;
	};

	const onClickBackButton = () => {
		router.push("/oidc-clients" as Route);
	};

	const onClickSubmitButton = () => {
		if (!validate()) return;

		const validUris = state.redirectUris.filter((uri) => uri.trim());

		createClient({
			data: {
				clientId: state.clientId,
				clientName: state.clientName,
				clientSecret: state.isPublic ? undefined : state.clientSecret,
				tokenEndpointAuthMethod: state.tokenEndpointAuthMethod,
				grantTypes: state.grantTypes,
				responseTypes: state.responseTypes,
				scope: state.scope,
				redirectUris: validUris,
				loginUrl: state.loginUrl || undefined,
				defaultReturnTo: state.defaultReturnTo || undefined,
				logoUri: state.logoUri || undefined,
				policyUri: state.policyUri || undefined,
				tosUri: state.tosUri || undefined,
			},
		});
	};

	return (
		<FormPage
			top={
				<PageTitleBar
					title="OIDC 클라이언트 등록"
					description="새 OIDC 클라이언트를 등록합니다."
					actions={<BackButton onClick={onClickBackButton} label="목록으로" />}
				/>
			}
		>
			<FormPageSurface>
				<VStack gap={4}>
					<FormSectionCard>
						<FormSection
							top={
								<PageTitleBar
									level={2}
									title="클라이언트 설정"
									description="기본 정보, 인증 방식, Redirect URI를 입력합니다."
								/>
							}
						>
							<OidcClientForm
								mode="create"
								state={state}
								onSubmit={onClickSubmitButton}
								onCancel={onClickBackButton}
								isSubmitting={isPending}
							/>
						</FormSection>
					</FormSectionCard>
				</VStack>
			</FormPageSurface>
		</FormPage>
	);
}

export const IdpConsoleOidcClientsNewPage = observer(OidcClientNewPage);

export default IdpConsoleOidcClientsNewPage;
