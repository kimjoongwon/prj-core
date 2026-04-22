"use client";

import type { PasswordRule } from "@cocrepo/constant";
import type { FormEvent } from "react";
import { observer } from "mobx-react-lite";
import {
	ResetPasswordForm,
	type ResetPasswordFormState,
	type ResetPasswordStep,
} from "../../form/ResetPasswordForm/ResetPasswordForm";

export interface ResetPasswordPageState {
	resetPasswordForm: ResetPasswordFormState;
	resetPasswordStep: ResetPasswordStep;
	tokenError?: string | null;
	tokenEmail?: string;
	passwordRules: PasswordRule[];
}

export interface ResetPasswordPageProps {
	state: ResetPasswordPageState;
	onSubmitResetPasswordForm: () => void | Promise<void>;
	forgotPasswordHref?: string;
	loginHref?: string;
}

export const ResetPasswordPage = observer(
	({
		state,
		onSubmitResetPasswordForm,
		forgotPasswordHref,
		loginHref,
	}: ResetPasswordPageProps) => {
		const onSubmitResetPasswordPage = (event: FormEvent<HTMLDivElement>) => {
			event.preventDefault();
			void onSubmitResetPasswordForm();
		};

		return (
			<div onSubmit={onSubmitResetPasswordPage}>
				<ResetPasswordForm
					step={state.resetPasswordStep}
					tokenError={state.tokenError}
					tokenEmail={state.tokenEmail}
					state={state.resetPasswordForm}
					passwordRules={state.passwordRules}
					forgotPasswordHref={forgotPasswordHref}
					loginHref={loginHref}
				/>
			</div>
		);
	},
);

ResetPasswordPage.displayName = "ResetPasswordPage";
