import { InteractionClient } from "./_client";

interface InteractionPageProps {
	params: Promise<{ uid: string }>;
}

/**
 * OIDC Interaction 페이지 (서버 컴포넌트)
 *
 * oidc-provider가 리다이렉트한 인터랙션 요청을 처리합니다.
 * uid 파라미터를 추출하여 클라이언트 컴포넌트에 전달합니다.
 */
export default async function InteractionPage({ params }: InteractionPageProps) {
	const { uid } = await params;
	return <InteractionClient uid={uid} />;
}
