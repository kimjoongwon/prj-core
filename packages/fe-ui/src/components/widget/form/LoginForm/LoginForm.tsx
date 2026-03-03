import { Input } from "../../../inputs/Input";
import { VStack } from "../../../layouts/VStack/VStack";

export interface LoginFormProps {
	/** 로그인 상태 객체 (email, password 필드 포함) */
	state: {
		email: string;
		password: string;
	};
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
