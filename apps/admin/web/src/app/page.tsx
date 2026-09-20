import { Token } from "@cocrepo/constant";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * 세션 표시(loggedIn) 쿠키는 민감하지 않아 서버가 읽을 수 있다.
 * 실제 세션 검증은 (authenticated) 그룹의 SessionBootstrap이 담당하므로
 * 루트는 표시 존재만으로 즉시 리다이렉트한다.
 */
export default async function HomePage() {
	const cookieStore = await cookies();
	const sessionPresenceMarker = cookieStore.get(Token.LOGGED_IN);
	const hasSessionPresence = sessionPresenceMarker?.value === "1";

	redirect(hasSessionPresence ? "/dashboard" : "/auth/login");
}
