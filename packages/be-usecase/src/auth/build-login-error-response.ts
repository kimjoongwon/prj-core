import { LoginErrorDto } from "@cocrepo/dto";
import type { LoginValidationResult } from "../idp/login-validation.result";

export function buildLoginErrorResponse(
	result: LoginValidationResult,
): LoginErrorDto {
	const baseResponse: LoginErrorDto = {
		error: result.error || "LOGIN_FAILED",
		displayMessage: "로그인에 실패했습니다.",
		remainingAttempts: result.remainingAttempts,
		lockedUntil: result.lockedUntil?.toISOString(),
		temporaryLockThreshold: result.temporaryLockThreshold,
		temporaryLockDurationMin: result.temporaryLockDurationMin,
	};

	switch (result.error) {
		case "INVALID_CREDENTIALS":
			return {
				...baseResponse,
				displayMessage:
					result.remainingAttempts !== undefined && result.remainingAttempts > 0
						? `이메일 또는 비밀번호가 올바르지 않습니다. 남은 시도 ${result.remainingAttempts}회`
						: "이메일 또는 비밀번호가 올바르지 않습니다.",
				hint: "계속 실패하면 계정이 일시 잠길 수 있습니다.",
				recoveryActions: [
					{
						type: "forgot-password",
						label: "비밀번호 재설정",
						href: "/forgot-password",
					},
				],
			};
		case "ACCOUNT_LOCKED_TEMPORARY":
			return {
				...baseResponse,
				displayMessage: `로그인 시도가 반복되어 계정이 일시 잠겼습니다. ${result.temporaryLockDurationMin ?? 15}분 후 다시 시도하세요.`,
				hint: "급한 경우 비밀번호 재설정을 진행할 수 있습니다.",
				recoveryActions: [
					{
						type: "forgot-password",
						label: "비밀번호 재설정",
						href: "/forgot-password",
					},
				],
			};
		case "ACCOUNT_LOCKED_PERMANENT":
			return {
				...baseResponse,
				displayMessage: "보안을 위해 계정이 잠겼습니다.",
				hint: "비밀번호를 재설정하거나 관리자에게 문의하세요.",
				recoveryActions: [
					{
						type: "forgot-password",
						label: "비밀번호 재설정",
						href: "/forgot-password",
					},
					{
						type: "contact-admin",
						label: "관리자 문의",
					},
				],
			};
		default:
			return baseResponse;
	}
}
