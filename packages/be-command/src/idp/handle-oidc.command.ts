import type { Request, Response } from "express";

export class HandleOidcCommand {
	constructor(
		readonly req: Request,
		readonly res: Response,
	) {}
}
