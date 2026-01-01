"use client";

import type React from "react";
import { Button } from "../inputs/Button/Button";
import { Input } from "../inputs/Input";
import { Text } from "../ui/data-display/Text/Text";
import { VStack } from "../ui/surfaces/VStack/VStack";

export interface PhoneVerifyPageState {
	phone: string;
	verificationCode: string;
	errorMessage: string;
}

export interface PhoneVerifyPageProps {
	state: PhoneVerifyPageState;
	onSendVerificationCode: () => void;
	onVerifyCode: () => void;
	isCodeSent?: boolean;
	isLoading?: boolean;
}

/**
 * PhoneVerifyPage 컴포넌트
 * 순수 UI 컴포넌트로, Layout은 포함하지 않습니다.
 * Layout은 반드시 Next.js layout.tsx에서 적용해야 합니다.
 */
export const PhoneVerifyPage = ({
	state,
	onSendVerificationCode,
	onVerifyCode,
	isCodeSent = false,
	isLoading = false,
}: PhoneVerifyPageProps) => {
	return (
		<VStack fullWidth gap={8} className="p-4">
			<VStack fullWidth gap={2}>
				<Text variant="h3">전화번호 인증</Text>
				<Text variant="caption">회원가입을 위해 전화번호를 인증해주세요.</Text>
			</VStack>

			<VStack fullWidth gap={4}>
				<Input
					path="phone"
					state={state}
					variant="flat"
					type="tel"
					placeholder="전화번호를 입력하세요"
					label="전화번호"
					disabled={isCodeSent}
				/>

				{!isCodeSent && (
					<Button
						color="primary"
						size="lg"
						fullWidth
						onPress={onSendVerificationCode}
						isLoading={isLoading}
					>
						<Text variant="body1" className="text-white">
							인증번호 발송
						</Text>
					</Button>
				)}

				{isCodeSent && (
					<>
						<Input
							path="verificationCode"
							state={state}
							variant="flat"
							type="text"
							placeholder="인증번호를 입력하세요"
							label="인증번호"
						/>
						<Button
							color="primary"
							size="lg"
							fullWidth
							onPress={onVerifyCode}
							isLoading={isLoading}
						>
							<Text variant="body1" className="text-white">
								인증 확인
							</Text>
						</Button>
					</>
				)}
			</VStack>

			{state.errorMessage && <Text variant="error">{state.errorMessage}</Text>}
		</VStack>
	);
};
