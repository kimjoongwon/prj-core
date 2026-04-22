"use client";
import { useRequestPasswordReset } from "@cocrepo/api/idp/password-reset";

import { type IReactionDisposer, makeAutoObservable, reaction } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { FormEvent } from "react";
import { useEffect } from "react";
import {
	ForgotPasswordForm,
	type ForgotPasswordFormState,
} from "../../../form/ForgotPasswordForm/ForgotPasswordForm";

type RequestPasswordResetFn = (payload: {
	data: { email: string };
}) => Promise<unknown>;

class IdpForgotPasswordFeatureState {
	forgotPasswordForm: ForgotPasswordFormState = {
		email: "",
		errorMessage: null,
		isSubmitted: false,
		isSubmitting: false,
	};

	private readonly clearErrorDisposer: IReactionDisposer;

	constructor() {
		makeAutoObservable<IdpForgotPasswordFeatureState, "clearErrorDisposer">(
			this,
			{ clearErrorDisposer: false },
			{ autoBind: true },
		);
		this.clearErrorDisposer = reaction(
			() => this.forgotPasswordForm.email,
			() => {
				if (this.forgotPasswordForm.errorMessage) {
					this.forgotPasswordForm.errorMessage = null;
				}
			},
		);
	}

	async submitForgotPassword(requestPasswordReset: RequestPasswordResetFn) {
		this.forgotPasswordForm.errorMessage = null;
		this.forgotPasswordForm.isSubmitting = true;

		try {
			await requestPasswordReset({
				data: { email: this.forgotPasswordForm.email },
			});
			this.forgotPasswordForm.isSubmitted = true;
		} catch {
			this.forgotPasswordForm.errorMessage = "서버와 통신할 수 없습니다.";
		} finally {
			this.forgotPasswordForm.isSubmitting = false;
		}
	}

	destroy() {
		this.clearErrorDisposer();
	}
}

/**
 * IDP 비밀번호 찾기 Feature
 *
 * ForgotPasswordForm Widget에 실제 API 호출 로직을 연결합니다.
 */
export const IdpForgotPassword = observer(() => {
	const resetMutation = useRequestPasswordReset();
	const state = useLocalObservable(() => new IdpForgotPasswordFeatureState());

	useEffect(() => {
		return () => {
			state.destroy();
		};
	}, [state]);

	const onSubmitForgotPasswordFeature = (event: FormEvent<HTMLDivElement>) => {
		event.preventDefault();
		void state.submitForgotPassword(resetMutation.mutateAsync);
	};

	return (
		<div onSubmit={onSubmitForgotPasswordFeature}>
			<ForgotPasswordForm state={state.forgotPasswordForm} />
		</div>
	);
});

IdpForgotPassword.displayName = "IdpForgotPassword";
