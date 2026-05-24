"use client";

import { observer } from "mobx-react-lite";
import type { FormEvent } from "react";
import { Button } from "../../control/Button/Button";
import { LoginForm, type LoginFormState } from "../../form/LoginForm/LoginForm";
import { useT } from "../../i18n";
import { VStack } from "../../rhythm/VStack/VStack";

export interface LoginPageState {
	loginForm: LoginFormState;
	/** 페이지 레벨 에러 메시지 */
	errorMessage: string;
}

export interface LoginPageProps {
	/** 페이지가 소비하는 state slice */
	state: LoginPageState;
	/** 로그인 폼 제출 핸들러 */
	onSubmitLoginForm: () => void | Promise<void>;
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 로그인 페이지 제목 (예: "관리자 로그인", "파트너 로그인") */
	title: string;
	/** 로그인 페이지 설명 문구 */
	caption: string;
}

/**
 * LoginPage 컴포넌트
 * 이메일/비밀번호 기반 로그인 페이지입니다.
 * 순수 UI 컴포넌트로, Layout은 Next.js layout.tsx에서 적용합니다.
 *
 * @example
 * ```tsx
 * class LoginRoutePageState {
 *   loginPage = {
 *     loginForm: {
 *       email: "",
 *       password: "",
 *     },
 *     errorMessage: "",
 *   };
 *
 *   constructor() {
 *     makeAutoObservable(this);
 *   }
 * }
 *
 * const state = useLocalObservable(() => new LoginRoutePageState());
 *
 * <LoginPage
 *   state={state.loginPage}
 *   title="관리자 로그인"
 *   caption="관리자 계정으로 로그인해주세요."
 *   onSubmitLoginForm={handleLogin}
 *   isLoading={isLoading}
 * />
 * ```
 */
export const LoginPage = observer(
	({
		state,
		onSubmitLoginForm,
		isLoading = false,
		title,
		caption,
	}: LoginPageProps) => {
		const t = useT();
		const onSubmitLoginPage = (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			void onSubmitLoginForm();
		};

		return (
			<form onSubmit={onSubmitLoginPage}>
				<VStack fullWidth gap={8} className="p-4">
					<VStack fullWidth gap={2}>
						<h3 className="text-2xl font-bold">{t(title)}</h3>
						<span className="text-sm text-default-500">{t(caption)}</span>
					</VStack>

					<VStack fullWidth gap={4}>
						<LoginForm state={state.loginForm} />
					</VStack>

					{state.errorMessage && (
						<span className="text-sm font-medium text-danger">
							{t(state.errorMessage)}
						</span>
					)}

					<Button
						type="submit"
						color="primary"
						size="lg"
						fullWidth
						isLoading={isLoading}
					>
						<span className="text-white">{t("로그인")}</span>
					</Button>
				</VStack>
			</form>
		);
	},
);
