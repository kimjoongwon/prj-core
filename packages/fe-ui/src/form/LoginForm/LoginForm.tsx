"use client";

import { KeyRound, Mail } from "lucide-react";
import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
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

function setEmail(state: LoginFormState, email: string | number) {
	runInAction(() => {
		state.email = String(email);
	});
}

function setPassword(state: LoginFormState, password: string | number) {
	runInAction(() => {
		state.password = String(password);
	});
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
export const LoginForm = observer(({ state }: LoginFormProps) => {
	const handleChangeEmailInput = (email: string | number) => {
		setEmail(state, email);
	};
	const handleChangePasswordInput = (password: string | number) => {
		setPassword(state, password);
	};

	return (
		<VStack fullWidth gap="section" justifyContent="center">
			<Input
				key="email"
				autoComplete="email"
				inputMode="email"
				variant="bordered"
				type="email"
				placeholder="ops@example.com"
				label="Email"
				className="text-left"
				classNames={{
					input:
						"h-12 rounded-xl border border-divider bg-background/70 px-4 pl-10 text-base shadow-sm",
					label: "text-sm font-semibold text-foreground",
				}}
				startContent={<Mail aria-hidden className="size-4" />}
				value={state.email}
				onChange={handleChangeEmailInput}
			/>
			<Input
				key="password"
				autoComplete="current-password"
				variant="bordered"
				type="password"
				placeholder="비밀번호를 입력하세요"
				label="Password"
				className="text-left"
				classNames={{
					input:
						"h-12 rounded-xl border border-divider bg-background/70 px-4 pl-10 text-base shadow-sm",
					label: "text-sm font-semibold text-foreground",
				}}
				startContent={<KeyRound aria-hidden className="size-4" />}
				value={state.password}
				onChange={handleChangePasswordInput}
			/>
		</VStack>
	);
});
