import type { SubmitInteractionLoginCommandInput } from "@cocrepo/input";
import type { Request, Response } from "express";

export class SubmitInteractionLoginCommand
	implements SubmitInteractionLoginCommandInput
{
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
