"use client";

import {
	useGetOidcClient,
	useUpdateOidcClient,
} from "@cocrepo/api/idp/oidc-clients";
import {
	BackButton,
	FormPage,
	FormPageSurface,
	FormSection,
	FormSectionCard,
	OidcClientForm,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

type OidcClientEditPageParams = {
	oidcClientId: string;
};

function OidcClientEditPage() {
	const { oidcClientId } = useParams<OidcClientEditPageParams>();

	return <OidcClientEditPageClient oidcClientId={oidcClientId} />;
}

interface OidcClientEditFormState {
	clientName: string;
	clientSecret: string;
	isPublic: boolean;
	tokenEndpointAuthMethod: string;
	grantTypes: string[];
	responseTypes: string[];
	scope: string;
	redirectUris: string[];
	logoUri: string;
	policyUri: string;
	tosUri: string;
	errors: Record<string, string>;
	redirectUriErrors: Record<number, string>;
	isInitialized: boolean;
	clientId: string;
}

interface OidcClientEditPageClientProps {
	oidcClientId: string;
}

/**
 * OIDC 클라이언트 수정 페이지 - 클라이언트 컴포넌트
 */
function OidcClientEditPageClient({
	oidcClientId,
}: OidcClientEditPageClientProps) {
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

	const state = useLocalObservable<OidcClientEditFormState>(() => ({
		clientId: "",
		clientName: "",
		clientSecret: "",
		isPublic: false,
		tokenEndpointAuthMethod: "client_secret_basic",
		grantTypes: [],
		responseTypes: [],
		scope: "",
		redirectUris: [""],
		logoUri: "",
		policyUri: "",
		tosUri: "",
		errors: {},
		redirectUriErrors: {},
		isInitialized: false,
	}));

	// 기존 데이터로 폼 초기화
	useEffect(() => {
		if (client && !state.isInitialized) {
			state.clientName = client.clientName;
			state.clientSecret = client.clientSecret || "";
			state.tokenEndpointAuthMethod = client.tokenEndpointAuthMethod;
			state.grantTypes = [...client.grantTypes];
			state.responseTypes = [...client.responseTypes];
			state.scope = client.scope;
			state.redirectUris =
				client.redirectUris.length > 0 ? [...client.redirectUris] : [""];
			state.logoUri = client.logoUri || "";
			state.policyUri = client.policyUri || "";
			state.tosUri = client.tosUri || "";
			state.isInitialized = true;
		}
	}, [client, state]);

	const isPublic = state.tokenEndpointAuthMethod === "none";

	const validate = (): boolean => {
		const errors: Record<string, string> = {};
		const redirectUriErrors: Record<number, string> = {};
		let isValid = true;

		if (!state.clientName.trim()) {
			errors.clientName = "이름을 입력해주세요.";
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
		router.push(`/oidc-clients/${oidcClientId}` as Route);
	};

	const onClickListButton = () => {
		router.push("/oidc-clients" as Route);
	};

	const onClickSubmitButton = () => {
		if (!validate()) return;

		const validUris = state.redirectUris.filter((uri) => uri.trim());

		updateClient({
			oidcClientId,
			data: {
				clientName: state.clientName,
				clientSecret: isPublic ? undefined : state.clientSecret || undefined,
				tokenEndpointAuthMethod: state.tokenEndpointAuthMethod,
				grantTypes: state.grantTypes,
				responseTypes: state.responseTypes,
				scope: state.scope,
				redirectUris: validUris,
				logoUri: state.logoUri || undefined,
				policyUri: state.policyUri || undefined,
				tosUri: state.tosUri || undefined,
			},
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
							<span className="text-default-500">로딩 중...</span>
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
							<p className="text-default-500">클라이언트를 찾을 수 없습니다.</p>
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
								state={state}
								onSubmit={onClickSubmitButton}
								onCancel={onClickBackButton}
								isSubmitting={isPending}
								readonlyClientId={client.clientId}
							/>
						</FormSection>
					</FormSectionCard>
				</VStack>
			</FormPageSurface>
		</FormPage>
	);
}

export default observer(OidcClientEditPage);
