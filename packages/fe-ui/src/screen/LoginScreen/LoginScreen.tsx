"use client";

import { ArrowRight, ShieldCheck, TriangleAlert } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { FormEvent } from "react";
import { Chip } from "../../data-display/Chip/Chip";
import { Typography } from "../../data-display/Typography";
import { LoginForm, type LoginFormState } from "../../form/LoginForm/LoginForm";
import { useT } from "../../i18n";
import { Button } from "../../input/Button/Button";
import { Section } from "../../layout";
import { HStack } from "../../rhythm/HStack/HStack";
import { VStack } from "../../rhythm/VStack/VStack";
import { SectionSurface } from "../../surface";
export interface LoginScreenState {
	loginForm: LoginFormState;
	/** 페이지 레벨 에러 메시지 */
	errorMessage: string;
}
export interface LoginScreenProps {
	/** 페이지가 소비하는 state slice */
	state: LoginScreenState;
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
 * LoginScreen 컴포넌트
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
 *       fieldErrors: {},
 *       errorMessage: null,
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
 * <LoginScreen
 *   state={state.loginPage}
 *   title="관리자 로그인"
 *   caption="예약, 회원, 권한 상태를 이어서 확인하세요."
 *   onSubmitLoginForm={onSubmitLoginForm}
 *   isLoading={isLoading}
 * />
 * ```
 */
export const LoginScreen = observer(
	({
		state,
		onSubmitLoginForm,
		isLoading = false,
		title,
		caption,
	}: LoginScreenProps) => {
		const t = useT();
		const onSubmitLoginScreen = (event: FormEvent<HTMLElement>) => {
			event.preventDefault();
			if (isLoading) {
				return;
			}
			void onSubmitLoginForm();
		};
		return (
			<div
				aria-busy={isLoading}
				className="w-full"
				onSubmit={onSubmitLoginScreen}
			>
				<SectionSurface className="rounded-2xl border border-border bg-surface shadow-surface">
					<Section overflow="hidden">
						<Section.Body>
							<VStack fullWidth className="p-6 sm:p-7">
								<VStack key="header" fullWidth className="text-left">
									<Chip
										key="badge"
										size="sm"
										color="accent"
										variant="soft"
										startContent={
											<ShieldCheck key="icon" aria-hidden className="size-4" />
										}
									>
										안전한 운영 세션
									</Chip>
									<Typography.Heading
										key="title"
										level={3}
										className="leading-tight"
									>
										{t(title)}
									</Typography.Heading>
									<Typography.Paragraph
										key="caption"
										color="muted"
										size="sm"
										className="leading-6 !text-foreground opacity-70"
									>
										{t(caption)}
									</Typography.Paragraph>
								</VStack>

								<HStack
									key="session-hint"
									alignItems="center"
									className="rounded-2xl border border-border bg-surface-secondary/60 p-3 text-left"
								>
									<span
										key="indicator"
										className="size-2 shrink-0 rounded-full bg-success"
									/>
									<Typography.Paragraph
										key="text"
										color="muted"
										size="xs"
										className="leading-5 !text-foreground opacity-75"
									>
										로그인 후 선택된 지점 scope로 관리자 API를 호출합니다.
									</Typography.Paragraph>
								</HStack>

								<LoginForm
									key="form"
									aria-label={t(title)}
									state={state.loginForm}
								>
									<div key="feedback" className="min-h-10">
										{state.errorMessage ? (
											<div
												aria-live="polite"
												className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-danger"
												role="alert"
											>
												<HStack alignItems="center">
													<TriangleAlert
														key="icon"
														aria-hidden
														className="size-4 shrink-0"
													/>
													<Typography
														key="text"
														type="body-sm"
														className="text-danger font-medium leading-5"
													>
														{t(state.errorMessage)}
													</Typography>
												</HStack>
											</div>
										) : (
											<Typography.Paragraph
												color="muted"
												size="xs"
												className="leading-5 !text-foreground opacity-70"
											>
												입력한 계정으로 운영 콘솔 접근 권한을 확인합니다.
											</Typography.Paragraph>
										)}
									</div>

									<Button
										key="submit"
										type="submit"
										variant="primary"
										className="h-12 w-full rounded-full"
										endContent={<ArrowRight aria-hidden className="size-4" />}
										fullWidth
										isDisabled={isLoading}
										isLoading={isLoading}
										size="lg"
									>
										{t("로그인")}
									</Button>
								</LoginForm>
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
			</div>
		);
	},
);
