"use client";

import { useParams } from "next/navigation";
import { useGetInteraction } from "@cocrepo/api/idp/interaction";
import { AuthCard, AuthCardHeader, IdpConsent, IdpLogin } from "@cocrepo/ui";
import { Spinner } from "@heroui/react";
import type { AxiosError } from "axios";
import { observer } from "mobx-react-lite";

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

/**
 * OIDC Interaction 클라이언트 컴포넌트
 *
 * useGetInteraction 쿼리 훅으로 인터랙션 데이터를 조회하고,
 * type에 따라 IdpLogin 또는 IdpConsent Feature를 렌더링합니다.
 */
const InteractionClient = observer(function InteractionClient({
	uid,
}: InteractionClientProps) {
	const { data, isLoading, error } = useGetInteraction(uid);
	const interactionError = error as AxiosError<{ message?: string }> | null;
	const errorStatus = interactionError?.response?.status;
	const isExpiredInteraction = errorStatus === 400 || errorStatus === 404;
	const errorMessage = isExpiredInteraction
		? "인증 세션이 만료되었거나 더 이상 유효하지 않습니다. 다시 로그인해 주세요."
		: interactionError?.response?.data?.message ||
			error?.message ||
			"알 수 없는 오류가 발생했습니다.";

	if (isLoading) {
		return (
			<AuthCard>
				<div className="flex flex-col items-center gap-4 py-8">
					<Spinner size="lg" />
					<p className="text-default-500">로딩 중...</p>
				</div>
			</AuthCard>
		);
	}

	if (error || !data) {
		return (
			<AuthCard variant="danger">
				<AuthCardHeader
					iconPath="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
					iconGradient="from-danger to-danger-400"
					title="오류 발생"
					titleClassName="text-danger"
				/>
				<div className="bg-danger/10 border border-danger/30 rounded-lg p-4 mb-6">
					<p className="text-sm text-danger">{errorMessage}</p>
				</div>
				<div className="text-center">
					<button
						type="button"
						className="px-6 py-2.5 bg-default-100 hover:bg-default-200 text-foreground font-medium rounded-lg transition-colors"
						onClick={() => {
							if (isExpiredInteraction) {
								window.location.href = "/auth/login";
								return;
							}

							window.history.back();
						}}
					>
						{isExpiredInteraction ? "다시 로그인" : "돌아가기"}
					</button>
				</div>
			</AuthCard>
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
			<IdpConsent
				uid={uid}
				client={data.client ?? null}
				missingScopes={missingScopes}
			/>
		);
	}

	return <IdpLogin uid={uid} client={data.client ?? null} isDev={data.isDev} />;
});

export default observer(InteractionPage);
