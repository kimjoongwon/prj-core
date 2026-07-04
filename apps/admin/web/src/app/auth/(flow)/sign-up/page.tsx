"use client";

import {
	type SignUpMutationBody,
	type SpaceDto,
	useGetSignUpSpaces,
	useSignUp,
} from "@cocrepo/api/idp/auth";
import { REQUEST_HEADER_KEYS } from "@cocrepo/constant";
import {
	type SignUpFormField,
	SignUpScreen,
	type SignUpSpaceOption,
} from "@cocrepo/ui";
import type { AxiosError } from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

interface SignUpErrorResponse {
	error?: string;
	message?: string | string[];
}

class SignUpRoutePageState {
	signUpForm = {
		spaceId: "",
		email: "",
		password: "",
		confirmPassword: "",
		name: "",
		phone: "",
		address: "",
		fieldErrors: {} as Partial<Record<SignUpFormField, string>>,
		errorMessage: null as string | null,
		isSubmitted: false,
		isSubmitting: false,
		submittedEmail: "",
		submittedSpaceName: "",
	};

	constructor() {
		makeAutoObservable(this);
	}

	setSpaceId(value: string) {
		this.signUpForm.spaceId = value;
		this.clearError("spaceId");
	}

	setEmail(value: string | number) {
		this.signUpForm.email = String(value);
		this.clearError("email");
	}

	setPassword(value: string | number) {
		this.signUpForm.password = String(value);
		this.clearError("password");
		this.clearError("confirmPassword");
	}

	setConfirmPassword(value: string | number) {
		this.signUpForm.confirmPassword = String(value);
		this.clearError("confirmPassword");
	}

	setName(value: string | number) {
		this.signUpForm.name = String(value);
		this.clearError("name");
	}

	setPhone(value: string | number) {
		this.signUpForm.phone = String(value);
		this.clearError("phone");
	}

	setAddress(value: string) {
		this.signUpForm.address = value;
		this.clearError("address");
	}

	syncDefaultSpace(spaceOptions: SignUpSpaceOption[]) {
		if (spaceOptions.length === 0) {
			this.signUpForm.spaceId = "";
			return;
		}

		const hasSelectedSpace = spaceOptions.some(
			(option) => option.value === this.signUpForm.spaceId,
		);
		if (!hasSelectedSpace) {
			this.signUpForm.spaceId = spaceOptions[0]?.value ?? "";
		}
	}

	async submit(
		request: (payload: SignUpMutationBody) => Promise<void>,
		spaceOptions: SignUpSpaceOption[],
	) {
		this.signUpForm.errorMessage = null;
		if (!this.validate()) {
			return;
		}

		const selectedSpace = spaceOptions.find(
			(option) => option.value === this.signUpForm.spaceId,
		);
		this.signUpForm.isSubmitting = true;

		try {
			await request({
				email: this.signUpForm.email,
				name: this.signUpForm.name,
				nickname: this.signUpForm.name,
				phone: this.signUpForm.phone,
				address: this.signUpForm.address,
				password: this.signUpForm.password,
				spaceId: this.signUpForm.spaceId,
			});
			runInAction(() => {
				this.signUpForm.isSubmitted = true;
				this.signUpForm.submittedEmail = this.signUpForm.email;
				this.signUpForm.submittedSpaceName = selectedSpace?.label ?? "";
				this.signUpForm.password = "";
				this.signUpForm.confirmPassword = "";
			});
		} catch (error) {
			runInAction(() => {
				this.signUpForm.errorMessage = this.resolveSubmitError(error);
			});
		} finally {
			runInAction(() => {
				this.signUpForm.isSubmitting = false;
			});
		}
	}

	resetForAnotherEmail() {
		this.signUpForm.email = "";
		this.signUpForm.password = "";
		this.signUpForm.confirmPassword = "";
		this.signUpForm.errorMessage = null;
		this.signUpForm.fieldErrors = {};
		this.signUpForm.isSubmitted = false;
		this.signUpForm.submittedEmail = "";
		this.signUpForm.submittedSpaceName = "";
	}

	private validate() {
		const errors: Partial<Record<SignUpFormField, string>> = {};
		const requiredFields: SignUpFormField[] = [
			"spaceId",
			"email",
			"password",
			"confirmPassword",
			"name",
			"phone",
			"address",
		];

		for (const field of requiredFields) {
			if (!this.signUpForm[field].trim()) {
				errors[field] = "필수 입력 항목입니다";
			}
		}

		if (
			this.signUpForm.email &&
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.signUpForm.email)
		) {
			errors.email = "유효한 이메일 주소를 입력해주세요";
		}

		if (this.signUpForm.password && this.signUpForm.password.length < 8) {
			errors.password = "비밀번호는 8자 이상 입력해주세요.";
		}

		if (
			this.signUpForm.confirmPassword &&
			this.signUpForm.password !== this.signUpForm.confirmPassword
		) {
			errors.confirmPassword = "비밀번호가 일치하지 않습니다";
		}

		this.signUpForm.fieldErrors = errors;
		return Object.keys(errors).length === 0;
	}

	private clearError(field: SignUpFormField) {
		if (this.signUpForm.fieldErrors[field]) {
			delete this.signUpForm.fieldErrors[field];
		}
		this.signUpForm.errorMessage = null;
	}

	private resolveSubmitError(error: unknown) {
		const axiosError = error as AxiosError<SignUpErrorResponse>;
		const errorCode = axiosError.response?.data?.error;
		const message = axiosError.response?.data?.message;

		if (errorCode === "EMAIL_ALREADY_EXISTS") {
			return "이미 가입된 이메일입니다.";
		}
		if (errorCode === "EMAIL_VERIFICATION_RESEND_COOLDOWN") {
			return "잠시 후 다시 인증 메일을 요청해주세요.";
		}
		if (errorCode === "SIGN_UP_SPACE_NOT_FOUND") {
			return "선택한 Space를 찾을 수 없습니다.";
		}
		if (errorCode === "SIGN_UP_SPACE_HEADER_MISMATCH") {
			return "선택한 Space 정보가 일치하지 않습니다.";
		}
		if (typeof message === "string" && message) {
			return message;
		}
		return "회원가입 요청을 처리할 수 없습니다.";
	}
}

const createSpaceOption = (space: SpaceDto): SignUpSpaceOption => {
	const label = space.ground?.name ?? space.id;
	const description = space.ground?.address ?? space.ground?.label ?? undefined;

	return {
		value: space.id,
		label,
		description,
	};
};

const SignUpRoutePage = observer(() => {
	const signUpRoutePage = useLocalObservable(() => new SignUpRoutePageState());
	const selectedSpaceId = signUpRoutePage.signUpForm.spaceId;
	const spacesQuery = useGetSignUpSpaces({
		query: {
			retry: false,
			refetchOnWindowFocus: false,
		},
	});
	const signUpMutation = useSignUp({
		request: selectedSpaceId
			? {
					headers: {
						[REQUEST_HEADER_KEYS.TENANT_ID]: selectedSpaceId,
					},
				}
			: undefined,
	});
	const spaceOptions = (spacesQuery.data?.data ?? []).map(createSpaceOption);

	useEffect(() => {
		const nextSpaceOptions = (spacesQuery.data?.data ?? []).map(
			createSpaceOption,
		);
		signUpRoutePage.syncDefaultSpace(nextSpaceOptions);
	}, [signUpRoutePage, spacesQuery.data]);

	const onSubmitSignUpForm = async () => {
		await signUpRoutePage.submit(async (payload) => {
			await signUpMutation.mutateAsync({
				data: payload,
			});
		}, spaceOptions);
	};
	const onChangeSpaceId = (value: string) => {
		signUpRoutePage.setSpaceId(value);
	};
	const onChangeEmail = (value: string | number) => {
		signUpRoutePage.setEmail(value);
	};
	const onChangePassword = (value: string | number) => {
		signUpRoutePage.setPassword(value);
	};
	const onChangeConfirmPassword = (value: string | number) => {
		signUpRoutePage.setConfirmPassword(value);
	};
	const onChangeName = (value: string | number) => {
		signUpRoutePage.setName(value);
	};
	const onChangePhone = (value: string | number) => {
		signUpRoutePage.setPhone(value);
	};
	const onChangeAddress = (value: string) => {
		signUpRoutePage.setAddress(value);
	};
	const onClickUseAnotherEmailButton = () => {
		signUpRoutePage.resetForAnotherEmail();
	};

	return (
		<SignUpScreen
			state={signUpRoutePage}
			spaceOptions={spaceOptions}
			isSpacesLoading={spacesQuery.isLoading}
			isSpacesError={spacesQuery.isError}
			onSubmitSignUpForm={onSubmitSignUpForm}
			onChangeSpaceId={onChangeSpaceId}
			onChangeEmail={onChangeEmail}
			onChangePassword={onChangePassword}
			onChangeConfirmPassword={onChangeConfirmPassword}
			onChangeName={onChangeName}
			onChangePhone={onChangePhone}
			onChangeAddress={onChangeAddress}
			onClickUseAnotherEmailButton={onClickUseAnotherEmailButton}
		/>
	);
});

export default SignUpRoutePage;
