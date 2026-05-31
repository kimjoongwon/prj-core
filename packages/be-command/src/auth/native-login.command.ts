import type { NativeLoginPayloadDto } from "@cocrepo/dto";
import type { Request } from "express";

export class NativeLoginCommand {
	constructor(
		readonly loginDto: NativeLoginPayloadDto,
		readonly req: Request,
	) {}
}
