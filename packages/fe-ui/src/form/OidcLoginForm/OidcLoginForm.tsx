"use client";

import type { OidcClientLoginUi } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { Button } from "../../action";
import { AlertBanner } from "../../feedback/AlertBanner/AlertBanner";
import { useT } from "../../i18n";
import { Input } from "../../input";
import { Link } from "../../navigation";
import { Checkbox } from "../../selection";
import { AuthCard } from "../../widget/AuthCard/AuthCard";
import { AuthCardHeader } from "../../widget/AuthCard/AuthCardHeader";

export interface LoginRecoveryAction {
	type: string;
	label: string;
	href?: string;
}

/** 로그인 API 에러 응답 */
export interface LoginErrorResponse {
	error: string;
	displayMessage?: string;
	hint?: string;
	recoveryActions?: LoginRecoveryAction[];
	remainingAttempts?: number;
	lockedUntil?: string;
	/** 일시 잠금 임계값 (DB 정책 값) */
	temporaryLockThreshold?: number;
	/** 일시 잠금 지속시간 (분, DB 정책 값) */
	temporaryLockDurationMin?: number;
}

/** 에러 응답이 표시 문구를 제공하지 않는 경우를 대비한 기본 메시지 */
function getFallbackErrorMessage(data: LoginErrorResponse): string {
	const threshold = data.temporaryLockThreshold ?? 5;
	const durationMin = data.temporaryLockDurationMin ?? 15;

	switch (data.error) {
		case "INVALID_CREDENTIALS":
			if (data.remainingAttempts !== undefined && data.remainingAttempts > 0) {
				return `이메일 또는 비밀번호가 올바르지 않습니다. (남은 시도: ${data.remainingAttempts}/${threshold})`;
			}
			return "이메일 또는 비밀번호가 올바르지 않습니다.";
		case "ACCOUNT_LOCKED_TEMPORARY":
			return `계정이 일시 잠겼습니다. ${durationMin}분 후 다시 시도하세요.`;
		case "ACCOUNT_LOCKED_PERMANENT":
			return "계정이 잠겼습니다. 비밀번호를 재설정하거나 관리자에게 문의하세요.";
		default:
			return data.error || "로그인에 실패했습니다.";
	}
}

function getErrorTitle(error: LoginErrorResponse): string {
	switch (error.error) {
		case "ACCOUNT_LOCKED_TEMPORARY":
			return "계정 일시 잠금";
		case "ACCOUNT_LOCKED_PERMANENT":
			return "계정 잠금";
		default:
			return "로그인 실패";
	}
}

function getErrorTone(error: LoginErrorResponse): "danger" | "warning" {
	return error.error === "ACCOUNT_LOCKED_TEMPORARY" ? "warning" : "danger";
}

const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const getSafeBrandColor = (value?: string) => {
	const trimmed = value?.trim();
	return trimmed && HEX_COLOR_PATTERN.test(trimmed) ? trimmed : undefined;
};

const getLoginUiText = (value?: string) => {
	const trimmed = value?.trim();
	return trimmed || undefined;
};

const resolveLoginHeadline = (client?: OidcLoginFormProps["client"]): string =>
	getLoginUiText(client?.loginUi?.headline) ?? "로그인";

const resolveLoginDescription = (
	client?: OidcLoginFormProps["client"],
): string => {
	const customDescription = getLoginUiText(client?.loginUi?.description);
	if (customDescription) {
		return customDescription;
	}

	if (client) {
		return "{{clientName}}에 계속 접속하려면 Onora 계정으로 로그인하세요.".replace(
			"{{clientName}}",
			client.name,
		);
	}

	return "Onora 계정으로 로그인하세요.";
};

const resolveBrandLabel = (
	client?: OidcLoginFormProps["client"],
): string | undefined =>
	getLoginUiText(client?.loginUi?.brandLabel) ??
	(client?.loginUi?.variant === "branded" ? client.name : undefined);

export interface OidcLoginFormState {
	email: string;
	password: string;
	remember: boolean;
	error: LoginErrorResponse | null;
	isSubmitting: boolean;
}

/**
 * OIDC 로그인 폼 Widget
 *
 * 이메일/비밀번호 입력, 실패 상태, 복구 액션을 포함하는 로그인 폼입니다.
 * field state와 제출/에러 상태는 상위 page/feature/route가 소유합니다.
 */
export interface OidcLoginFormProps {
	state: OidcLoginFormState;
	/** 클라이언트 정보 */
	client?: {
		clientId: string;
		name: string;
		logoUri?: string;
		loginUi?: OidcClientLoginUi | null;
	} | null;
	/** DEV 모드 여부 */
	isDev?: boolean;
	forgotPasswordHref?: string;
	signUpHref?: string;
}

export const OidcLoginForm = observer(
	({
		state,
		client,
		isDev = false,
		forgotPasswordHref = "/forgot-password",
		signUpHref = "/sign-up",
	}: OidcLoginFormProps) => {
		const t = useT();
		const recoveryActions =
			state.error?.recoveryActions?.filter(
				(action) => action.href || action.label,
			) ?? [];
		const fallbackRecoveryActions =
			state.error?.error === "ACCOUNT_LOCKED_TEMPORARY" ||
			state.error?.error === "ACCOUNT_LOCKED_PERMANENT"
				? [
						{
							type: "forgot-password",
							label: t("비밀번호 재설정"),
							href: forgotPasswordHref,
						},
					]
				: [];
		const actionsToRender =
			recoveryActions.length > 0 ? recoveryActions : fallbackRecoveryActions;
		const brandLabel = resolveBrandLabel(client);
		const brandColor = getSafeBrandColor(client?.loginUi?.brandColor);

		return (
			<AuthCard>
				{brandLabel && (
					<div className="mb-4 flex justify-center">
						<span
							className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"
							style={
								brandColor
									? { borderColor: brandColor, color: brandColor }
									: undefined
							}
						>
							{t(brandLabel)}
						</span>
					</div>
				)}
				<AuthCardHeader
					iconPath="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					title={t(resolveLoginHeadline(client))}
					subtitle={t(resolveLoginDescription(client))}
					logoUri={client?.logoUri}
					logoAlt={client?.name}
				/>

				{isDev && (
					<AlertBanner
						type="warning"
						message={t("DEV MODE - Super Admin 계정이 자동 입력되었습니다")}
						className="text-center text-sm"
					/>
				)}

				{state.error && (
					<AlertBanner
						type={getErrorTone(state.error)}
						title={getErrorTitle(state.error)}
						message={
							<>
								{state.error.displayMessage
									? t(state.error.displayMessage)
									: t(getFallbackErrorMessage(state.error))}
								{state.error.hint && (
									<span className="mt-2 block text-xs leading-5 opacity-80">
										{t(state.error.hint)}
									</span>
								)}
							</>
						}
						actions={
							actionsToRender.length > 0 ? (
								<div className="flex flex-wrap gap-3 text-sm">
									{actionsToRender.map((action) =>
										action.href ? (
											<Link
												key={`${action.type}:${action.label}`}
												href={action.href}
												className="font-medium text-accent"
											>
												{t(action.label)}
											</Link>
										) : (
											<span
												key={`${action.type}:${action.label}`}
												className="text-muted"
											>
												{t(action.label)}
											</span>
										),
									)}
								</div>
							) : undefined
						}
					/>
				)}

				<form className="space-y-5">
					<Input
						path="email"
						state={state}
						label="이메일"
						placeholder="your@email.com"
						isRequired
						autoComplete="email"
						variant="bordered"
						autoFocus={!isDev}
					/>

					<Input
						path="password"
						state={state}
						label="비밀번호"
						placeholder="********"
						isRequired
						autoComplete="current-password"
						variant="bordered"
					/>

					<div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
						<Checkbox path="remember" state={state}>
							{t("로그인 상태 유지")}
						</Checkbox>

						<Link
							href={forgotPasswordHref}
							className="text-sm text-muted hover:text-accent"
						>
							{t("비밀번호를 잊으셨나요?")}
						</Link>
					</div>

					<Button
						type="submit"
						color="primary"
						className="w-full font-semibold"
						size="lg"
						isLoading={state.isSubmitting}
					>
						{t("로그인")}
					</Button>
				</form>

				<div className="mt-6 flex flex-col items-center gap-2 text-center">
					<div className="text-sm text-muted">
						{t("계정이 없으신가요?")}{" "}
						<Link href={signUpHref} className="font-medium text-accent">
							{t("회원가입")}
						</Link>
					</div>
					<button
						type="button"
						data-action="abort-interaction"
						className="text-sm text-muted transition-colors hover:text-muted"
					>
						{t("취소하고 돌아가기")}
					</button>
				</div>
			</AuthCard>
		);
	},
);

OidcLoginForm.displayName = "OidcLoginForm";
