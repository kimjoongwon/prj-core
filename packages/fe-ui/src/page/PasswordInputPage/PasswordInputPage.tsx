"use client";

import { observer } from "mobx-react-lite";
import { Button } from "../../control/Button/Button";
import { Input } from "../../control/Input";
import { VStack } from "../../rhythm/VStack/VStack";

export interface PasswordInputPageState {
	/** 비밀번호 */
	password: string;
	/** 비밀번호 확인 */
	passwordConfirm: string;
	/** 에러 메시지 */
	errorMessage: string;
}

export interface PasswordInputPageProps {
	/** 페이지 상태 객체 */
	state: PasswordInputPageState;
	/** 다음 단계 제출 핸들러 */
	onSubmit: () => void;
	/** 로딩 상태 */
	isLoading?: boolean;
}

/**
 * PasswordInputPage 컴포넌트
 * 비밀번호 설정 페이지입니다.
 * 회원가입 과정에서 비밀번호를 입력받고 확인합니다.
 * 순수 UI 컴포넌트로, Layout은 Next.js layout.tsx에서 적용합니다.
 *
 * @example
 * ```tsx
 * const [state] = useState({
 *   password: "",
 *   passwordConfirm: "",
 *   errorMessage: "",
 * });
 *
 * <PasswordInputPage
 *   state={state}
 *   onSubmit={handlePasswordSubmit}
 *   isLoading={isLoading}
 * />
 * ```
 */
export const PasswordInputPage = observer(({
	state,
	onSubmit,
	isLoading = false,
}: PasswordInputPageProps) => {
	return (
		<VStack fullWidth gap={8} className="p-4">
			<VStack fullWidth gap={2}>
				<h3 className="text-2xl font-bold">비밀번호 설정</h3>
				<span className="text-sm text-default-500">
					사용하실 비밀번호를 입력해주세요.
				</span>
			</VStack>

			<VStack fullWidth gap={4}>
				<Input
					path="password"
					state={state}
					variant="flat"
					type="password"
					placeholder="비밀번호를 입력하세요"
					label="비밀번호"
				/>
				<Input
					path="passwordConfirm"
					state={state}
					variant="flat"
					type="password"
					placeholder="비밀번호를 다시 입력하세요"
					label="비밀번호 확인"
				/>
			</VStack>

			{state.errorMessage && (
				<span className="text-sm font-medium text-danger">
					{state.errorMessage}
				</span>
			)}

			<Button
				color="primary"
				size="lg"
				fullWidth
				onPress={onSubmit}
				isLoading={isLoading}
			>
				<span className="text-white">다음</span>
			</Button>
		</VStack>
	);
});
