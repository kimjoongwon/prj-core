import type { Request, Response } from "express";

export class HandleOidcCallbackCommand {
	constructor(
		readonly clientId: string,
		readonly code: string,
		readonly state: string,
		readonly error: string,
		readonly errorDescription: string,
		readonly req: Request,
		readonly res: Response,
	) {}
}
