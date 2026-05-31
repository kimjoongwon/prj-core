import type { Response } from "express";

export class LogoutWithCookieCommand {
	constructor(
		readonly accessToken: string | undefined,
		readonly sessionId: string | undefined,
		readonly res: Response,
	) {}
}
