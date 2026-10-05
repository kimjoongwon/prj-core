"use client";

import { observer } from "mobx-react-lite";
import type { FormEvent } from "react";
import {
	SignUpForm,
	type SignUpFormState,
	type SignUpSpaceOption,
} from "../../form/SignUpForm/SignUpForm";

export interface SignUpScreenState {
	signUpForm: SignUpFormState;
}

export interface SignUpScreenProps {
	state: SignUpScreenState;
	spaceOptions: SignUpSpaceOption[];
	isSpacesLoading?: boolean;
	isSpacesError?: boolean;
	onSubmitSignUpForm: () => void | Promise<void>;
	onChangeSpaceId: (value: string) => void;
	onChangeEmail: (value: string | number) => void;
	onChangePassword: (value: string | number) => void;
	onChangeConfirmPassword: (value: string | number) => void;
	onChangeName: (value: string | number) => void;
	onChangePhone: (value: string | number) => void;
	onChangeAddress: (value: string) => void;
	onClickUseAnotherEmailButton: () => void;
	loginHref?: string;
}

export const SignUpScreen = observer(
	({
		state,
		spaceOptions,
		isSpacesLoading,
		isSpacesError,
		onSubmitSignUpForm,
		onChangeSpaceId,
		onChangeEmail,
		onChangePassword,
		onChangeConfirmPassword,
		onChangeName,
		onChangePhone,
		onChangeAddress,
		onClickUseAnotherEmailButton,
		loginHref,
	}: SignUpScreenProps) => {
		const handleSubmitSignUpScreen = (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			void onSubmitSignUpForm();
		};

		return (
			<form onSubmit={handleSubmitSignUpScreen}>
				<SignUpForm
					state={state.signUpForm}
					spaceOptions={spaceOptions}
					isSpacesLoading={isSpacesLoading}
					isSpacesError={isSpacesError}
					onChangeSpaceId={onChangeSpaceId}
					onChangeEmail={onChangeEmail}
					onChangePassword={onChangePassword}
					onChangeConfirmPassword={onChangeConfirmPassword}
					onChangeName={onChangeName}
					onChangePhone={onChangePhone}
					onChangeAddress={onChangeAddress}
					onClickUseAnotherEmailButton={onClickUseAnotherEmailButton}
					loginHref={loginHref}
				/>
			</form>
		);
	},
);

SignUpScreen.displayName = "SignUpScreen";
