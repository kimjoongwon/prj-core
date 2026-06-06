import type { Response } from "express";

export class RefreshTokenWithIdpCommand {
	constructor(
		readonly refreshTokenCookie: string | undefined,
		readonly refreshTokenHeader: string | undefined,
		readonly sessionId: string | undefined,
		readonly res: Response,
	) {}
}
