"use client";
import {
	AUTH_METHOD_OPTIONS,
	GRANT_TYPE_OPTIONS,
	RESPONSE_TYPE_OPTIONS,
} from "@cocrepo/constant";
import type {
	OidcClientLoginUi,
	OidcClientLoginUiVariant,
} from "@cocrepo/type";
import { RefreshCw, Save } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../control/Button/Button";
import { Checkbox } from "../../control/Checkbox/Checkbox";
import { CheckboxGroup, FieldError, Label, ListBox } from "@heroui/react";
import { Input } from "../../control/Input/Input";
import { Select } from "../../control/Select/Select";
import { StringListInput } from "../../control/StringListInput/StringListInput";
import { VStack } from "../../rhythm/VStack/VStack";

export const OIDC_CLIENT_LOGIN_UI_VARIANT_OPTIONS: Array<{
	label: string;
	value: OidcClientLoginUiVariant;
}> = [
	{ label: "기본", value: "default" },
	{ label: "컴팩트", value: "compact" },
	{ label: "브랜디드", value: "branded" },
];

const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const isValidOidcLoginUiBrandColor = (value: string) => {
	const trimmed = value.trim();
	return !trimmed || HEX_COLOR_PATTERN.test(trimmed);
};

/** 폼 상태 인터페이스 */
export interface OidcClientFormState {
	clientId: string;
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
}

export const buildOidcClientLoginUi = (
	state: OidcClientFormState,
): OidcClientLoginUi | null => {
	if (!state.useCustomLoginUi) {
		return null;
	}

	const loginUi: OidcClientLoginUi = {
		variant: state.loginUiVariant,
		showIntroPanel: state.loginUiShowIntroPanel,
		mobileFullScreen: state.loginUiMobileFullScreen,
	};
	const headline = state.loginUiHeadline.trim();
	const description = state.loginUiDescription.trim();
	const brandLabel = state.loginUiBrandLabel.trim();
	const brandColor = state.loginUiBrandColor.trim();

	if (headline) {
		loginUi.headline = headline;
	}

	if (description) {
		loginUi.description = description;
	}

	if (brandLabel) {
		loginUi.brandLabel = brandLabel;
	}

	if (brandColor) {
		loginUi.brandColor = brandColor;
	}

	return loginUi;
};

export interface OidcClientFormProps {
	/** 생성/수정 모드 */
	mode: "create" | "edit";
	/** MobX observable 폼 상태 */
	state: OidcClientFormState;
	/** 제출 핸들러 */
	onSubmit: () => void;
	/** 취소/뒤로가기 핸들러 */
	onCancel: () => void;
	/** 제출 중 여부 */
	isSubmitting?: boolean;
	/** 수정 모드일 때 읽기 전용 Client ID */
	readonlyClientId?: string;
}

/** 랜덤 시크릿 생성 */
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
 * OIDC 클라이언트 등록/수정 폼 Widget
 *
 * 기본정보 + 인증설정 + Redirect URIs + 추가정보 4개 섹션 블록으로 구성됩니다.
 * mode prop으로 create/edit를 분기합니다.
 */
export const OidcClientForm = observer(
	({
		mode,
		state,
		onSubmit,
		onCancel,
		isSubmitting = false,
		readonlyClientId,
	}: OidcClientFormProps) => {
		const isEdit = mode === "edit";
		const isPublic = isEdit
			? state.tokenEndpointAuthMethod === "none"
			: state.isPublic;

		const handleGenerateSecret = () => {
			state.clientSecret = generateSecret();
		};

		const handleTogglePublic = (checked: boolean) => {
			state.isPublic = checked;
			if (checked) {
				state.clientSecret = "";
				state.tokenEndpointAuthMethod = "none";
			} else {
				state.tokenEndpointAuthMethod = "client_secret_basic";
			}
		};

		const handleToggleFirstParty = (checked: boolean) => {
			state.isFirstParty = checked;
			if (!checked) {
				state.skipConsent = false;
			}
		};

		const handleToggleSkipConsent = (checked: boolean) => {
			state.skipConsent = state.isFirstParty && checked;
		};

		const handleToggleCommonLoginUi = (checked: boolean) => {
			state.useCustomLoginUi = !checked;
		};

		const handleToggleLoginUiIntroPanel = (checked: boolean) => {
			state.loginUiShowIntroPanel = checked;
		};

		const handleToggleLoginUiMobileFullScreen = (checked: boolean) => {
			state.loginUiMobileFullScreen = checked;
		};

		return (
			<VStack gap={4}>
				{/* 기본 정보 */}
				<section>
					<div className="space-y-6 p-6">
						<h3 className="text-lg font-semibold">기본 정보</h3>
						{isEdit ? (
							<Input
								label="Client ID"
								value={readonlyClientId ?? ""}
								isReadOnly
								isDisabled
								description="Client ID는 수정할 수 없습니다."
							/>
						) : (
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
						)}
						<Input
							label="이름"
							placeholder="My Application"
							value={state.name}
							onValueChange={(v) => {
								state.name = v;
							}}
							isInvalid={!!state.errors.name}
							errorMessage={state.errors.name}
							isRequired
						/>
						<div className="space-y-2">
							<Input
								label="Client Secret"
								placeholder={
									isPublic
										? "Public 클라이언트는 Secret이 필요 없습니다"
										: isEdit
											? "변경하지 않으려면 비워두세요"
											: "직접 입력하거나 자동 생성하세요"
								}
								value={state.clientSecret}
								onValueChange={(v) => {
									state.clientSecret = v;
								}}
								isInvalid={!!state.errors.clientSecret}
								errorMessage={state.errors.clientSecret}
								isDisabled={isPublic}
								description={
									isEdit && !isPublic
										? "비워두면 기존 Secret이 유지됩니다."
										: undefined
								}
								endContent={
									!isPublic &&
									!isEdit && (
										<Button
											size="sm"
											variant="flat"
											onPress={handleGenerateSecret}
											startContent={<RefreshCw className="h-3 w-3" />}
										>
											자동 생성
										</Button>
									)
								}
							/>
							{!isEdit && (
								<Checkbox
									isSelected={state.isPublic}
									onValueChange={handleTogglePublic}
								>
									Public 클라이언트 (Secret 없음)
								</Checkbox>
							)}
						</div>
					</div>
				</section>
				{/* 인증 설정 */}
				<section>
					<div className="space-y-6 p-6">
						<h3 className="text-lg font-semibold">인증 설정</h3>
							<Select
								label="인증 방식"
								value={
									AUTH_METHOD_OPTIONS.some(
										(option) => option.value === state.tokenEndpointAuthMethod,
									)
										? state.tokenEndpointAuthMethod
										: null
								}
								onChange={(value) => {
									if (value != null) {
										state.tokenEndpointAuthMethod = String(value);
									}
								}}
								isDisabled={!isEdit && isPublic}
							isRequired
							>
								{AUTH_METHOD_OPTIONS.map((opt) => (
									<ListBox.Item
										key={opt.value}
										id={opt.value}
										textValue={opt.label}
									>
										{opt.label}
									</ListBox.Item>
								))}
							</Select>
							<CheckboxGroup
								value={state.grantTypes}
								onChange={(v: string[]) => {
									state.grantTypes = v;
								}}
								isInvalid={!!state.errors.grantTypes}
								isRequired
							>
								<Label>Grant Types</Label>
								{GRANT_TYPE_OPTIONS.map((opt) => (
									<Checkbox key={opt.value} value={opt.value}>
										{opt.label}
									</Checkbox>
								))}
								{state.errors.grantTypes ? (
									<FieldError>{state.errors.grantTypes}</FieldError>
								) : null}
							</CheckboxGroup>
							<CheckboxGroup
								value={state.responseTypes}
								onChange={(v: string[]) => {
									state.responseTypes = v;
								}}
								isInvalid={!!state.errors.responseTypes}
								isRequired
							>
								<Label>Response Types</Label>
								{RESPONSE_TYPE_OPTIONS.map((opt) => (
									<Checkbox key={opt.value} value={opt.value}>
										{opt.label}
									</Checkbox>
								))}
								{state.errors.responseTypes ? (
									<FieldError>{state.errors.responseTypes}</FieldError>
								) : null}
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
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div className="rounded-xl border border-border p-4">
								<Checkbox
									isSelected={state.isFirstParty}
									onValueChange={handleToggleFirstParty}
								>
									First-party 클라이언트
								</Checkbox>
								<p className="mt-2 text-xs leading-5 text-muted">
									플랫폼이 소유하거나 신뢰하는 클라이언트로 표시합니다.
								</p>
							</div>
							<div className="rounded-xl border border-border p-4">
								<Checkbox
									isDisabled={!state.isFirstParty}
									isSelected={state.isFirstParty && state.skipConsent}
									onValueChange={handleToggleSkipConsent}
								>
									권한 동의 화면 생략
								</Checkbox>
								<p className="mt-2 text-xs leading-5 text-muted">
									First-party에서만 사용할 수 있으며, prompt=consent 요청은 항상
									동의 화면을 표시합니다.
								</p>
							</div>
						</div>
					</div>
				</section>
				{/* Redirect URIs */}
				<section>
					<div className="space-y-4 p-6">
						<h3 className="text-lg font-semibold">Redirect URIs</h3>
						{state.errors.redirectUris && (
							<p className="text-sm text-danger">{state.errors.redirectUris}</p>
						)}
						<StringListInput
							value={state.redirectUris}
							onChange={(uris) => {
								state.redirectUris = uris;
							}}
							errors={state.redirectUriErrors}
							placeholder="https://example.com/callback"
							addLabel="URI 추가"
							removeLabel="URI 삭제"
						/>
					</div>
				</section>
				<section>
					<div className="space-y-6 p-6">
						<h3 className="text-lg font-semibold">앱 복귀 설정 (선택)</h3>
						<Input
							label="로그인 셸 URL"
							placeholder="/admin/auth/login 또는 https://app.example.com/auth/login"
							value={state.loginUrl}
							onValueChange={(v) => {
								state.loginUrl = v;
							}}
							description="`/api/v1/auth/login?clientId=...` 흐름에서 인증 실패 시 복귀할 로그인 화면입니다."
						/>
						<Input
							label="기본 복귀 URL"
							placeholder="/admin/dashboard 또는 https://app.example.com/dashboard"
							value={state.defaultReturnTo}
							onValueChange={(v) => {
								state.defaultReturnTo = v;
							}}
							description="callback에 returnTo가 없을 때 사용할 기본 복귀 경로입니다."
						/>
					</div>
				</section>
				<section>
					<div className="space-y-6 p-6">
						<div>
							<h3 className="text-lg font-semibold">로그인 화면 설정</h3>
							<p className="mt-1 text-sm text-muted">
								IDP Web 로그인 폼은 공통 컴포넌트를 사용하고, 여기서는 client별
								표현만 덮어씁니다.
							</p>
						</div>
						<Checkbox
							isSelected={!state.useCustomLoginUi}
							onValueChange={handleToggleCommonLoginUi}
						>
							공통 로그인 사용
						</Checkbox>

						{state.useCustomLoginUi && (
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<Select
										label="화면 Variant"
										value={state.loginUiVariant}
										onChange={(value) => {
											if (value != null) {
												state.loginUiVariant = String(
													value,
												) as OidcClientLoginUiVariant;
											}
										}}
									>
										{OIDC_CLIENT_LOGIN_UI_VARIANT_OPTIONS.map((opt) => (
											<ListBox.Item
												key={opt.value}
												id={opt.value}
												textValue={opt.label}
											>
												{opt.label}
											</ListBox.Item>
										))}
									</Select>
								<Input
									label="브랜드 라벨"
									placeholder="Onora Mobile"
									value={state.loginUiBrandLabel}
									onValueChange={(v) => {
										state.loginUiBrandLabel = v;
									}}
								/>
								<Input
									label="헤드라인"
									placeholder="오노라 로그인"
									value={state.loginUiHeadline}
									onValueChange={(v) => {
										state.loginUiHeadline = v;
									}}
								/>
								<Input
									label="브랜드 컬러"
									placeholder="#2563eb"
									value={state.loginUiBrandColor}
									onValueChange={(v) => {
										state.loginUiBrandColor = v;
									}}
									isInvalid={!!state.errors.loginUiBrandColor}
									errorMessage={state.errors.loginUiBrandColor}
									description="HEX 색상만 입력합니다. 예: #2563eb"
								/>
								<div className="md:col-span-2">
									<Input
										label="설명 문구"
										placeholder="예약과 방문 일정을 계속 확인하려면 계정으로 로그인하세요."
										value={state.loginUiDescription}
										onValueChange={(v) => {
											state.loginUiDescription = v;
										}}
									/>
								</div>
								<Checkbox
									isSelected={state.loginUiShowIntroPanel}
									onValueChange={handleToggleLoginUiIntroPanel}
								>
									데스크톱 소개 영역 표시
								</Checkbox>
								<Checkbox
									isSelected={state.loginUiMobileFullScreen}
									onValueChange={handleToggleLoginUiMobileFullScreen}
								>
									모바일에서 로그인 카드 우선 표시
								</Checkbox>
							</div>
						)}
					</div>
				</section>
				{/* 추가 정보 */}
				<section>
					<div className="space-y-6 p-6">
						<h3 className="text-lg font-semibold">추가 정보 (선택)</h3>
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
				</section>
				{/* 버튼 영역 */}
				<div className="flex justify-end gap-2">
					<Button variant="flat" onPress={onCancel}>
						취소
					</Button>
					<Button
						color="primary"
						startContent={<Save className="h-4 w-4" />}
						onPress={onSubmit}
						isLoading={isSubmitting}
					>
						{isEdit ? "저장" : "등록"}
					</Button>
				</div>
			</VStack>
		);
	},
);

OidcClientForm.displayName = "OidcClientForm";
