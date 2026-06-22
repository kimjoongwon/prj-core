import type { Request, Response } from "express";
import type { SubmitInteractionLoginCommandInput } from "@cocrepo/input";

export class SubmitInteractionLoginCommand implements SubmitInteractionLoginCommandInput {
	readonly email!: SubmitInteractionLoginCommandInput["email"];
	readonly password!: SubmitInteractionLoginCommandInput["password"];
	readonly remember?: SubmitInteractionLoginCommandInput["remember"];

	constructor(
		input: SubmitInteractionLoginCommandInput,
		readonly req: Request,
		readonly res: Response,
	) {
		Object.assign(this, input);
	}
}
