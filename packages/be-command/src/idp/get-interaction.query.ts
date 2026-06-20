import type { Request, Response } from "express";

export class GetInteractionQuery {
	constructor(
		readonly uid: string,
		readonly req: Request,
		readonly res: Response,
	) {}
}
