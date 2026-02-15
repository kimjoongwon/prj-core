"use client";

import {
	AuthCard,
	AuthCardHeader,
	IdpConsent,
	IdpLogin,
} from "@cocrepo/ui";
import { Spinner } from "@heroui/react";
import { useEffect, useState } from "react";

interface InteractionData {
	type: string;
	uid: string;
	client: {
		clientId: string;
		clientName: string;
		logoUri?: string;
	} | null;
	prompt: {
		name: string;
		details?: {
			missingOIDCScope?: string[];
			missingResourceScopes?: Record<string, string[]>;
		};
	};
	params: Record<string, unknown>;
	session?: Record<string, unknown>;
	isDev: boolean;
}

interface InteractionClientProps {
	uid: string;
}

/**
 * OIDC Interaction 클라이언트 컴포넌트
 *
 * 인터랙션 데이터를 fetch하고, type에 따라 IdpLogin 또는 IdpConsent Feature를 렌더링합니다.
 */
export function InteractionClient({ uid }: InteractionClientProps) {
	const [data, setData] = useState<InteractionData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchInteraction = async () => {
			try {
				const response = await fetch(`/api/interaction/${uid}`, {
					credentials: "include",
				});

				if (!response.ok) {
					const errorData = await response.json();
					setError(
						errorData.error ||
							"인터랙션 데이터를 불러올 수 없습니다.",
					);
					return;
				}

				const interactionData = await response.json();
				setData(interactionData);
			} catch {
				setError("서버와 통신할 수 없습니다.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchInteraction();
	}, [uid]);

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
					<p className="text-sm text-danger">
						{error || "알 수 없는 오류가 발생했습니다."}
					</p>
				</div>
				<div className="text-center">
					<button
						type="button"
						className="px-6 py-2.5 bg-default-100 hover:bg-default-200 text-foreground font-medium rounded-lg transition-colors"
						onClick={() => window.history.back()}
					>
						돌아가기
					</button>
				</div>
			</AuthCard>
		);
	}

	if (data.type === "consent") {
		const missingScopes = data.prompt.details?.missingOIDCScope || [];
		return (
			<IdpConsent
				uid={uid}
				client={data.client}
				missingScopes={missingScopes}
			/>
		);
	}

	return (
		<IdpLogin uid={uid} client={data.client} isDev={data.isDev} />
	);
}
