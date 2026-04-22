"use client";

import type { FormEvent } from "react";
import { observer } from "mobx-react-lite";
import {
	ForgotPasswordForm,
	type ForgotPasswordFormState,
} from "../../form/ForgotPasswordForm/ForgotPasswordForm";

export interface ForgotPasswordPageState {
	forgotPasswordForm: ForgotPasswordFormState;
}

export interface ForgotPasswordPageProps {
	state: ForgotPasswordPageState;
	onSubmitForgotPasswordForm: () => void | Promise<void>;
	loginHref?: string;
}

export const ForgotPasswordPage = observer(
	({
		state,
		onSubmitForgotPasswordForm,
		loginHref,
	}: ForgotPasswordPageProps) => {
		const onSubmitForgotPasswordPage = (event: FormEvent<HTMLDivElement>) => {
			event.preventDefault();
			void onSubmitForgotPasswordForm();
		};

		return (
			<div onSubmit={onSubmitForgotPasswordPage}>
				<ForgotPasswordForm
					state={state.forgotPasswordForm}
					loginHref={loginHref}
				/>
			</div>
		);
	},
);

ForgotPasswordPage.displayName = "ForgotPasswordPage";
