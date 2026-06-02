"use client";

import { ArrowRight, ShieldCheck, TriangleAlert } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { FormEvent } from "react";
import { Button } from "../../control/Button/Button";
import { Text } from "../../display/data-display/Text/Text";
import { LoginForm, type LoginFormState } from "../../form/LoginForm/LoginForm";
import { useT } from "../../i18n";
import { HStack } from "../../rhythm/HStack/HStack";
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
 *   caption="예약, 결제, 권한 상태를 이어서 확인하세요."
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
					className="overflow-hidden rounded-2xl border border-divider bg-content1 shadow-lg shadow-default-100/10"
					padding="none"
				>
					<VStack fullWidth gap="section" className="p-6 sm:p-7">
						<VStack key="header" fullWidth gap="block" className="text-left">
							<HStack
								key="badge"
								alignItems="center"
								gap="inline"
								className="w-fit rounded-full border border-divider bg-content2 px-3 py-1 text-default-600"
							>
								<ShieldCheck
									key="icon"
									aria-hidden
									className="size-4 text-primary"
								/>
								<Text
									key="text"
									as="span"
									variant="caption"
									className="font-medium !text-foreground opacity-70"
								>
									안전한 운영 세션
								</Text>
							</HStack>
							<Text
								key="title"
								as="h2"
								variant="h3"
								className="leading-tight"
							>
								{t(title)}
							</Text>
							<Text
								key="caption"
								variant="subtitle2"
								className="leading-6 !text-foreground opacity-70"
							>
								{t(caption)}
							</Text>
						</VStack>

						<HStack
							key="session-hint"
							alignItems="center"
							gap="block"
							className="rounded-2xl border border-divider bg-content2/60 p-3 text-left"
						>
							<span
								key="indicator"
								className="size-2 shrink-0 rounded-full bg-success"
							/>
							<Text
								key="text"
								variant="caption"
								className="leading-5 !text-foreground opacity-75"
							>
								로그인 후 선택된 지점 scope로 관리자 API를 호출합니다.
							</Text>
						</HStack>

						<LoginForm key="form" state={state.loginForm} />

						<div key="feedback" className="min-h-10">
							{state.errorMessage ? (
								<div
									aria-live="polite"
									className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-danger"
									role="alert"
								>
									<HStack alignItems="center" gap="inline">
										<TriangleAlert
											key="icon"
											aria-hidden
											className="size-4 shrink-0"
										/>
										<Text
											key="text"
											as="span"
											variant="error"
											className="leading-5"
										>
											{t(state.errorMessage)}
										</Text>
									</HStack>
								</div>
							) : (
								<Text
									variant="caption"
									className="leading-5 !text-foreground opacity-70"
								>
									입력한 계정으로 운영 콘솔 접근 권한을 확인합니다.
								</Text>
							)}
						</div>

						<Button
							key="submit"
							type="submit"
							color="primary"
							className="h-12 w-full rounded-full shadow-md shadow-primary/15"
							endContent={<ArrowRight aria-hidden className="size-4" />}
							fullWidth
							isDisabled={isLoading}
							isLoading={isLoading}
							size="lg"
						>
							{t("로그인")}
						</Button>
					</VStack>
				</Surface>
			</form>
		);
	},
);
