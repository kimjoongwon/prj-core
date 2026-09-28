import { redirect } from "next/navigation";
import { FocusedAuthLayoutStyle } from "../../_components/focused-auth-layout-style";
import { InteractionFailureScreen } from "../../_components/interaction-failure-screen";
import { fetchInteractionData } from "../../_lib/fetch-interaction-data";
import { resolveInteractionClient } from "../../_lib/resolve-interaction-client";
import { ConsentInteractionPanel } from "./consent-panel";

/**
 * 동의 interaction 페이지(서버 컴포넌트).
 *
 * 로그인 후에도 동의가 남은 interaction(또는 prompt=consent 요청)이 도착하는
 * 주소다. 누락 scope 목록을 서버에서 계산해 패널에 전달한다.
 */
export default async function ConsentInteractionPage({
	params,
}: {
	params: Promise<{ uid: string }>;
}) {
	const { uid } = await params;
	const interactionLookup = await fetchInteractionData(uid);

	if (interactionLookup.status !== "ok") {
		return (
			<InteractionFailureScreen
				isExpired={interactionLookup.status === "expired"}
				message={interactionLookup.message}
			/>
		);
	}

	if (interactionLookup.data.type !== "consent") {
		redirect(`/auth/login/${uid}`);
	}

	const client = resolveInteractionClient(interactionLookup.data.client);
	const missingScopes = extractMissingOidcScopes(interactionLookup.data.prompt);

	return (
		<>
			<FocusedAuthLayoutStyle loginUi={client?.loginUi} />
			<ConsentInteractionPanel
				uid={uid}
				client={client}
				missingScopes={missingScopes}
			/>
		</>
	);
}

function extractMissingOidcScopes(prompt: unknown): string[] {
	const promptDetails = (
		prompt as { details?: { missingOIDCScope?: string[] } } | undefined
	)?.details;

	return promptDetails?.missingOIDCScope ?? [];
}
