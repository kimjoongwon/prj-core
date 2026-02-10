"use client";

import { useCreateOidcClient } from "@cocrepo/api";
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
import { ArrowLeft, RefreshCw, Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

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
interface OidcClientFormState {
	clientId: string;
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
}

/**
 * 랜덤 시크릿 생성
 */
const generateSecret = (): string => {
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < 32; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
};

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
			errors.clientSecret =
				"Client Secret을 입력하거나 자동 생성해주세요.";
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
			if (uri.trim() && !uri.startsWith("http://") && !uri.startsWith("https://")) {
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
		router.push("/oidc-clients" as Route);
	};

	const onClickGenerateSecret = () => {
		state.clientSecret = generateSecret();
	};

	const onClickTogglePublic = (checked: boolean) => {
		state.isPublic = checked;
		if (checked) {
			state.clientSecret = "";
			state.tokenEndpointAuthMethod = "none";
		} else {
			state.tokenEndpointAuthMethod = "client_secret_basic";
		}
	};

	const onClickSubmitButton = () => {
		if (!validate()) return;

		const validUris = state.redirectUris.filter((uri) => uri.trim());

		createClient({
			data: {
				clientId: state.clientId,
				clientName: state.clientName,
				clientSecret: state.isPublic
					? undefined
					: state.clientSecret,
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

	return (
		<PageSurface
			title="OIDC 클라이언트 등록"
			description="새 OIDC 클라이언트를 등록합니다."
			actions={
				<Button
					variant="light"
					startContent={<ArrowLeft className="h-4 w-4" />}
					onPress={onClickBackButton}
				>
					목록으로
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
							placeholder="my-app-client"
							value={state.clientId}
							onValueChange={(v) => {
								state.clientId = v;
							}}
							isInvalid={!!state.errors.clientId}
							errorMessage={state.errors.clientId}
							isRequired
							description="영문 소문자, 숫자, 하이픈만 사용 가능합니다."
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

						<div className="space-y-2">
							<Input
								label="Client Secret"
								placeholder={
									state.isPublic
										? "Public 클라이언트는 Secret이 필요 없습니다"
										: "직접 입력하거나 자동 생성하세요"
								}
								value={state.clientSecret}
								onValueChange={(v) => {
									state.clientSecret = v;
								}}
								isInvalid={!!state.errors.clientSecret}
								errorMessage={state.errors.clientSecret}
								isDisabled={state.isPublic}
								endContent={
									!state.isPublic && (
										<Button
											size="sm"
											variant="flat"
											onPress={onClickGenerateSecret}
											startContent={
												<RefreshCw className="h-3 w-3" />
											}
										>
											자동 생성
										</Button>
									)
								}
							/>
							<Checkbox
								isSelected={state.isPublic}
								onValueChange={onClickTogglePublic}
								size="sm"
							>
								Public 클라이언트 (Secret 없음)
							</Checkbox>
						</div>
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
							isDisabled={state.isPublic}
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
						등록
					</Button>
				</div>
			</VStack>
		</PageSurface>
	);
}

export default observer(OidcClientNewPageClient);
