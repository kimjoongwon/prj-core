import type { Response } from "express";

export class LogoutWithCookieCommand {
	constructor(
		readonly accessTokenCookie: string | undefined,
		readonly authorizationHeader: string | undefined,
		readonly sessionId: string | undefined,
		readonly res: Response,
	) {}
}
