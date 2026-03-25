"use client";
import {
	AUTH_METHOD_OPTIONS,
	GRANT_TYPE_OPTIONS,
	RESPONSE_TYPE_OPTIONS,
} from "@cocrepo/constant";
import {
	Button,
	Checkbox,
	CheckboxGroup,
	Input,
	Select,
	SelectItem,
} from "@heroui/react";
import { RefreshCw, Save } from "lucide-react";
import { observer } from "mobx-react-lite";
import { RedirectUriListInput } from "../../../input/RedirectUriListInput/RedirectUriListInput";
import { VStack } from "../../../layout/VStack/VStack";

/** 폼 상태 인터페이스 */
export interface OidcClientFormState {
	clientId: string;
	clientName: string;
	clientSecret: string;
	isPublic: boolean;
	tokenEndpointAuthMethod: string;
	grantTypes: string[];
	responseTypes: string[];
	scope: string;
	redirectUris: string[];
	loginUrl: string;
	defaultReturnTo: string;
	logoUri: string;
	policyUri: string;
	tosUri: string;
	errors: Record<string, string>;
	redirectUriErrors: Record<number, string>;
}

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
									size="sm"
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
							selectedKeys={[state.tokenEndpointAuthMethod]}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								if (selected) {
									state.tokenEndpointAuthMethod = selected;
								}
							}}
							isDisabled={!isEdit && isPublic}
							isRequired
						>
							{AUTH_METHOD_OPTIONS.map((opt) => (
								<SelectItem key={opt.value}>{opt.label}</SelectItem>
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
				</section>
				{/* Redirect URIs */}
				<section>
					<div className="space-y-4 p-6">
						<h3 className="text-lg font-semibold">Redirect URIs</h3>
						{state.errors.redirectUris && (
							<p className="text-sm text-danger">{state.errors.redirectUris}</p>
						)}
						<RedirectUriListInput
							value={state.redirectUris}
							onChange={(uris) => {
								state.redirectUris = uris;
							}}
							errors={state.redirectUriErrors}
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
