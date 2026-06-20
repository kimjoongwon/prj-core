import type { Request, Response } from "express";

export class AbortInteractionCommand {
	constructor(
		readonly req: Request,
		readonly res: Response,
	) {}
}
