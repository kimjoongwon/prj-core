"use client";

import { observer } from "mobx-react-lite";
import { Button, Input, Link, Select, Textarea } from "../../control";
import { AlertBanner } from "../../display/feedback/AlertBanner/AlertBanner";
import { useT } from "../../i18n";
import { AuthCard } from "../../widget/AuthCard/AuthCard";
import { AuthCardHeader } from "../../widget/AuthCard/AuthCardHeader";

export type SignUpFormField =
	| "spaceId"
	| "email"
	| "password"
	| "confirmPassword"
	| "name"
	| "phone"
	| "address";

export interface SignUpFormState {
	spaceId: string;
	email: string;
	password: string;
	confirmPassword: string;
	name: string;
	phone: string;
	address: string;
	fieldErrors: Partial<Record<SignUpFormField, string>>;
	errorMessage: string | null;
	isSubmitted: boolean;
	isSubmitting: boolean;
	submittedEmail: string;
	submittedSpaceName: string;
}

export interface SignUpSpaceOption {
	value: string;
	label: string;
	description?: string;
}

export interface SignUpFormProps {
	state: SignUpFormState;
	spaceOptions: SignUpSpaceOption[];
	isSpacesLoading?: boolean;
	isSpacesError?: boolean;
	loginHref?: string;
	onChangeSpaceId: (value: string) => void;
	onChangeEmail: (value: string | number) => void;
	onChangePassword: (value: string | number) => void;
	onChangeConfirmPassword: (value: string | number) => void;
	onChangeName: (value: string | number) => void;
	onChangePhone: (value: string | number) => void;
	onChangeAddress: (value: string) => void;
	onClickUseAnotherEmailButton: () => void;
}

export const SignUpForm = observer(
	({
		state,
		spaceOptions,
		isSpacesLoading = false,
		isSpacesError = false,
		loginHref = "/auth/login",
		onChangeSpaceId,
		onChangeEmail,
		onChangePassword,
		onChangeConfirmPassword,
		onChangeName,
		onChangePhone,
		onChangeAddress,
		onClickUseAnotherEmailButton,
	}: SignUpFormProps) => {
		const t = useT();
		const selectedSpace = spaceOptions.find(
			(option) => option.value === state.spaceId,
		);
		const selectDescription = isSpacesLoading ? (
			t("가입 가능한 Space를 불러오는 중입니다.")
		) : selectedSpace?.description ? (
			<span>{selectedSpace.description}</span>
		) : undefined;
		const isSubmitDisabled =
			state.isSubmitting ||
			isSpacesLoading ||
			isSpacesError ||
			spaceOptions.length === 0 ||
			!state.spaceId ||
			!state.email ||
			!state.password ||
			!state.confirmPassword ||
			!state.name ||
			!state.phone ||
			!state.address;

		return (
			<AuthCard>
				<AuthCardHeader
					iconPath="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
					title="회원가입"
					subtitle="가입할 Space와 계정 정보를 입력하면 이메일 인증 링크를 보내드립니다."
				/>

				{state.isSubmitted ? (
					<div className="space-y-5">
						<div className="text-center">
							<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
								<svg
									className="h-8 w-8 text-success"
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
							<h2 className="mb-2 text-lg font-semibold">
								{t("인증 메일을 확인하세요")}
							</h2>
							<p className="mb-6 text-sm leading-6 text-default-500">
								<span className="font-medium text-foreground">
									{state.submittedEmail}
								</span>
								{t("으로 회원가입 이메일 인증 링크를 발송했습니다.")}
								<br />
								{t("메일의 인증 링크를 열면 가입이 완료됩니다.")}
							</p>
							{state.submittedSpaceName && (
								<AlertBanner
									type="success"
									title="가입 요청 완료"
									message={
										<span>
											{t("선택한 Space")}: {state.submittedSpaceName}
										</span>
									}
								/>
							)}

							<Button
								type="button"
								variant="flat"
								className="w-full"
								onPress={onClickUseAnotherEmailButton}
							>
								{t("다른 이메일로 가입하기")}
							</Button>
						</div>
					</div>
				) : (
					<div className="space-y-5">
						{state.errorMessage && (
							<AlertBanner type="danger" message={t(state.errorMessage)} />
						)}
						{isSpacesError && (
							<AlertBanner
								type="danger"
								message={t("가입 가능한 Space를 불러오지 못했습니다.")}
							/>
						)}
						{!isSpacesLoading &&
							!isSpacesError &&
							spaceOptions.length === 0 && (
								<AlertBanner
									type="warning"
									message={t("가입 가능한 Space가 없습니다.")}
								/>
							)}

						<Select
							label="가입 Space"
							placeholder="가입할 Space 선택"
							options={spaceOptions}
							value={state.spaceId}
							onChange={onChangeSpaceId}
							isRequired
							isDisabled={
								state.isSubmitting ||
								isSpacesLoading ||
								spaceOptions.length === 0
							}
							isInvalid={Boolean(state.fieldErrors.spaceId)}
							errorMessage={state.fieldErrors.spaceId}
							description={selectDescription}
						/>
						<Input
							label="이름"
							placeholder="이름을 입력하세요"
							value={state.name}
							onChange={onChangeName}
							isRequired
							autoComplete="name"
							variant="bordered"
							isInvalid={Boolean(state.fieldErrors.name)}
							errorMessage={state.fieldErrors.name}
						/>
						<Input
							label="이메일"
							placeholder="이메일을 입력하세요"
							value={state.email}
							onChange={onChangeEmail}
							isRequired
							autoComplete="email"
							type="email"
							variant="bordered"
							isInvalid={Boolean(state.fieldErrors.email)}
							errorMessage={state.fieldErrors.email}
						/>
						<Input
							label="전화번호"
							placeholder="전화번호를 입력하세요"
							value={state.phone}
							onChange={onChangePhone}
							isRequired
							autoComplete="tel"
							variant="bordered"
							isInvalid={Boolean(state.fieldErrors.phone)}
							errorMessage={state.fieldErrors.phone}
						/>
						<Textarea
							label="주소"
							placeholder="주소를 입력하세요"
							value={state.address}
							onChange={onChangeAddress}
							isRequired
							minRows={2}
							variant="bordered"
							isInvalid={Boolean(state.fieldErrors.address)}
							errorMessage={state.fieldErrors.address}
						/>
						<Input
							label="비밀번호"
							placeholder="비밀번호를 입력하세요"
							value={state.password}
							onChange={onChangePassword}
							isRequired
							autoComplete="new-password"
							type="password"
							variant="bordered"
							isInvalid={Boolean(state.fieldErrors.password)}
							errorMessage={state.fieldErrors.password}
						/>
						<Input
							label="비밀번호 확인"
							placeholder="비밀번호를 다시 입력하세요"
							value={state.confirmPassword}
							onChange={onChangeConfirmPassword}
							isRequired
							autoComplete="new-password"
							type="password"
							variant="bordered"
							isInvalid={Boolean(state.fieldErrors.confirmPassword)}
							errorMessage={state.fieldErrors.confirmPassword}
						/>

						<Button
							type="submit"
							color="primary"
							className="w-full font-semibold"
							size="lg"
							isLoading={state.isSubmitting}
							isDisabled={isSubmitDisabled}
						>
							{t("인증 메일 보내기")}
						</Button>
					</div>
				)}

				<div className="mt-6 flex flex-col items-center gap-2 text-center text-sm text-default-500">
					<span>{t("이미 계정이 있으신가요?")}</span>
					<Link
						href={loginHref}
						className="text-default-400 hover:text-default-500"
					>
						{t("로그인으로 돌아가기")}
					</Link>
				</div>
			</AuthCard>
		);
	},
);

SignUpForm.displayName = "SignUpForm";
