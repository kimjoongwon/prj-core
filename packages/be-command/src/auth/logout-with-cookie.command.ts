import type { Response } from "express";

export class LogoutWithCookieCommand {
	constructor(
		readonly accessTokenCookie: string | undefined,
		readonly authorizationHeader: string | undefined,
		/** OIDC session protocol ID. */
		readonly sessionSeq: string | undefined,
		readonly res: Response,
	) {}
}
