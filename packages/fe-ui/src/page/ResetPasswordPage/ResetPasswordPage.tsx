"use client";

import type { PasswordRule } from "@cocrepo/constant";
import { observer } from "mobx-react-lite";
import { ResetPasswordForm, type ResetPasswordStep } from "../../form";

export interface ResetPasswordPageProps {
	step: ResetPasswordStep;
	tokenError?: string | null;
	tokenEmail?: string;
	passwordRules: PasswordRule[];
	onSubmit: (data: {
		password: string;
		confirmPassword: string;
	}) => Promise<string | null>;
	onTokenExpired?: () => void;
}

export const ResetPasswordPage = observer(
	({
		step,
		tokenError,
		tokenEmail,
		passwordRules,
		onSubmit,
		onTokenExpired,
	}: ResetPasswordPageProps) => {
		return (
			<ResetPasswordForm
				step={step}
				tokenError={tokenError}
				tokenEmail={tokenEmail}
				passwordRules={passwordRules}
				onSubmit={onSubmit}
				onTokenExpired={onTokenExpired}
			/>
		);
	},
);

ResetPasswordPage.displayName = "ResetPasswordPage";
