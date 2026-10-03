"use client";

import type { OidcClientLoginUi } from "@cocrepo/type";
import { LockKeyhole } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Chip } from "../../data-display/Chip/Chip";
import { Typography } from "../../data-display/Typography";
import { Alert } from "../../feedback/Alert/Alert";
import { useT } from "../../i18n";
import { Button, Checkbox, Link, TextField } from "../../input";
import { Auth } from "../../layout/Auth";
import { HStack, VStack } from "../../rhythm";

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
		return "{{clientName}}에 계속 접속하려면 Plate 계정으로 로그인하세요.".replace(
			"{{clientName}}",
			client.name,
		);
	}

	return "Plate 계정으로 로그인하세요.";
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
			<Auth.Panel>
				{brandLabel && (
					<div className="mb-4 flex justify-center">
						<Chip
							size="sm"
							color="accent"
							variant="soft"
							style={brandColor ? { color: brandColor } : undefined}
						>
							{t(brandLabel)}
						</Chip>
					</div>
				)}
				<Auth.PanelHeader
					icon={<LockKeyhole className="h-6 w-6 text-accent" />}
					title={t(resolveLoginHeadline(client))}
					subtitle={t(resolveLoginDescription(client))}
					logoUri={client?.logoUri}
					logoAlt={client?.name}
				/>

				{isDev && (
					<Alert
						status="warning"
						description={t("DEV MODE - Super Admin 계정이 자동 입력되었습니다")}
						className="text-center text-sm"
					/>
				)}

				{state.error && (
					<Alert
						status={getErrorTone(state.error)}
						title={getErrorTitle(state.error)}
						description={
							<>
								{state.error.displayMessage
									? t(state.error.displayMessage)
									: t(getFallbackErrorMessage(state.error))}
								{state.error.hint && (
									<Typography className="mt-2 opacity-80" type="body-xs">
										{t(state.error.hint)}
									</Typography>
								)}
							</>
						}
						actions={
							actionsToRender.length > 0 ? (
								<HStack gap="block" className="flex-wrap">
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
											<Typography
												key={`${action.type}:${action.label}`}
												type="body-sm"
												color="muted"
											>
												{t(action.label)}
											</Typography>
										),
									)}
								</HStack>
							) : undefined
						}
					/>
				)}

				<form>
					<VStack gap="page">
						<TextField
							path="email"
							state={state}
							label="이메일"
							placeholder="your@email.com"
							isRequired
							autoComplete="email"
							variant="bordered"
							autoFocus={!isDev}
						/>

						<TextField
							path="password"
							state={state}
							label="비밀번호"
							placeholder="********"
							isRequired
							type="password"
							autoComplete="current-password"
							variant="bordered"
						/>

						<HStack
							gap="section"
							alignItems="start"
							className="flex-col sm:flex-row sm:items-center sm:justify-between"
						>
							<Checkbox path="remember" state={state}>
								{t("로그인 상태 유지")}
							</Checkbox>

							<Link
								href={forgotPasswordHref}
								className="text-sm text-muted hover:text-accent"
							>
								{t("비밀번호를 잊으셨나요?")}
							</Link>
						</HStack>

						<Button
							type="submit"
							variant="primary"
							className="w-full font-semibold"
							size="lg"
							isLoading={state.isSubmitting}
						>
							{t("로그인")}
						</Button>
					</VStack>
				</form>

				<VStack gap="block" alignItems="center" className="mt-6 text-center">
					<Typography type="body-sm" color="muted">
						{t("계정이 없으신가요?")}{" "}
						<Link href={signUpHref} className="font-medium text-accent">
							{t("회원가입")}
						</Link>
					</Typography>
					<button
						type="button"
						data-action="abort-interaction"
						className="text-sm text-muted transition-colors hover:text-muted"
					>
						{t("취소하고 돌아가기")}
					</button>
				</VStack>
			</Auth.Panel>
		);
	},
);

OidcLoginForm.displayName = "OidcLoginForm";
