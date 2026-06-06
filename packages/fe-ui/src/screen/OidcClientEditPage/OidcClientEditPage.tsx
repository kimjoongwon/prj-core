"use client";

import type {
	OidcClientLoginUi,
	OidcClientLoginUiVariant,
} from "@cocrepo/type";
import {
	BackButton,
	buildOidcClientLoginUi,
	FormPage,
	FormPageSurface,
	FormSection,
	FormSectionCard,
	isValidOidcLoginUiBrandColor,
	OidcClientForm,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { Button } from "../../control/Button/Button";

export interface OidcClientEditPageFormState {
	name: string;
	clientSecret: string;
	isPublic: boolean;
	tokenEndpointAuthMethod: string;
	grantTypes: string[];
	responseTypes: string[];
	scope: string;
	isFirstParty: boolean;
	skipConsent: boolean;
	redirectUris: string[];
	loginUrl: string;
	defaultReturnTo: string;
	logoUri: string;
	policyUri: string;
	tosUri: string;
	useCustomLoginUi: boolean;
	loginUiVariant: OidcClientLoginUiVariant;
	loginUiHeadline: string;
	loginUiDescription: string;
	loginUiBrandLabel: string;
	loginUiBrandColor: string;
	loginUiShowIntroPanel: boolean;
	loginUiMobileFullScreen: boolean;
	errors: Record<string, string>;
	redirectUriErrors: Record<number, string>;
	isInitialized: boolean;
	clientId: string;
}

export interface OidcClientEditPageClient {
	oidcClientId: string;
	clientId: string;
	name: string;
	clientSecret?: string | null;
	tokenEndpointAuthMethod: string;
	grantTypes: string[];
	responseTypes: string[];
	scope: string;
	isFirstParty?: boolean;
	skipConsent?: boolean;
	redirectUris: string[];
	loginUrl?: string | null;
	defaultReturnTo?: string | null;
	logoUri?: string | null;
	policyUri?: string | null;
	tosUri?: string | null;
	loginUi?: OidcClientLoginUi | null;
}

export interface OidcClientEditPageSubmitInput {
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

export interface OidcClientEditPageProps {
	client?: OidcClientEditPageClient;
	formState: OidcClientEditPageFormState;
	isLoading: boolean;
	isSubmitting: boolean;
	onClickBackButton: () => void;
	onClickListButton: () => void;
	onSubmit: (input: OidcClientEditPageSubmitInput) => void;
}

export const OidcClientEditPage = observer(
	({
		client,
		formState,
		isLoading,
		isSubmitting,
		onClickBackButton,
		onClickListButton,
		onSubmit,
	}: OidcClientEditPageProps) => {
		const isPublic = formState.tokenEndpointAuthMethod === "none";

		const validate = (): boolean => {
			const errors: Record<string, string> = {};
			const redirectUriErrors: Record<number, string> = {};
			let isValid = true;

			if (!formState.name.trim()) {
				errors.name = "이름을 입력해주세요.";
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
				name: formState.name,
				clientSecret: isPublic
					? undefined
					: formState.clientSecret || undefined,
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

		if (isLoading) {
			return (
				<FormPage
					top={
						<PageTitleBar
							title="OIDC 클라이언트 수정"
							description="클라이언트 정보를 불러오는 중입니다."
							actions={
								<BackButton onClick={onClickListButton} label="목록으로" />
							}
						/>
					}
				>
					<FormPageSurface>
						<FormSectionCard>
							<div className="flex items-center justify-center p-8">
								<span className="text-muted">로딩 중...</span>
							</div>
						</FormSectionCard>
					</FormPageSurface>
				</FormPage>
			);
		}

		if (!client) {
			return (
				<FormPage
					top={
						<PageTitleBar
							title="OIDC 클라이언트 수정"
							description="클라이언트를 찾을 수 없습니다."
							actions={
								<BackButton onClick={onClickListButton} label="목록으로" />
							}
						/>
					}
				>
					<FormPageSurface>
						<FormSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-muted">
									클라이언트를 찾을 수 없습니다.
								</p>
								<Button variant="flat" onPress={onClickListButton}>
									목록으로
								</Button>
							</div>
						</FormSectionCard>
					</FormPageSurface>
				</FormPage>
			);
		}

		return (
			<FormPage
				top={
					<PageTitleBar
						title="OIDC 클라이언트 수정"
						description={`${client.clientId} 클라이언트를 수정합니다.`}
						actions={
							<BackButton onClick={onClickBackButton} label="상세로 돌아가기" />
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
										description="기본 정보와 인증 설정을 수정합니다."
									/>
								}
							>
								<OidcClientForm
									mode="edit"
									state={formState}
									onSubmit={onClickSubmitButton}
									onCancel={onClickBackButton}
									isSubmitting={isSubmitting}
									readonlyClientId={client.clientId}
								/>
							</FormSection>
						</FormSectionCard>
					</VStack>
				</FormPageSurface>
			</FormPage>
		);
	},
);
