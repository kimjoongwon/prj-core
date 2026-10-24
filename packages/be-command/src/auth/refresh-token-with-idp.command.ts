import type { Response } from "express";

export class RefreshTokenWithIdpCommand {
	constructor(
		readonly refreshTokenCookie: string | undefined,
		readonly refreshTokenHeader: string | undefined,
		/** OIDC session protocol ID. */
		readonly sessionSeq: string | undefined,
		readonly res: Response,
	) {}
}
