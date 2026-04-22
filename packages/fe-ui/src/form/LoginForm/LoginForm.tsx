import { Input } from "../../control/Input";
import { VStack } from "../../rhythm/VStack/VStack";

export interface LoginFormState {
	email: string;
	password: string;
}

export interface LoginFormProps {
	/** 로그인 상태 객체 (필드명은 화면 계약에 따라 달라질 수 있으며, 이 구현은 email/password 예시를 사용) */
	state: LoginFormState;
}

/**
 * LoginForm 컴포넌트
 * 이메일과 비밀번호 입력 필드를 제공하는 로그인 폼입니다.
 *
 * @example
 * ```tsx
 * const [state] = useState({ email: "", password: "" });
 *
 * <LoginForm state={state} />
 * ```
 */
export const LoginForm = ({ state }: LoginFormProps) => {
	return (
		<VStack fullWidth justifyContent="center">
			<Input
				path="email"
				state={state}
				variant="flat"
				type="email"
				placeholder="Enter your email"
				label="Email"
			/>
			<Input
				path="password"
				state={state}
				variant="flat"
				type="password"
				placeholder="Enter your password"
				label="Password"
			/>
		</VStack>
	);
};
