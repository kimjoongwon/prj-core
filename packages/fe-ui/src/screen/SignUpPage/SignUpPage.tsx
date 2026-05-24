"use client";

import { observer } from "mobx-react-lite";
import type { FormEvent } from "react";
import {
	SignUpForm,
	type SignUpFormState,
	type SignUpSpaceOption,
} from "../../form/SignUpForm/SignUpForm";

export interface SignUpPageState {
	signUpForm: SignUpFormState;
}

export interface SignUpPageProps {
	state: SignUpPageState;
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

export const SignUpPage = observer(
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
	}: SignUpPageProps) => {
		const handleSubmitSignUpPage = (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			void onSubmitSignUpForm();
		};

		return (
			<form onSubmit={handleSubmitSignUpPage}>
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

SignUpPage.displayName = "SignUpPage";
