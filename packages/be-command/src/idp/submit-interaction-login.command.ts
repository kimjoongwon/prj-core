import type { SubmitInteractionLoginCommandInput } from "./submit-interaction-login.input";
import type { Request, Response } from "express";

export class SubmitInteractionLoginCommand {
	constructor(
		readonly input: SubmitInteractionLoginCommandInput,
		readonly req: Request,
		readonly res: Response,
	) {}
}
