"use client";

import { observer } from "mobx-react-lite";
import { Button } from "../../control/Button/Button";
import { Input } from "../../control/Input";
import { VStack } from "../../rhythm/VStack/VStack";

export interface AddressEmailVerifyPageState {
	/** 주소 */
	address: string;
	/** 이메일 */
	email: string;
	/** 이메일 인증번호 */
	emailVerificationCode: string;
	/** 에러 메시지 */
	errorMessage: string;
}

export interface AddressEmailVerifyPageProps {
	/** 페이지 상태 객체 */
	state: AddressEmailVerifyPageState;
	/** 이메일 인증번호 발송 핸들러 */
	onSendEmailVerification: () => void;
	/** 회원가입 완료 제출 핸들러 */
	onSubmit: () => void;
	/** 이메일 인증번호 발송 여부 */
	isEmailCodeSent?: boolean;
	/** 로딩 상태 */
	isLoading?: boolean;
}

/**
 * AddressEmailVerifyPage 컴포넌트
 * 주소와 이메일 인증을 위한 회원가입 추가 정보 입력 페이지입니다.
 * 순수 UI 컴포넌트로, Layout은 Next.js layout.tsx에서 적용합니다.
 *
 * @example
 * ```tsx
 * const [state] = useState({
 *   address: "",
 *   email: "",
 *   emailVerificationCode: "",
 *   errorMessage: "",
 * });
 *
 * <AddressEmailVerifyPage
 *   state={state}
 *   onSendEmailVerification={handleSendCode}
 *   onSubmit={handleSubmit}
 *   isEmailCodeSent={isCodeSent}
 *   isLoading={isLoading}
 * />
 * ```
 */
export const AddressEmailVerifyPage = observer(function AddressEmailVerifyPage({
	state,
	onSendEmailVerification,
	onSubmit,
	isEmailCodeSent = false,
	isLoading = false,
}: AddressEmailVerifyPageProps) {
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
});
