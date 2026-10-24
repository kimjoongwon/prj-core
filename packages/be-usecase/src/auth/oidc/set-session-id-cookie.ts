import { Token } from "@cocrepo/constant";
import { Cookie, SessionId } from "@cocrepo/vo";
import type { Response } from "express";

export function setSessionIdCookie(res: Response, sessionSeq: string): void {
	const normalizedSessionId = SessionId.fromString(sessionSeq);
	const cookie = Cookie.forToken("7d");
	res.cookie(
		Token.SESSION_ID,
		normalizedSessionId.value,
		cookie.toExpressOptions(),
	);
}
