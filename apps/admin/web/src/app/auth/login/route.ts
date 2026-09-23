import { type NextRequest, NextResponse } from "next/server";

const OIDC_LOGIN_START_PATH = "/api/v1/auth/oidc/login?clientId=admin-web";

/**
 * 로그인 진입 라우트 — 렌더할 화면 없이 core-api의 OIDC authorize 시작점으로
 * 즉시 보낸다. 자격증명 입력은 IDP 로그인 화면(auth/interaction)에서 이뤄진다.
 *
 * 서버 컴포넌트의 redirect()는 Location에 basePath(/admin)를 강제로 붙이므로
 * Route Handler에서 Location을 직접 내보낸다. 절대 URL 대신 루트 상대 경로를
 * 쓰면 방문 중인 origin 그대로 해석되어(개발은 next rewrite, 배포는 ingress
 * 라우팅) 프록시 헤더 계약에 의존하지 않는다. returnTo는 core-api가 인증 완료
 * 후 돌려보낼 앱 절대 경로(예: /admin/dashboard)로 정규화해 전달한다.
 */
export function GET(request: NextRequest) {
	const requestedReturnTo = request.nextUrl.searchParams.get("returnTo");
	const oidcLoginStartLocation = requestedReturnTo
		? `${OIDC_LOGIN_START_PATH}&returnTo=${encodeURIComponent(
				`/admin${requestedReturnTo.startsWith("/") ? requestedReturnTo : `/${requestedReturnTo}`}`,
			)}`
		: OIDC_LOGIN_START_PATH;

	return new NextResponse(null, {
		status: 307,
		headers: { Location: oidcLoginStartLocation },
	});
}
