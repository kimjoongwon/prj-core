import { redirect } from "next/navigation";
import { FocusedAuthLayoutStyle } from "../../_components/focused-auth-layout-style";
import { InteractionFailureScreen } from "../../_components/interaction-failure-screen";
import { fetchInteractionData } from "../../_lib/fetch-interaction-data";
import { resolveInteractionClient } from "../../_lib/resolve-interaction-client";
import { LoginInteractionForm } from "./login-form";

/**
 * 로그인 interaction 페이지(서버 컴포넌트).
 *
 * oidc-provider가 로그인 프롬프트를 위해 302로 보내는 주소다. interaction
 * 데이터를 서버에서 조회해 첫 페인트부터 클라이언트 브랜딩이 적용된 폼을
 * 렌더하고, 만료/오류는 즉시 실패 화면으로 응답한다.
 */
export default async function LoginInteractionPage({
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

	if (interactionLookup.data.type === "consent") {
		redirect(`/auth/consent/${uid}`);
	}

	const client = resolveInteractionClient(interactionLookup.data.client);

	return (
		<>
			<FocusedAuthLayoutStyle loginUi={client?.loginUi} />
			<LoginInteractionForm
				uid={uid}
				client={client}
				isDev={interactionLookup.data.isDev}
			/>
		</>
	);
}
