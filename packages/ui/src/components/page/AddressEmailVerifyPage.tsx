"use client";

import type React from "react";

import { Text } from "../ui/data-display/Text/Text";
import { Button } from "../ui/inputs/Button/Button";
import { Input } from "../ui/inputs/Input";
import { AuthLayout } from "../ui/layouts/Auth/AuthLayout";
import { VStack } from "../ui/surfaces/VStack/VStack";

export interface AddressEmailVerifyPageState {
	address: string;
	email: string;
	emailVerificationCode: string;
	errorMessage: string;
}

export interface AddressEmailVerifyPageProps {
	state: AddressEmailVerifyPageState;
	onSendEmailVerification: () => void;
	onSubmit: () => void;
	isEmailCodeSent?: boolean;
	isLoading?: boolean;
}

export const AddressEmailVerifyPage = ({
	state,
	onSendEmailVerification,
	onSubmit,
	isEmailCodeSent = false,
	isLoading = false,
}: AddressEmailVerifyPageProps) => {
	const formComponent = (
		<VStack fullWidth gap={8} className="p-4">
			<VStack fullWidth gap={2}>
				<Text variant="h3">추가 정보 입력</Text>
				<Text variant="caption">
					주소와 이메일 정보를 입력하고 인증해주세요.
				</Text>
			</VStack>

			<VStack fullWidth gap={4}>
				<Input
					path="address"
					state={state}
					variant="flat"
					type="text"
					placeholder="주소를 입력하세요"
					label="주소"
				/>

				<Input
					path="email"
					state={state}
					variant="flat"
					type="email"
					placeholder="이메일을 입력하세요"
					label="이메일"
					disabled={isEmailCodeSent}
				/>

				{!isEmailCodeSent && (
					<Button
						color="primary"
						size="md"
						fullWidth
						onPress={onSendEmailVerification}
						isLoading={isLoading}
					>
						<Text variant="body1" className="text-white">
							이메일 인증번호 발송
						</Text>
					</Button>
				)}

				{isEmailCodeSent && (
					<>
						<Input
							path="emailVerificationCode"
							state={state}
							variant="flat"
							type="text"
							placeholder="이메일 인증번호를 입력하세요"
							label="이메일 인증번호"
						/>
					</>
				)}
			</VStack>

			{state.errorMessage && (
				<Text variant="error">{state.errorMessage}</Text>
			)}

			{isEmailCodeSent && (
				<Button
					color="primary"
					size="lg"
					fullWidth
					onPress={onSubmit}
					isLoading={isLoading}
				>
					<Text variant="body1" className="text-white">
						회원가입 완료
					</Text>
				</Button>
			)}
		</VStack>
	);

	return <AuthLayout formComponent={formComponent} />;
};
