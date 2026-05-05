"use client";

import {
	useAbortInteraction,
	useConfirmConsent,
	useGetInteraction,
	useSubmitLogin,
} from "@cocrepo/api/idp/interaction";
import { type LoginErrorResponse, OidcInteractionPage } from "@cocrepo/ui";
import type { AxiosError } from "axios";
import {
	type IReactionDisposer,
	makeAutoObservable,
	reaction,
	runInAction,
} from "mobx";
import type { OidcClientLoginUi } from "@cocrepo/type";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useParams } from "next/navigation";
import { useEffect } from "react";

type InteractionPageParams = {
	uid: string;
};

class InteractionRoutePageState {
	mode: "loading" | "error" | "login" | "consent" = "loading";
	client: {
		clientId: string;
		name: string;
		logoUri?: string;
		loginUi?: OidcClientLoginUi | null;
	} | null = null;
	isDev = false;
	errorMessage = "";
	isExpiredInteraction = false;
	missingScopes: string[] = [];
	oidcConsentPanel = {
		errorMessage: null as string | null,
		isSubmitting: false,
	};
	oidcLoginForm = {
		email: "",
		password: "",
		remember: false,
		error: null as LoginErrorResponse | null,
		isSubmitting: false,
	};

	private hasAppliedDevDefaults = false;
	private readonly disposeLoginErrorReaction: IReactionDisposer;

	constructor() {
		makeAutoObservable<
			this,
			"hasAppliedDevDefaults" | "disposeLoginErrorReaction"
		>(this, {
			hasAppliedDevDefaults: false,
			disposeLoginErrorReaction: false,
		});

		this.disposeLoginErrorReaction = reaction(
			() => [this.oidcLoginForm.email, this.oidcLoginForm.password],
			() => {
				if (this.oidcLoginForm.error) {
					this.oidcLoginForm.error = null;
				}
			},
		);
	}

	syncInteraction(params: {
		data:
			| {
					type: string;
					client?: {
						clientId: string;
						name: string;
						logoUri?: string;
						loginUi?: unknown | null;
					} | null;
					isDev?: boolean;
			  }
			| undefined;
		error: unknown;
		isLoading: boolean;
		errorMessage: string;
		isExpiredInteraction: boolean;
		missingScopes: string[];
	}) {
		const {
			data,
			error,
			errorMessage,
			isExpiredInteraction,
			isLoading,
			missingScopes,
		} = params;

		this.mode = isLoading
			? "loading"
			: error || !data
				? "error"
				: data.type === "consent"
					? "consent"
					: "login";
		this.client = data?.client
			? {
					clientId: data.client.clientId,
					name: data.client.name,
					logoUri: data.client.logoUri,
					loginUi: data.client.loginUi as OidcClientLoginUi | null | undefined,
				}
			: null;
		this.isDev = Boolean(data?.isDev);
		this.errorMessage = errorMessage;
		this.isExpiredInteraction = isExpiredInteraction;
		this.missingScopes = [...missingScopes];

		if (this.isDev && !this.hasAppliedDevDefaults) {
			this.oidcLoginForm.email = "admin@onora.com";
			this.oidcLoginForm.password = "rkdmf12!@";
			this.hasAppliedDevDefaults = true;
		}
	}

	async submitLogin(
		request: (payload: {
			email: string;
			password: string;
			remember: boolean;
		}) => Promise<string>,
	) {
		this.oidcLoginForm.error = null;
		this.oidcLoginForm.isSubmitting = true;

		try {
			return await request({
				email: this.oidcLoginForm.email,
				password: this.oidcLoginForm.password,
				remember: this.oidcLoginForm.remember,
			});
		} catch (err) {
			const axiosError = err as AxiosError<LoginErrorResponse>;

			runInAction(() => {
				if (axiosError.response?.data) {
					this.oidcLoginForm.error = axiosError.response.data;
					return;
				}

				this.oidcLoginForm.error = {
					error: "NETWORK_ERROR",
					displayMessage: "서버와 통신할 수 없습니다.",
					hint: "잠시 후 다시 시도하거나 문제가 반복되면 관리자에게 문의하세요.",
				};
			});

			return null;
		} finally {
			runInAction(() => {
				this.oidcLoginForm.isSubmitting = false;
			});
		}
	}

	async confirmConsent(request: () => Promise<string>) {
		this.oidcConsentPanel.errorMessage = null;
		this.oidcConsentPanel.isSubmitting = true;

		try {
			return await request();
		} catch {
			runInAction(() => {
				this.oidcConsentPanel.errorMessage = "서버와 통신할 수 없습니다.";
			});
			return null;
		} finally {
			runInAction(() => {
				this.oidcConsentPanel.isSubmitting = false;
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
		this.disposeLoginErrorReaction();
	}
}

const InteractionPage = observer(() => {
	const { uid } = useParams<InteractionPageParams>();
	const oidcInteractionPage = useLocalObservable(
		() => new InteractionRoutePageState(),
	);
	const { data, isLoading, error } = useGetInteraction(uid);
	const loginMutation = useSubmitLogin();
	const abortMutation = useAbortInteraction();
	const consentMutation = useConfirmConsent();
	const interactionError = error as AxiosError<{
		message?: string;
		error?: string;
	}> | null;
	const errorStatus = interactionError?.response?.status;
	const isExpiredInteraction = errorStatus === 400 || errorStatus === 404;
	const errorMessage = isExpiredInteraction
		? "인증 세션이 만료되었거나 더 이상 유효하지 않습니다. 다시 로그인해 주세요."
		: interactionError?.response?.data?.error ||
			interactionError?.response?.data?.message ||
			error?.message ||
			"알 수 없는 오류가 발생했습니다.";
	const missingScopes =
		data?.type === "consent"
			? ((
					data.prompt as {
						name: string;
						details?: {
							missingOIDCScope?: string[];
						};
					}
				).details?.missingOIDCScope ?? [])
			: [];

	useEffect(() => {
		oidcInteractionPage.syncInteraction({
			data,
			error,
			isLoading,
			errorMessage,
			isExpiredInteraction,
			missingScopes,
		});
	}, [
		data,
		error,
		errorMessage,
		isExpiredInteraction,
		isLoading,
		missingScopes,
		oidcInteractionPage,
	]);

	useEffect(() => {
		return () => {
			oidcInteractionPage.destroy();
		};
	}, [oidcInteractionPage]);

	const onAbortInteraction = async () => {
		const redirectTo = await oidcInteractionPage.abortInteraction(async () => {
			const result = await abortMutation.mutateAsync({ uid });
			return result.redirectTo ?? null;
		});

		if (redirectTo) {
			window.location.href = redirectTo;
		}
	};

	const onSubmitLoginForm = async () => {
		const redirectTo = await oidcInteractionPage.submitLogin(
			async (payload) => {
				const result = await loginMutation.mutateAsync({
					uid,
					data: payload,
				});
				return result.redirectTo;
			},
		);

		if (redirectTo) {
			window.location.href = redirectTo;
		}
	};

	const onConfirmConsent = async () => {
		const redirectTo = await oidcInteractionPage.confirmConsent(async () => {
			const result = await consentMutation.mutateAsync({ uid });
			return result.redirectTo;
		});

		if (redirectTo) {
			window.location.href = redirectTo;
		}
	};

	const onClickRecoveryButton = () => {
		if (isExpiredInteraction) {
			window.location.href = "/auth/login";
			return;
		}

		if (window.history.length > 1) {
			window.history.back();
			return;
		}

		window.location.href = "/auth/login";
	};

	if (isLoading) {
		return (
			<OidcInteractionPage
				state={oidcInteractionPage}
				onAbortInteraction={onAbortInteraction}
				onSubmitLoginForm={onSubmitLoginForm}
				onConfirmConsent={onConfirmConsent}
			/>
		);
	}

	if (error || !data) {
		return (
			<OidcInteractionPage
				state={oidcInteractionPage}
				onClickRecoveryButton={onClickRecoveryButton}
				onAbortInteraction={onAbortInteraction}
				onSubmitLoginForm={onSubmitLoginForm}
				onConfirmConsent={onConfirmConsent}
			/>
		);
	}

	if (data.type === "consent") {
		return (
			<OidcInteractionPage
				state={oidcInteractionPage}
				onConfirmConsent={onConfirmConsent}
				onAbortInteraction={onAbortInteraction}
				onSubmitLoginForm={onSubmitLoginForm}
			/>
		);
	}

	return (
		<OidcInteractionPage
			state={oidcInteractionPage}
			onSubmitLoginForm={onSubmitLoginForm}
			onAbortInteraction={onAbortInteraction}
			onConfirmConsent={onConfirmConsent}
		/>
	);
});

export default InteractionPage;
