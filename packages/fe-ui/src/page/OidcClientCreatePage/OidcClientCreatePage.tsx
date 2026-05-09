"use client";

import type { OidcClientLoginUi } from "@cocrepo/type";
import {
	BackButton,
	buildOidcClientLoginUi,
	FormPage,
	FormPageSurface,
	FormSection,
	FormSectionCard,
	isValidOidcLoginUiBrandColor,
	OidcClientForm,
	type OidcClientFormState,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

export interface OidcClientCreatePageSubmitInput {
	clientId: string;
	name: string;
	clientSecret?: string;
	tokenEndpointAuthMethod: string;
	grantTypes: string[];
	responseTypes: string[];
	scope: string;
	isFirstParty: boolean;
	skipConsent: boolean;
	redirectUris: string[];
	loginUrl?: string;
	defaultReturnTo?: string;
	logoUri?: string;
	policyUri?: string;
	tosUri?: string;
	loginUi?: OidcClientLoginUi | null;
}

const isValidRedirectUri = (uri: string) =>
	/^[a-z][a-z0-9+.-]*:\/\//i.test(uri.trim());

export interface OidcClientCreatePageProps {
	formState: OidcClientFormState;
	isSubmitting: boolean;
	onClickBackButton: () => void;
	onSubmit: (input: OidcClientCreatePageSubmitInput) => void;
}

export const OidcClientCreatePage = observer(
	({
		formState,
		isSubmitting,
		onClickBackButton,
		onSubmit,
	}: OidcClientCreatePageProps) => {
		const validate = (): boolean => {
			const errors: Record<string, string> = {};
			const redirectUriErrors: Record<number, string> = {};
			let isValid = true;

			if (!formState.clientId.trim()) {
				errors.clientId = "Client ID를 입력해주세요.";
				isValid = false;
			} else if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(formState.clientId)) {
				errors.clientId =
					"영문 소문자, 숫자, 하이픈만 사용 가능합니다. (예: my-app-client)";
				isValid = false;
			}

			if (!formState.name.trim()) {
				errors.name = "이름을 입력해주세요.";
				isValid = false;
			}

			if (!formState.isPublic && !formState.clientSecret.trim()) {
				errors.clientSecret = "Client Secret을 입력하거나 자동 생성해주세요.";
				isValid = false;
			}

			if (formState.grantTypes.length === 0) {
				errors.grantTypes = "최소 1개의 Grant Type을 선택해주세요.";
				isValid = false;
			}

			if (formState.responseTypes.length === 0) {
				errors.responseTypes = "최소 1개의 Response Type을 선택해주세요.";
				isValid = false;
			}

			if (
				formState.useCustomLoginUi &&
				!isValidOidcLoginUiBrandColor(formState.loginUiBrandColor)
			) {
				errors.loginUiBrandColor =
					"브랜드 컬러는 #2563eb 형식으로 입력해주세요.";
				isValid = false;
			}

			const validUris = formState.redirectUris.filter((uri) => uri.trim());
			if (validUris.length === 0) {
				errors.redirectUris = "최소 1개의 Redirect URI를 입력해주세요.";
				isValid = false;
			}

			formState.redirectUris.forEach((uri, index) => {
				if (uri.trim() && !isValidRedirectUri(uri)) {
					redirectUriErrors[index] = "scheme:// 형식으로 입력해야 합니다.";
					isValid = false;
				}
			});

			formState.errors = errors;
			formState.redirectUriErrors = redirectUriErrors;
			return isValid;
		};

		const onClickSubmitButton = () => {
			if (!validate()) return;

			const validUris = formState.redirectUris.filter((uri) => uri.trim());

			onSubmit({
				clientId: formState.clientId,
				name: formState.name,
				clientSecret: formState.isPublic ? undefined : formState.clientSecret,
				tokenEndpointAuthMethod: formState.tokenEndpointAuthMethod,
				grantTypes: formState.grantTypes,
				responseTypes: formState.responseTypes,
				scope: formState.scope,
				isFirstParty: formState.isFirstParty,
				skipConsent: formState.isFirstParty ? formState.skipConsent : false,
				redirectUris: validUris,
				loginUrl: formState.loginUrl || undefined,
				defaultReturnTo: formState.defaultReturnTo || undefined,
				logoUri: formState.logoUri || undefined,
				policyUri: formState.policyUri || undefined,
				tosUri: formState.tosUri || undefined,
				loginUi: buildOidcClientLoginUi(formState),
			});
		};

		return (
			<FormPage
				top={
					<PageTitleBar
						title="OIDC 클라이언트 등록"
						description="새 OIDC 클라이언트를 등록합니다."
						actions={
							<BackButton onClick={onClickBackButton} label="목록으로" />
						}
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
									state={formState}
									onSubmit={onClickSubmitButton}
									onCancel={onClickBackButton}
									isSubmitting={isSubmitting}
								/>
							</FormSection>
						</FormSectionCard>
					</VStack>
				</FormPageSurface>
			</FormPage>
		);
	},
);
