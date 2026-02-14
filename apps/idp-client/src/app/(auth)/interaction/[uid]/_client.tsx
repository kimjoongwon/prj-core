"use client";

import { useEffect, useState } from "react";
import { ConsentForm } from "./_components/ConsentForm";
import { ErrorScreen } from "./_components/ErrorScreen";
import { LoadingScreen } from "./_components/LoadingScreen";
import { LoginForm } from "./_components/LoginForm";

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
 * 인터랙션 데이터를 fetch하고, type에 따라 LoginForm 또는 ConsentForm을 렌더링합니다.
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
					setError(errorData.error || "인터랙션 데이터를 불러올 수 없습니다.");
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
		return <LoadingScreen />;
	}

	if (error || !data) {
		return <ErrorScreen message={error || "알 수 없는 오류가 발생했습니다."} />;
	}

	if (data.type === "consent") {
		return (
			<ConsentForm
				uid={uid}
				client={data.client}
				prompt={data.prompt}
			/>
		);
	}

	return (
		<LoginForm
			uid={uid}
			client={data.client}
			isDev={data.isDev}
		/>
	);
}
