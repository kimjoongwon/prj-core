"use client";

import type { FormEvent } from "react";
import { observer } from "mobx-react-lite";
import {
	ForgotPasswordForm,
	type ForgotPasswordFormState,
} from "../../form/ForgotPasswordForm/ForgotPasswordForm";

export interface ForgotPasswordScreenState {
	forgotPasswordForm: ForgotPasswordFormState;
}

export interface ForgotPasswordScreenProps {
	state: ForgotPasswordScreenState;
	onSubmitForgotPasswordForm: () => void | Promise<void>;
	loginHref?: string;
}

export const ForgotPasswordScreen = observer(
	({
		state,
		onSubmitForgotPasswordForm,
		loginHref,
	}: ForgotPasswordScreenProps) => {
		const onSubmitForgotPasswordScreen = (event: FormEvent<HTMLDivElement>) => {
			event.preventDefault();
			void onSubmitForgotPasswordForm();
		};

		return (
			<div onSubmit={onSubmitForgotPasswordScreen}>
				<ForgotPasswordForm
					state={state.forgotPasswordForm}
					loginHref={loginHref}
				/>
			</div>
		);
	},
);

ForgotPasswordScreen.displayName = "ForgotPasswordScreen";
