"use client";

import {
	useAbortInteraction,
	useConfirmConsent,
	useGetInteraction,
	useSubmitLogin,
} from "@cocrepo/api/idp/interaction";
import { OidcInteractionPage, type LoginErrorResponse } from "@cocrepo/ui";
import type { AxiosError } from "axios";
import { observer } from "mobx-react-lite";
import { useParams } from "next/navigation";

type InteractionPageParams = {
	uid: string;
};

function InteractionPage() {
	const { uid } = useParams<InteractionPageParams>();

	return <InteractionClient uid={uid} />;
}

interface InteractionClientProps {
	uid: string;
}

const InteractionClient = observer(function InteractionClient({
	uid,
}: InteractionClientProps) {
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

	const onAbortInteraction = async () => {
		try {
			const result = await abortMutation.mutateAsync({ uid });
			if (result.redirectTo) {
				window.location.href = result.redirectTo;
			}
		} catch {
			// 에러 무시
		}
	};

	const onSubmitLogin = async (data: {
		email: string;
		password: string;
		remember: boolean;
	}): Promise<LoginErrorResponse | null> => {
		try {
			const result = await loginMutation.mutateAsync({
				uid,
				data,
			});
			window.location.href = result.redirectTo;
			return null;
		} catch (err) {
			const axiosError = err as AxiosError<LoginErrorResponse>;
			if (axiosError.response?.data) {
				return axiosError.response.data;
			}
			return {
				error: "NETWORK_ERROR",
				displayMessage: "서버와 통신할 수 없습니다.",
				hint: "잠시 후 다시 시도하거나 문제가 반복되면 관리자에게 문의하세요.",
			};
		}
	};

	const onConfirmConsent = async (): Promise<string | null> => {
		try {
			const result = await consentMutation.mutateAsync({ uid });
			window.location.href = result.redirectTo;
			return null;
		} catch {
			return "서버와 통신할 수 없습니다.";
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
		return <OidcInteractionPage mode="loading" />;
	}

	if (error || !data) {
		return (
			<OidcInteractionPage
				mode="error"
				errorMessage={errorMessage}
				isExpiredInteraction={isExpiredInteraction}
				onClickRecoveryButton={onClickRecoveryButton}
			/>
		);
	}

	if (data.type === "consent") {
		const prompt = data.prompt as {
			name: string;
			details?: {
				missingOIDCScope?: string[];
			};
		};
		const missingScopes = prompt.details?.missingOIDCScope || [];
		return (
			<OidcInteractionPage
				mode="consent"
				client={data.client ?? null}
				missingScopes={missingScopes}
				onConfirmConsent={onConfirmConsent}
				onAbortInteraction={onAbortInteraction}
			/>
		);
	}

	return (
		<OidcInteractionPage
			mode="login"
			client={data.client ?? null}
			isDev={data.isDev}
			onSubmitLogin={onSubmitLogin}
			onAbortInteraction={onAbortInteraction}
		/>
	);
});

export default observer(InteractionPage);
