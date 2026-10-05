import { Token } from "@cocrepo/constant";
import { dehydrate, type DehydratedState } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { makeAdminQueryClient } from "../query-client";
import { AuthenticatedProviders } from "./authenticated-providers";
import { prefetchAuthenticatedTenantQueries } from "./authenticated-server-prefetch";

/**
 * 인증된 라우트 그룹 layout
 *
 * 진입 판별과 테넌트 확정 조회를 서버가 소유한다.
 *
 * 1) 진입 판별: loggedIn 마커 쿠키가 없으면 인증 쿠키도 없다는 뜻(같은 로그인
 *    흐름에서 함께 심는다)이므로 클라이언트 API 호출 없이 로그인 화면으로
 *    보낸다. 루트 page의 진입 판별과 같은 계약이다.
 * 2) 테넌트 확정: HttpOnly accessToken 쿠키로 current-space/my-spaces를
 *    prefetch해 dehydrate → AuthenticatedProviders의 HydrationBoundary로
 *    전달한다. 클라이언트에는 세션 채우기(token/refresh 1회)만 남는다.
 *    accessToken이 없거나 prefetch가 실패하면 dehydratedState를 전달하지
 *    않고 기존 클라이언트 폭포로 폴백한다.
 *
 * 이 트리 안의 라우트((admin) 그룹)에 들어온 순간부터 세션·권한·
 * tenant bootstrap이 동작한다. /auth/*는 이 그룹 밖에 있어 로그인 화면에서
 * 인증 API가 호출되지 않는다.
 */
export default async function AuthenticatedLayout({
	children,
}: {
	children: ReactNode;
}) {
	const cookieStore = await cookies();

	// 세션 표시(loggedIn)가 없는 방문자는 인증 쿠키도 없다는 뜻이므로 API
	// 호출 없이 로그인 화면으로 보낸다.
	if (!cookieStore.has(Token.LOGGED_IN)) {
		redirect("/auth/login");
	}

	const accessToken = cookieStore.get(Token.ACCESS)?.value;
	let dehydratedState: DehydratedState | undefined;

	if (accessToken) {
		const queryClient = makeAdminQueryClient();
		try {
			await prefetchAuthenticatedTenantQueries({ queryClient, accessToken });
			dehydratedState = dehydrate(queryClient);
		} catch {
			// prefetch 실패 시 클라이언트 폭포(SessionBootstrap →
			// useTenantBootstrapFromApi)로 폴백한다.
		}
	}

	return (
		<AuthenticatedProviders dehydratedState={dehydratedState}>
			{children}
		</AuthenticatedProviders>
	);
}
