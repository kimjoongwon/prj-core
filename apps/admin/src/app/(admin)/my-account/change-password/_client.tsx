"use client";

import { useChangePassword } from "@cocrepo/api";
import { PageSurface, SectionSurface } from "@cocrepo/ui";
import { Button, Input } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";

/** 비밀번호 정책 규칙 */
const PASSWORD_RULES = [
	{
		rule: "minLength",
		label: "8자 이상",
		test: (pw: string) => pw.length >= 8,
	},
	{
		rule: "maxLength",
		label: "128자 이하",
		test: (pw: string) => pw.length <= 128,
	},
	{
		rule: "uppercase",
		label: "영문 대문자 포함",
		test: (pw: string) => /[A-Z]/.test(pw),
	},
	{
		rule: "lowercase",
		label: "영문 소문자 포함",
		test: (pw: string) => /[a-z]/.test(pw),
	},
	{
		rule: "number",
		label: "숫자 포함",
		test: (pw: string) => /[0-9]/.test(pw),
	},
	{
		rule: "special",
		label: "특수문자 포함",
		test: (pw: string) =>
			/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`"']/.test(pw),
	},
] as const;

/** PasswordStrengthIndicator */
function PasswordStrengthIndicator({ password }: { password: string }) {
	const results = PASSWORD_RULES.map((r) => ({
		...r,
		passed: password.length > 0 ? r.test(password) : false,
	}));

	if (!password) return null;

	return (
		<div className="space-y-1.5 mt-2">
			{results.map((r) => (
				<div key={r.rule} className="flex items-center gap-2 text-sm">
					{r.passed ? (
						<svg
							className="w-4 h-4 text-success shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					) : (
						<svg
							className="w-4 h-4 text-default-400 shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					)}
					<span
						className={
							r.passed ? "text-success" : "text-default-400"
						}
					>
						{r.label}
					</span>
				</div>
			))}
		</div>
	);
}

/** 에러 메시지 매핑 */
function getErrorMessage(errorData: { message?: string }): string {
	const message = errorData?.message || "";
	if (message === "CURRENT_PASSWORD_INCORRECT") {
		return "현재 비밀번호가 올바르지 않습니다.";
	}
	if (message.startsWith("PASSWORD_POLICY_VIOLATION")) {
		return "비밀번호가 정책 조건을 충족하지 않습니다.";
	}
	if (message === "PASSWORD_REUSE") {
		return "최근 사용한 비밀번호는 다시 사용할 수 없습니다.";
	}
	if (message === "PASSWORD_MISMATCH") {
		return "비밀번호가 일치하지 않습니다.";
	}
	return "비밀번호 변경에 실패했습니다.";
}

/**
 * 비밀번호 변경 클라이언트 컴포넌트
 */
function ChangePasswordClient() {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [logoutOtherDevices, setLogoutOtherDevices] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const isPasswordValid = PASSWORD_RULES.every((r) =>
		r.test(newPassword),
	);
	const isPasswordMatch =
		newPassword === confirmPassword && confirmPassword.length > 0;
	const isFormValid =
		currentPassword.length > 0 && isPasswordValid && isPasswordMatch;

	const { mutate: submitChangePassword, isPending } = useChangePassword({
		mutation: {
			onSuccess: () => {
				setIsComplete(true);
				setSubmitError(null);
			},
			onError: (error: { response?: { data?: { message?: string } } }) => {
				const errorData = error.response?.data || {};
				setSubmitError(getErrorMessage(errorData));
			},
		},
	});

	const handleSubmit = () => {
		setSubmitError(null);
		submitChangePassword({
			data: {
				currentPassword,
				newPassword,
				confirmPassword,
				logoutOtherDevices,
			},
		});
	};

	const handleReset = () => {
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
		setLogoutOtherDevices(false);
		setIsComplete(false);
		setSubmitError(null);
	};

	return (
		<PageSurface
			title="비밀번호 변경"
			description="현재 비밀번호를 확인한 후 새 비밀번호를 설정합니다."
		>
			<SectionSurface>
				{isComplete ? (
					<div className="text-center py-8">
						<div className="w-16 h-16 bg-success/20 rounded-full mx-auto mb-4 flex items-center justify-center">
							<svg
								className="w-8 h-8 text-success"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<h2 className="text-lg font-semibold mb-2">
							비밀번호가 변경되었습니다
						</h2>
						<p className="text-default-500 text-sm mb-6">
							새 비밀번호가 적용되었습니다.
						</p>
						<Button
							variant="flat"
							onPress={handleReset}
						>
							다시 변경하기
						</Button>
					</div>
				) : (
					<form
						className="max-w-md space-y-6"
						onSubmit={(e) => {
							e.preventDefault();
							handleSubmit();
						}}
					>
						{submitError && (
							<div className="bg-danger/20 border border-danger/50 text-danger p-4 rounded-lg flex items-center gap-2 text-sm">
								<svg
									className="w-5 h-5 shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								{submitError}
							</div>
						)}

						<Input
							type="password"
							label="현재 비밀번호"
							placeholder="현재 비밀번호를 입력하세요"
							value={currentPassword}
							onValueChange={setCurrentPassword}
							isRequired
							autoComplete="current-password"
							variant="bordered"
						/>

						<div>
							<Input
								type="password"
								label="새 비밀번호"
								placeholder="새 비밀번호를 입력하세요"
								value={newPassword}
								onValueChange={setNewPassword}
								isRequired
								autoComplete="new-password"
								variant="bordered"
							/>
							<PasswordStrengthIndicator
								password={newPassword}
							/>
						</div>

						<Input
							type="password"
							label="새 비밀번호 확인"
							placeholder="새 비밀번호를 다시 입력하세요"
							value={confirmPassword}
							onValueChange={setConfirmPassword}
							isRequired
							autoComplete="new-password"
							variant="bordered"
							isInvalid={
								confirmPassword.length > 0 &&
								!isPasswordMatch
							}
							errorMessage={
								confirmPassword.length > 0 &&
								!isPasswordMatch
									? "비밀번호가 일치하지 않습니다"
									: undefined
							}
						/>

						<div className="flex items-center gap-3">
							<input
								type="checkbox"
								id="logoutOtherDevices"
								checked={logoutOtherDevices}
								onChange={(e) =>
									setLogoutOtherDevices(e.target.checked)
								}
								className="w-4 h-4 rounded border-default-300"
							/>
							<label
								htmlFor="logoutOtherDevices"
								className="text-sm text-default-600 cursor-pointer"
							>
								다른 기기에서 로그아웃
							</label>
						</div>

						<Button
							type="submit"
							color="primary"
							className="font-semibold"
							size="lg"
							isLoading={isPending}
							isDisabled={!isFormValid}
						>
							비밀번호 변경
						</Button>
					</form>
				)}
			</SectionSurface>
		</PageSurface>
	);
}

export default observer(ChangePasswordClient);
