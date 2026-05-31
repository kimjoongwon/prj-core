"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { FormEvent } from "react";
import { Button } from "../../control/Button/Button";
import { LoginForm, type LoginFormState } from "../../form/LoginForm/LoginForm";
import { useT } from "../../i18n";
import { VStack } from "../../rhythm/VStack/VStack";
import { Surface } from "../../surface";

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
 *   onSubmitLoginForm={onSubmitLoginForm}
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
			if (isLoading) {
				return;
			}
			void onSubmitLoginForm();
		};

		return (
			<form
				aria-busy={isLoading}
				aria-label={t(title)}
				className="w-full"
				onSubmit={onSubmitLoginPage}
			>
				<Surface
					className="overflow-hidden rounded-[2rem] border border-divider bg-content1/95 shadow-2xl shadow-default-100/10"
					padding="none"
				>
					<VStack fullWidth gap="flush">
						<VStack
							key="header"
							fullWidth
							gap="block"
							className="border-b border-divider bg-content2/50 px-6 py-5 text-left"
						>
							<span
								key="badge"
								className="inline-flex w-fit items-center gap-2 rounded-full border border-divider bg-background px-3 py-1 text-xs font-medium text-default-600"
							>
								<ShieldCheck aria-hidden className="size-4 text-primary" />
								Native access
							</span>
							<h3
								key="title"
								className="text-2xl font-bold leading-tight text-foreground"
							>
								{t(title)}
							</h3>
							<p key="caption" className="text-sm leading-6 text-default-500">
								{t(caption)}
							</p>
						</VStack>

						<VStack
							key="body"
							fullWidth
							gap="section"
							className="px-6 pb-6 pt-5 text-left"
						>
							<LoginForm key="form" state={state.loginForm} />

							<p
								key="feedback"
								aria-hidden={!state.errorMessage}
								aria-live="polite"
								className="min-h-5 text-sm font-medium text-danger"
								role={state.errorMessage ? "alert" : undefined}
							>
								{state.errorMessage ? t(state.errorMessage) : " "}
							</p>

							<Button
								key="submit"
								type="submit"
								color="primary"
								className="h-12 w-full rounded-xl shadow-lg shadow-primary/20"
								endContent={<ArrowRight aria-hidden className="size-4" />}
								fullWidth
								isDisabled={isLoading}
								isLoading={isLoading}
								size="lg"
							>
								{t("로그인")}
							</Button>
						</VStack>
					</VStack>
				</Surface>
			</form>
		);
	},
);
