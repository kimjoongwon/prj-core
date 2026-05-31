import type { Response } from "express";

export class RefreshTokenWithIdpCommand {
	constructor(
		readonly refreshToken: string,
		readonly sessionId: string | undefined,
		readonly res: Response,
	) {}
}
