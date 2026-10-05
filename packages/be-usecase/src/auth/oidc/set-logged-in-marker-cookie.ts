import { Token } from "@cocrepo/constant";
import { Cookie } from "@cocrepo/vo";
import type { Response } from "express";

/**
 * 세션 존재 표시 쿠키(loggedIn)를 심는다. HttpOnly 인증 쿠키와 달리 이 값은
 * 민감하지 않아 클라이언트가 읽을 수 있으며, 웹 앱은 이 표시가 없으면 토큰
 * 갱신을 시도하지 않고 로그인 화면으로 보낸다.
 */
export function setLoggedInMarkerCookie(res: Response): void {
	const cookie = Cookie.forPresence("7d");
	res.cookie(Token.LOGGED_IN, "1", cookie.toExpressOptions());
}
