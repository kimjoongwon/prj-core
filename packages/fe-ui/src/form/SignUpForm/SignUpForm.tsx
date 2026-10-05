"use client";

import { CheckCircle, UserPlus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Typography } from "../../data-display/Typography";
import { Alert } from "../../feedback/Alert/Alert";
import { useT } from "../../i18n";
import { Button, Link, TextArea, TextField } from "../../input";
import { Select } from "../../input/Select/Select";
import { Auth } from "../../layout/Auth";
import { VStack } from "../../rhythm";

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
			<Auth.Panel>
				<Auth.PanelHeader
					icon={<UserPlus className="h-6 w-6 text-accent" />}
					title="회원가입"
					subtitle="가입할 Space와 계정 정보를 입력하면 이메일 인증 링크를 보내드립니다."
				/>

				{state.isSubmitted ? (
					<VStack gap="page">
						<div className="text-center">
							<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
								<CheckCircle className="h-8 w-8 text-success" />
							</div>
							<Typography.Heading className="mb-2" level={5}>
								{t("인증 메일을 확인하세요")}
							</Typography.Heading>
							<Typography className="mb-6" type="body-sm" color="muted">
								<span className="font-medium text-foreground">
									{state.submittedEmail}
								</span>
								{t("으로 회원가입 이메일 인증 링크를 발송했습니다.")}
								<br />
								{t("메일의 인증 링크를 열면 가입이 완료됩니다.")}
							</Typography>
							{state.submittedSpaceName && (
								<Alert
									status="success"
									title="가입 요청 완료"
									description={`${t("선택한 Space")}: ${state.submittedSpaceName}`}
								/>
							)}

							<Button
								type="button"
								variant="tertiary"
								className="w-full"
								onPress={onClickUseAnotherEmailButton}
							>
								{t("다른 이메일로 가입하기")}
							</Button>
						</div>
					</VStack>
				) : (
					<VStack gap="page">
						{state.errorMessage && (
							<Alert status="danger" description={t(state.errorMessage)} />
						)}
						{isSpacesError && (
							<Alert
								status="danger"
								description={t("가입 가능한 Space를 불러오지 못했습니다.")}
							/>
						)}
						{!isSpacesLoading &&
							!isSpacesError &&
							spaceOptions.length === 0 && (
								<Alert
									status="warning"
									description={t("가입 가능한 Space가 없습니다.")}
								/>
							)}

						<Select
							label="가입 Space"
							placeholder="가입할 Space 선택"
							options={spaceOptions}
							value={state.spaceId}
							onChange={(value) => onChangeSpaceId(String(value ?? ""))}
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
						<TextField
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
						<TextField
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
						<TextField
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
						<TextArea
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
						<TextField
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
						<TextField
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
							variant="primary"
							className="w-full font-semibold"
							size="lg"
							isLoading={state.isSubmitting}
							isDisabled={isSubmitDisabled}
						>
							{t("인증 메일 보내기")}
						</Button>
					</VStack>
				)}

				<VStack gap="block" alignItems="center" className="mt-6 text-center">
					<Typography type="body-sm" color="muted">
						{t("이미 계정이 있으신가요?")}
					</Typography>
					<Link href={loginHref} className="text-muted hover:text-muted">
						{t("로그인으로 돌아가기")}
					</Link>
				</VStack>
			</Auth.Panel>
		);
	},
);

SignUpForm.displayName = "SignUpForm";
