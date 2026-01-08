"use client";

import { Button } from "../inputs/Button/Button";
import { Input } from "../inputs/Input";
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

/**
 * AddressEmailVerifyPage 컴포넌트
 * 순수 UI 컴포넌트로, Layout은 포함하지 않습니다.
 * Layout은 반드시 Next.js layout.tsx에서 적용해야 합니다.
 */
export const AddressEmailVerifyPage = ({
	state,
	onSendEmailVerification,
	onSubmit,
	isEmailCodeSent = false,
	isLoading = false,
}: AddressEmailVerifyPageProps) => {
	return (
		<VStack fullWidth gap={8} className="p-4">
			<VStack fullWidth gap={2}>
				<h3 className="text-2xl font-bold">추가 정보 입력</h3>
				<span className="text-sm text-default-500">
					주소와 이메일 정보를 입력하고 인증해주세요.
				</span>
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
						<span className="text-white">이메일 인증번호 발송</span>
					</Button>
				)}

				{isEmailCodeSent && (
					<Input
						path="emailVerificationCode"
						state={state}
						variant="flat"
						type="text"
						placeholder="이메일 인증번호를 입력하세요"
						label="이메일 인증번호"
					/>
				)}
			</VStack>

			{state.errorMessage && (
				<span className="text-sm font-medium text-danger">
					{state.errorMessage}
				</span>
			)}

			{isEmailCodeSent && (
				<Button
					color="primary"
					size="lg"
					fullWidth
					onPress={onSubmit}
					isLoading={isLoading}
				>
					<span className="text-white">회원가입 완료</span>
				</Button>
			)}
		</VStack>
	);
};
