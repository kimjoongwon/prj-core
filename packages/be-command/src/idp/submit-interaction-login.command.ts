import type { Request, Response } from "express";
import type { SubmitInteractionLoginCommandInput } from "./submit-interaction-login.input";

export class SubmitInteractionLoginCommand {
	constructor(
		readonly input: SubmitInteractionLoginCommandInput,
		readonly req: Request,
		readonly res: Response,
	) {}
}
