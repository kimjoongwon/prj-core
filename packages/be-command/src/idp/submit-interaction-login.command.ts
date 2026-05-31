import type { OidcLoginPayloadDto } from "@cocrepo/dto";
import type { Request, Response } from "express";

export class SubmitInteractionLoginCommand {
	constructor(
		readonly loginDto: OidcLoginPayloadDto,
		readonly req: Request,
		readonly res: Response,
	) {}
}
