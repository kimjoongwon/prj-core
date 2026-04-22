"use client";
import {
	useAbortInteraction,
	useSubmitLogin,
} from "@cocrepo/api/idp/interaction";

import type { AxiosError } from "axios";
import { type IReactionDisposer, makeAutoObservable, reaction } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { FormEvent, MouseEvent } from "react";
import { useEffect } from "react";
import {
	type LoginErrorResponse,
	OidcLoginForm,
	type OidcLoginFormState,
} from "../../../form/OidcLoginForm/OidcLoginForm";

export interface IdpLoginProps {
	/** OIDC 인터랙션 UID */
	uid: string;
	/** 클라이언트 정보 */
	client?: {
		clientId: string;
		name: string;
		logoUri?: string;
	} | null;
	/** DEV 모드 여부 */
	isDev?: boolean;
}

type SubmitLoginFn = (payload: {
	uid: string;
	data: {
		email: string;
		password: string;
		remember: boolean;
	};
}) => Promise<{ redirectTo: string }>;

type AbortInteractionFn = (payload: {
	uid: string;
}) => Promise<{ redirectTo?: string | null }>;

class IdpLoginFeatureState {
	oidcLoginForm: OidcLoginFormState;

	private readonly clearErrorDisposer: IReactionDisposer;

	constructor(isDev: boolean) {
		this.oidcLoginForm = {
			email: isDev ? "admin@plate.com" : "",
			password: isDev ? "rkdmf12!@" : "",
			remember: false,
			error: null,
			isSubmitting: false,
		};
		makeAutoObservable<IdpLoginFeatureState, "clearErrorDisposer">(
			this,
			{ clearErrorDisposer: false },
			{ autoBind: true },
		);
		this.clearErrorDisposer = reaction(
			() => `${this.oidcLoginForm.email}|${this.oidcLoginForm.password}`,
			() => {
				if (this.oidcLoginForm.error) {
					this.oidcLoginForm.error = null;
				}
			},
		);
	}

	async submitLogin(uid: string, submitLogin: SubmitLoginFn) {
		this.oidcLoginForm.error = null;
		this.oidcLoginForm.isSubmitting = true;

		try {
			const result = await submitLogin({
				uid,
				data: {
					email: this.oidcLoginForm.email,
					password: this.oidcLoginForm.password,
					remember: this.oidcLoginForm.remember,
				},
			});
			return result.redirectTo;
		} catch (err) {
			const axiosError = err as AxiosError<LoginErrorResponse>;
			if (axiosError.response?.data) {
				this.oidcLoginForm.error = axiosError.response.data;
				return null;
			}
			this.oidcLoginForm.error = {
				error: "NETWORK_ERROR",
				displayMessage: "서버와 통신할 수 없습니다.",
				hint: "잠시 후 다시 시도하거나 문제가 반복되면 관리자에게 문의하세요.",
			};
			return null;
		} finally {
			this.oidcLoginForm.isSubmitting = false;
		}
	}

	async abortInteraction(uid: string, abortInteraction: AbortInteractionFn) {
		try {
			const result = await abortInteraction({ uid });
			return result.redirectTo ?? null;
		} catch {
			return null;
		}
	}

	destroy() {
		this.clearErrorDisposer();
	}
}

/**
 * IDP 로그인 Feature
 *
 * OidcLoginForm Widget에 실제 API 호출 로직을 연결합니다.
 */
export const IdpLogin = observer(
	({ uid, client, isDev = false }: IdpLoginProps) => {
		const loginMutation = useSubmitLogin();
		const abortMutation = useAbortInteraction();
		const state = useLocalObservable(() => new IdpLoginFeatureState(isDev));

		useEffect(() => {
			return () => {
				state.destroy();
			};
		}, [state]);

		const onSubmitLoginForm = async () => {
			const redirectTo = await state.submitLogin(
				uid,
				loginMutation.mutateAsync,
			);
			if (redirectTo) {
				window.location.href = redirectTo;
			}
		};

		const onAbortInteraction = async () => {
			const redirectTo = await state.abortInteraction(
				uid,
				abortMutation.mutateAsync,
			);
			if (redirectTo) {
				window.location.href = redirectTo;
			}
		};

		const onSubmitIdpLogin = (event: FormEvent<HTMLDivElement>) => {
			event.preventDefault();
			void onSubmitLoginForm();
		};

		const onClickIdpLoginAction = (event: MouseEvent<HTMLDivElement>) => {
			if (!(event.target instanceof Element)) {
				return;
			}

			const actionElement = event.target.closest<HTMLElement>("[data-action]");
			const action = actionElement?.dataset.action;

			if (action === "abort-interaction") {
				void onAbortInteraction();
			}
		};

		return (
			<div onSubmit={onSubmitIdpLogin} onClickCapture={onClickIdpLoginAction}>
				<OidcLoginForm
					state={state.oidcLoginForm}
					client={client}
					isDev={isDev}
				/>
			</div>
		);
	},
);

IdpLogin.displayName = "IdpLogin";
