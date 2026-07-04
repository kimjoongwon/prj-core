"use client";

import { LoginSchema } from "@cocrepo/schema";
import type { FormSchemaStateContract } from "@cocrepo/type";
import { KeyRound, Mail } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { TextField } from "../../input/TextField";
import { Form } from "../Form";

export interface LoginFormState extends FormSchemaStateContract<LoginSchema> {
	email: string;
	password: string;
}

export interface LoginFormProps {
	/** 로그인 상태 객체 (필드명은 화면 계약에 따라 달라질 수 있으며, 이 구현은 email/password 예시를 사용) */
	state: LoginFormState;
	readOnly?: boolean;
	children?: ReactNode;
	"aria-label"?: string;
}

/**
 * LoginForm 컴포넌트
 * 이메일과 비밀번호 입력 필드를 제공하는 로그인 폼입니다.
 *
 * @example
 * ```tsx
 * const [state] = useState({
 *   email: "",
 *   password: "",
 *   fieldErrors: {},
 *   errorMessage: null,
 * });
 *
 * <LoginForm state={state} />
 * ```
 */
export const LoginForm = observer(
	({
		state,
		readOnly = false,
		children,
		"aria-label": ariaLabel,
	}: LoginFormProps) => {
		return (
			<Form
				aria-label={ariaLabel}
				className="flex flex-col w-full gap-6 justify-center"
				state={state}
				schema={LoginSchema}
				readOnly={readOnly}
			>
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
					startContent={<Mail aria-hidden className="size-4 text-muted" />}
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
					startContent={<KeyRound aria-hidden className="size-4 text-muted" />}
					state={state}
				/>
				{children}
			</Form>
		);
	},
);
