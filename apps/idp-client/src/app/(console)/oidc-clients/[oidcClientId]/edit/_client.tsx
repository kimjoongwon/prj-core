"use client";

import { useGetOidcClient, useUpdateOidcClient } from "@cocrepo/api";
import {
	PageSurface,
	RedirectUriListInput,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import {
	Button,
	Checkbox,
	CheckboxGroup,
	Input,
	Select,
	SelectItem,
} from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * 인증 방식 옵션
 */
const AUTH_METHOD_OPTIONS = [
	{ value: "client_secret_basic", label: "client_secret_basic" },
	{ value: "client_secret_post", label: "client_secret_post" },
	{ value: "none", label: "none (Public Client)" },
];

/**
 * Grant Type 옵션
 */
const GRANT_TYPE_OPTIONS = [
	{ value: "authorization_code", label: "authorization_code" },
	{ value: "client_credentials", label: "client_credentials" },
	{ value: "refresh_token", label: "refresh_token" },
];

/**
 * Response Type 옵션
 */
const RESPONSE_TYPE_OPTIONS = [
	{ value: "code", label: "code" },
];

/**
 * 폼 상태
 */
interface OidcClientEditFormState {
	clientName: string;
	clientSecret: string;
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
		clientName: "",
		clientSecret: "",
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
				client.redirectUris.length > 0
					? [...client.redirectUris]
					: [""];
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
			errors.responseTypes =
				"최소 1개의 Response Type을 선택해주세요.";
			isValid = false;
		}

		const validUris = state.redirectUris.filter((uri) => uri.trim());
		if (validUris.length === 0) {
			errors.redirectUris =
				"최소 1개의 Redirect URI를 입력해주세요.";
			isValid = false;
		}

		state.redirectUris.forEach((uri, index) => {
			if (
				uri.trim() &&
				!uri.startsWith("http://") &&
				!uri.startsWith("https://")
			) {
				redirectUriErrors[index] =
					"http:// 또는 https://로 시작해야 합니다.";
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
			<PageSurface
				title="OIDC 클라이언트 수정"
				description="로딩 중..."
			>
				<div className="flex items-center justify-center p-8">
					<span className="text-default-500">로딩 중...</span>
				</div>
			</PageSurface>
		);
	}

	if (!client) {
		return (
			<PageSurface
				title="OIDC 클라이언트 수정"
				description="클라이언트를 찾을 수 없습니다."
			>
				<div className="flex flex-col items-center justify-center gap-4 p-8">
					<p className="text-default-500">
						클라이언트를 찾을 수 없습니다.
					</p>
					<Button
						variant="flat"
						onPress={() =>
							router.push("/oidc-clients" as Route)
						}
					>
						목록으로
					</Button>
				</div>
			</PageSurface>
		);
	}

	return (
		<PageSurface
			title="OIDC 클라이언트 수정"
			description={`${client.clientId} 클라이언트를 수정합니다.`}
			actions={
				<Button
					variant="light"
					startContent={<ArrowLeft className="h-4 w-4" />}
					onPress={onClickBackButton}
				>
					상세로 돌아가기
				</Button>
			}
		>
			<VStack gap={4}>
				{/* 기본 정보 */}
				<SectionSurface>
					<div className="space-y-6 p-6">
						<h3 className="text-lg font-semibold">기본 정보</h3>

						<Input
							label="Client ID"
							value={client.clientId}
							isReadOnly
							isDisabled
							description="Client ID는 수정할 수 없습니다."
						/>

						<Input
							label="이름"
							placeholder="My Application"
							value={state.clientName}
							onValueChange={(v) => {
								state.clientName = v;
							}}
							isInvalid={!!state.errors.clientName}
							errorMessage={state.errors.clientName}
							isRequired
						/>

						<Input
							label="Client Secret"
							placeholder={
								isPublic
									? "Public 클라이언트는 Secret이 필요 없습니다"
									: "변경하지 않으려면 비워두세요"
							}
							value={state.clientSecret}
							onValueChange={(v) => {
								state.clientSecret = v;
							}}
							isDisabled={isPublic}
							description={
								isPublic
									? undefined
									: "비워두면 기존 Secret이 유지됩니다."
							}
						/>
					</div>
				</SectionSurface>

				{/* 인증 설정 */}
				<SectionSurface>
					<div className="space-y-6 p-6">
						<h3 className="text-lg font-semibold">인증 설정</h3>

						<Select
							label="인증 방식"
							selectedKeys={[state.tokenEndpointAuthMethod]}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								if (selected) {
									state.tokenEndpointAuthMethod = selected;
								}
							}}
							isRequired
						>
							{AUTH_METHOD_OPTIONS.map((opt) => (
								<SelectItem key={opt.value}>
									{opt.label}
								</SelectItem>
							))}
						</Select>

						<CheckboxGroup
							label="Grant Types"
							value={state.grantTypes}
							onValueChange={(v) => {
								state.grantTypes = v;
							}}
							isInvalid={!!state.errors.grantTypes}
							errorMessage={state.errors.grantTypes}
							isRequired
						>
							{GRANT_TYPE_OPTIONS.map((opt) => (
								<Checkbox key={opt.value} value={opt.value}>
									{opt.label}
								</Checkbox>
							))}
						</CheckboxGroup>

						<CheckboxGroup
							label="Response Types"
							value={state.responseTypes}
							onValueChange={(v) => {
								state.responseTypes = v;
							}}
							isInvalid={!!state.errors.responseTypes}
							errorMessage={state.errors.responseTypes}
							isRequired
						>
							{RESPONSE_TYPE_OPTIONS.map((opt) => (
								<Checkbox key={opt.value} value={opt.value}>
									{opt.label}
								</Checkbox>
							))}
						</CheckboxGroup>

						<Input
							label="스코프"
							placeholder="openid profile email"
							value={state.scope}
							onValueChange={(v) => {
								state.scope = v;
							}}
							isRequired
							description="공백으로 구분하여 입력합니다."
						/>
					</div>
				</SectionSurface>

				{/* Redirect URIs */}
				<SectionSurface>
					<div className="space-y-4 p-6">
						<h3 className="text-lg font-semibold">Redirect URIs</h3>
						{state.errors.redirectUris && (
							<p className="text-sm text-danger">
								{state.errors.redirectUris}
							</p>
						)}
						<RedirectUriListInput
							value={state.redirectUris}
							onChange={(uris) => {
								state.redirectUris = uris;
							}}
							errors={state.redirectUriErrors}
						/>
					</div>
				</SectionSurface>

				{/* 추가 정보 */}
				<SectionSurface>
					<div className="space-y-6 p-6">
						<h3 className="text-lg font-semibold">
							추가 정보 (선택)
						</h3>

						<Input
							label="로고 URI"
							placeholder="https://example.com/logo.png"
							value={state.logoUri}
							onValueChange={(v) => {
								state.logoUri = v;
							}}
						/>

						<Input
							label="정책 URI"
							placeholder="https://example.com/privacy"
							value={state.policyUri}
							onValueChange={(v) => {
								state.policyUri = v;
							}}
						/>

						<Input
							label="약관 URI"
							placeholder="https://example.com/terms"
							value={state.tosUri}
							onValueChange={(v) => {
								state.tosUri = v;
							}}
						/>
					</div>
				</SectionSurface>

				{/* 버튼 영역 */}
				<div className="flex justify-end gap-2">
					<Button variant="flat" onPress={onClickBackButton}>
						취소
					</Button>
					<Button
						color="primary"
						startContent={<Save className="h-4 w-4" />}
						onPress={onClickSubmitButton}
						isLoading={isPending}
					>
						저장
					</Button>
				</div>
			</VStack>
		</PageSurface>
	);
}

export default observer(OidcClientEditPageClient);
