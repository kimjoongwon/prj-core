"use client";

import { Button } from "../inputs/Button/Button";
import { Input } from "../inputs/Input";
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
				<h3 className="text-2xl font-bold">전화번호 인증</h3>
				<span className="text-sm text-default-500">
					회원가입을 위해 전화번호를 인증해주세요.
				</span>
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
						<span className="text-white">인증번호 발송</span>
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
							<span className="text-white">인증 확인</span>
						</Button>
					</>
				)}
			</VStack>

			{state.errorMessage && (
				<span className="text-sm font-medium text-danger">
					{state.errorMessage}
				</span>
			)}
		</VStack>
	);
};
