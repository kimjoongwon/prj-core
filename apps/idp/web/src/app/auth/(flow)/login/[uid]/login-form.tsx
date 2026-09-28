"use client";

import type { ApiClientError } from "@cocrepo/api/core/client";
import {
	useAbortInteraction,
	useSubmitLogin,
} from "@cocrepo/api/idp/interaction";
import type { OidcClientLoginUi } from "@cocrepo/type";
import { type LoginErrorResponse, OidcLoginForm } from "@cocrepo/ui";
import {
	type IReactionDisposer,
	makeAutoObservable,
	reaction,
	runInAction,
} from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { FormEvent, MouseEvent } from "react";
import { useEffect } from "react";

// 이 화면은 idp-web origin에서 렌더되므로 복구/가입 링크도 idp-web 자체 경로를
// 가리킨다(이전 값 /admin/auth/*는 이 origin에 없는 경로라 404였음).
const OIDC_FORGOT_PASSWORD_PATH = "/auth/forgot-password";
const OIDC_SIGN_UP_PATH = "/auth/sign-up";

export interface LoginInteractionClientInfo {
	clientId: string;
	name: string;
	logoUri?: string;
	loginUi?: OidcClientLoginUi | null;
}

export interface LoginInteractionFormProps {
	uid: string;
	client: LoginInteractionClientInfo | null;
	isDev: boolean;
}

class LoginInteractionFormState {
	email = "";
	password = "";
	remember = false;
	error: LoginErrorResponse | null = null;
	isSubmitting = false;

	private readonly clearErrorOnCredentialInput: IReactionDisposer;

	constructor(isDev: boolean) {
		makeAutoObservable<this, "clearErrorOnCredentialInput">(this, {
			clearErrorOnCredentialInput: false,
		});

		if (isDev) {
			this.email = "admin@plate.com";
			this.password = "rkdmf12!@";
		}

		this.clearErrorOnCredentialInput = reaction(
			() => [this.email, this.password],
			() => {
				if (this.error) {
					this.error = null;
				}
			},
		);
	}

	async submitLogin(
		request: (payload: {
			email: string;
			password: string;
			remember: boolean;
		}) => Promise<string>,
	) {
		this.error = null;
		this.isSubmitting = true;

		try {
			return await request({
				email: this.email,
				password: this.password,
				remember: this.remember,
			});
		} catch (err) {
			const apiError = err as ApiClientError<LoginErrorResponse>;

			runInAction(() => {
				if (apiError.body) {
					this.error = apiError.body;
					return;
				}

				this.error = {
					error: "NETWORK_ERROR",
					displayMessage: "서버와 통신할 수 없습니다.",
					hint: "잠시 후 다시 시도하거나 문제가 반복되면 관리자에게 문의하세요.",
				};
			});

			return null;
		} finally {
			runInAction(() => {
				this.isSubmitting = false;
			});
		}
	}

	async abortInteraction(request: () => Promise<string | null>) {
		try {
			return await request();
		} catch {
			return null;
		}
	}

	destroy() {
		this.clearErrorOnCredentialInput();
	}
}

/**
 * 로그인 interaction 폼 — 서버 컴포넌트가 조회한 interaction 데이터를 props로
 * 받고, 제출/취소만 브라우저에서 같은 origin API로 호출한다(제출 응답의
 * Set-Cookie가 브라우저에 심겨야 하므로 서버 대 서버 전환이 불가하다).
 */
export const LoginInteractionForm = observer(
	(props: LoginInteractionFormProps) => {
		const loginForm = useLocalObservable(
			() => new LoginInteractionFormState(props.isDev),
		);
		const loginMutation = useSubmitLogin();
		const abortMutation = useAbortInteraction();

		useEffect(() => {
			return () => {
				loginForm.destroy();
			};
		}, [loginForm]);

		const onSubmitLoginForm = async (event: FormEvent<HTMLDivElement>) => {
			event.preventDefault();

			const redirectTo = await loginForm.submitLogin(async (payload) => {
				const result = await loginMutation.mutateAsync({
					uid: props.uid,
					data: payload,
				});
				return result.redirectTo;
			});

			if (redirectTo) {
				window.location.href = redirectTo;
			}
		};

		const onClickLoginFormAction = async (
			event: MouseEvent<HTMLDivElement>,
		) => {
			if (!(event.target instanceof Element)) {
				return;
			}

			const actionElement = event.target.closest<HTMLElement>("[data-action]");
			if (actionElement?.dataset.action !== "abort-interaction") {
				return;
			}

			const redirectTo = await loginForm.abortInteraction(async () => {
				const result = await abortMutation.mutateAsync({ uid: props.uid });
				return result.redirectTo ?? null;
			});

			if (redirectTo) {
				window.location.href = redirectTo;
			}
		};

		return (
			<div onSubmit={onSubmitLoginForm} onClickCapture={onClickLoginFormAction}>
				<OidcLoginForm
					state={loginForm}
					client={props.client}
					isDev={props.isDev}
					forgotPasswordHref={OIDC_FORGOT_PASSWORD_PATH}
					signUpHref={OIDC_SIGN_UP_PATH}
				/>
			</div>
		);
	},
);

LoginInteractionForm.displayName = "LoginInteractionForm";
