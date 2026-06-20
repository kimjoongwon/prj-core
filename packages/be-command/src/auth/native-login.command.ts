import type { Request } from "express";
import type { NativeLoginCommandInput } from "./native-login.input";

export class NativeLoginCommand {
	constructor(
		readonly input: NativeLoginCommandInput,
		readonly req: Request,
	) {}
}
