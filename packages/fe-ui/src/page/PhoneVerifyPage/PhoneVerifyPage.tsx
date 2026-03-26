"use client";

import { observer } from "mobx-react-lite";
import { Button } from "../../control/Button/Button";
import { Input } from "../../control/Input";
import { VStack } from "../../layout/VStack/VStack";

export interface PhoneVerifyPageState {
	/** 전화번호 */
	phone: string;
	/** 인증번호 */
	verificationCode: string;
	/** 에러 메시지 */
	errorMessage: string;
}

export interface PhoneVerifyPageProps {
	/** 페이지 상태 객체 */
	state: PhoneVerifyPageState;
	/** 인증번호 발송 핸들러 */
	onSendVerificationCode: () => void;
	/** 인증번호 확인 핸들러 */
	onVerifyCode: () => void;
	/** 인증번호 발송 여부 */
	isCodeSent?: boolean;
	/** 로딩 상태 */
	isLoading?: boolean;
}

/**
 * PhoneVerifyPage 컴포넌트
 * 전화번호 인증 페이지입니다.
 * 회원가입 과정에서 전화번호를 입력받고 SMS 인증을 수행합니다.
 * 순수 UI 컴포넌트로, Layout은 Next.js layout.tsx에서 적용합니다.
 *
 * @example
 * ```tsx
 * const [state] = useState({
 *   phone: "",
 *   verificationCode: "",
 *   errorMessage: "",
 * });
 *
 * <PhoneVerifyPage
 *   state={state}
 *   onSendVerificationCode={handleSendCode}
 *   onVerifyCode={handleVerify}
 *   isCodeSent={isCodeSent}
 *   isLoading={isLoading}
 * />
 * ```
 */
export const PhoneVerifyPage = observer(function PhoneVerifyPage({
	state,
	onSendVerificationCode,
	onVerifyCode,
	isCodeSent = false,
	isLoading = false,
}: PhoneVerifyPageProps) {
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
});
