"use client";

import { KeyRound, Mail } from "lucide-react";
import { observer } from "mobx-react-lite";
import { TextField } from "../../input/TextField";
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
export const LoginForm = observer(({ state }: LoginFormProps) => {
	return (
		<VStack fullWidth gap="section" justifyContent="center">
			<TextField
				key="email"
				autoComplete="email"
				className="w-full text-left"
				inputMode="email"
				path="email"
				type="email"
				placeholder="admin@plate.com"
				label="이메일"
				classNames={{
					input: "text-base",
					inputGroup:
						"h-12 w-full rounded-xl border border-border bg-background/70 shadow-sm",
					label: "text-sm font-semibold text-foreground",
					prefix: "text-muted",
				}}
				startContent={
					<Mail aria-hidden className="size-4 text-muted" />
				}
				state={state}
			/>
			<TextField
				key="password"
				autoComplete="current-password"
				className="w-full text-left"
				path="password"
				type="password"
				placeholder="비밀번호를 입력하세요"
				label="비밀번호"
				classNames={{
					input: "text-base",
					inputGroup:
						"h-12 w-full rounded-xl border border-border bg-background/70 shadow-sm",
					label: "text-sm font-semibold text-foreground",
					prefix: "text-muted",
				}}
				startContent={
					<KeyRound aria-hidden className="size-4 text-muted" />
				}
				state={state}
			/>
		</VStack>
	);
});
