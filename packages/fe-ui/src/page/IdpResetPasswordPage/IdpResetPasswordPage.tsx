"use client";

import type { PasswordRule } from "@cocrepo/constant";
import { observer } from "mobx-react-lite";
import { ResetPasswordForm, type ResetPasswordStep } from "../../form";

export interface IdpResetPasswordPageProps {
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

export const IdpResetPasswordPage = observer(
	({
		step,
		tokenError,
		tokenEmail,
		passwordRules,
		onSubmit,
		onTokenExpired,
	}: IdpResetPasswordPageProps) => {
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

IdpResetPasswordPage.displayName = "IdpResetPasswordPage";
